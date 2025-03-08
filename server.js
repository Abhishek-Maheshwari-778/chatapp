const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// File path for saving rooms data
const roomsFilePath = path.join(__dirname, 'rooms.json');

// Serve static files (your front-end)
app.use(express.static('public'));

// Start the HTTP server
const server = app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });

// Store users and chat rooms in memory
let users = {};  // Format: { username: { ws, room } }
let rooms = {};  // Format: { roomName: [user1, user2, ...] }

// Load rooms from the file (if any)
function loadRooms() {
    if (fs.existsSync(roomsFilePath)) {
        const data = fs.readFileSync(roomsFilePath, 'utf8');
        rooms = JSON.parse(data);
    }
}

// Save rooms to the file
function saveRooms() {
    fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2), 'utf8');
}

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New connection established.');

    // Send the updated room list to the new client
    ws.send(JSON.stringify({ type: 'roomListUpdate', rooms: Object.keys(rooms) }));

    // Receive messages from clients
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'join':
                handleJoin(ws, data);
                break;
            case 'message':
                handleMessage(ws, data);
                break;
            case 'createRoom':
                handleCreateRoom(ws, data);
                break;
            case 'leave':
                handleLeave(ws, data);
                break;
        }
    });

    // When a connection closes, remove the user from the room
    ws.on('close', () => {
        handleLeave(ws);
    });
});

// Handle user joining a room
function handleJoin(ws, data) {
    const { username, room } = data;

    // Check if the username is already taken
    if (users[username]) {
        ws.send(JSON.stringify({ type: 'error', message: 'Username already taken.' }));
        return;
    }

    // Join the chat room
    users[username] = { ws, room };
    if (!rooms[room]) {
        rooms[room] = [];
    }
    rooms[room].push(username);

    ws.send(JSON.stringify({ type: 'joined', room }));
    broadcastMessage(room, `${username} has joined the room.`, 'System');

    // Save the rooms data to file
    saveRooms();

    // Send the list of users in the room
    sendUserList(room);
}

// Handle sending a message
function handleMessage(ws, data) {
    const { username, room, message } = data;

    if (!message.trim()) return; // Ignore empty messages

    const timestamp = new Date().toLocaleTimeString();
    broadcastMessage(room, message, username, timestamp);
}

// Broadcast a message to all users in a room
function broadcastMessage(room, message, username, timestamp = '') {
    if (!rooms[room]) return;

    rooms[room].forEach((user) => {
        const userWs = users[user]?.ws;
        if (userWs && userWs.readyState === WebSocket.OPEN) {
            userWs.send(JSON.stringify({
                type: 'message',
                message,
                username,
                timestamp
            }));
        }
    });
}

// Handle user creating a new room
function handleCreateRoom(ws, data) {
    const { room } = data;
    if (rooms[room]) {
        ws.send(JSON.stringify({ type: 'error', message: 'Room already exists.' }));
    } else {
        rooms[room] = [];
        ws.send(JSON.stringify({ type: 'roomCreated', room }));

        // Save the rooms data to file
        saveRooms();

        // Broadcast the updated room list to all clients
        broadcastRoomList();
    }
}

// Send the list of available rooms to all clients
function broadcastRoomList() {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'roomListUpdate', rooms: Object.keys(rooms) }));
        }
    });
}

// Handle user leaving a room
function handleLeave(ws, data = {}) {
    const { username } = data;

    if (username) {
        const userRoom = users[username]?.room;
        if (userRoom) {
            rooms[userRoom] = rooms[userRoom].filter(user => user !== username);
            delete users[username];
            broadcastMessage(userRoom, `${username} has left the room.`, 'System');
            sendUserList(userRoom);
        }
    }

    // Save the rooms data to file
    saveRooms();
}

// Send the list of users in the room to all clients in that room
function sendUserList(room) {
    if (!rooms[room]) return;

    const userList = rooms[room];
    userList.forEach((user) => {
        const userWs = users[user]?.ws;
        if (userWs && userWs.readyState === WebSocket.OPEN) {
            userWs.send(JSON.stringify({ type: 'userList', users: userList }));
        }
    });
}

loadRooms();  // Load existing rooms when the server starts

let ws;
let currentUser = '';
let currentRoom = '';

// DOM Elements
const joinModal = document.getElementById('joinModal');
const createRoomModal = document.getElementById('createRoomModal');
const usernameInput = document.getElementById('usernameInput');
const roomNameInput = document.getElementById('roomNameInput');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const roomList = document.getElementById('roomList');
const userList = document.getElementById('userList');

// Show join modal on page load
window.onload = () => {
    joinModal.style.display = 'block';
};

// Connect to WebSocket server
function connectWebSocket() {
    ws = new WebSocket(`ws://${window.location.hostname}:3000`);
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
    };

    ws.onclose = () => {
        alert('Connection closed. Please refresh the page.');
    };
}

// Handle WebSocket messages
function handleWebSocketMessage(data) {
    switch(data.type) {
        case 'roomListUpdate':
            updateRoomList(data.rooms);
            break;
        case 'userList':
            updateUserList(data.users);
            break;
        case 'message':
            displayMessage(data);
            break;
        case 'error':
            alert(data.message);
            break;
        case 'joined':
            currentRoom = data.room;
            document.querySelector('.chat-header h2').textContent = `Room: ${currentRoom}`;
            break;
    }
}

// Event Listeners
document.getElementById('joinButton').addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        currentUser = username;
        connectWebSocket();
        joinModal.style.display = 'none';
    }
});

document.getElementById('createRoomBtn').addEventListener('click', () => {
    createRoomModal.style.display = 'block';
});

document.getElementById('createButton').addEventListener('click', () => {
    const roomName = roomNameInput.value.trim();
    if (roomName) {
        ws.send(JSON.stringify({
            type: 'createRoom',
            room: roomName
        }));
        createRoomModal.style.display = 'none';
        roomNameInput.value = '';
    }
});

document.getElementById('sendButton').addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

document.getElementById('leaveRoom').addEventListener('click', () => {
    if (currentRoom) {
        ws.send(JSON.stringify({
            type: 'leave',
            username: currentUser
        }));
        currentRoom = '';
        chatMessages.innerHTML = '';
        document.querySelector('.chat-header h2').textContent = 'Welcome to Chat';
    }
});

// Helper Functions
function sendMessage() {
    const message = messageInput.value.trim();
    if (message && currentRoom) {
        ws.send(JSON.stringify({
            type: 'message',
            message,
            username: currentUser,
            room: currentRoom
        }));
        messageInput.value = '';
    }
}

function updateRoomList(rooms) {
    roomList.innerHTML = rooms.map(room => 
        `<li onclick="joinRoom('${room}')">${room}</li>`
    ).join('');
}

function updateUserList(users) {
    userList.innerHTML = users.map(user => 
        `<li>${user}</li>`
    ).join('');
}

function joinRoom(room) {
    if (currentUser) {
        ws.send(JSON.stringify({
            type: 'join',
            username: currentUser,
            room
        }));
        chatMessages.innerHTML = '';
    }
}

function displayMessage(data) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${data.username === 'System' ? 'system' : 'user'}`;
    messageDiv.innerHTML = `
        <strong>${data.username}:</strong> ${data.message}
        ${data.timestamp ? `<span class="timestamp">${data.timestamp}</span>` : ''}
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
const socket = new WebSocket('ws://localhost:3000');
let username = '';
let currentRoom = '';

// Handle messages from the server
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
        case 'message':
            displayMessage(data);
            break;
        case 'roomCreated':
            addRoomToDropdown(data.room);
            break;
        case 'roomListUpdate':
            updateRoomList(data.rooms);
            break;
        case 'joined':
            currentRoom = data.room;
            document.getElementById('currentRoom').textContent = `Room: ${currentRoom}`;
            break;
        case 'error':
            showPopup(data.message);
            break;
        case 'userLeft':
            showPopup(`${data.username} has left the room.`);
            break;
        case 'userList':
            updateUserList(data.users);
            break;
    }
};

// Update the list of available rooms
function updateRoomList(rooms) {
    const roomSelect = document.getElementById('roomList');
    roomSelect.innerHTML = '<option value="">Select a room</option>';
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room;
        option.textContent = room;
        roomSelect.appendChild(option);
    });
}

// Add a new room to the dropdown list
function addRoomToDropdown(roomName) {
    const roomSelect = document.getElementById('roomList');
    const option = document.createElement('option');
    option.value = roomName;
    option.textContent = roomName;
    roomSelect.appendChild(option);
}

// Display messages in the chat window
function displayMessage(data) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.username} [${data.timestamp}]: ${data.message}`;
    document.getElementById('chatWindow').appendChild(messageElement);
    document.getElementById('chatWindow').scrollTop = document.getElementById('chatWindow').scrollHeight;
}

// Send message to the server
function sendMessage() {
    const message = document.getElementById('messageInput').value.trim();
    if (message) {
        socket.send(JSON.stringify({
            type: 'message',
            username,
            room: currentRoom,
            message
        }));
        document.getElementById('messageInput').value = ''; // Clear the input
    }
}

// Join the chat room
function joinRoom() {
    username = document.getElementById('username').value.trim();
    if (!username) {
        showPopup('Please enter a username.');
        return;
    }

    const room = document.getElementById('roomList').value;
    if (!room) {
        showPopup('Please select a room.');
        return;
    }

    currentRoom = room;
    socket.send(JSON.stringify({ type: 'join', username, room }));
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('chatSection').style.display = 'block';
}

// Show the room creation popup
function showCreateRoomPopup() {
    const popup = document.getElementById('createRoomPopup');
    popup.style.display = 'flex';  // Show the popup
}

// Create the room with the input value
function createRoom() {
    const roomName = document.getElementById('createRoomInput').value.trim();
    if (roomName) {
        socket.send(JSON.stringify({ type: 'createRoom', room: roomName }));
        document.getElementById('createRoomPopup').style.display = 'none'; // Close the popup after creating room
    } else {
        showPopup('Please enter a room name.');
    }
}

// Close the room creation popup
function closeCreateRoomPopup() {
    document.getElementById('createRoomPopup').style.display = 'none';
}

// Leave the room
function leaveRoom() {
    socket.send(JSON.stringify({
        type: 'leave',
        username,
        room: currentRoom
    }));
    document.getElementById('chatSection').style.display = 'none';
    document.getElementById('authSection').style.display = 'block';
    currentRoom = '';
    username = '';
    showPopup('You have left the room.');
}

// Update the list of users in the current room
function updateUserList(users) {
    const userListElement = document.getElementById('userList');
    userListElement.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('li');
        userElement.textContent = user;
        userListElement.appendChild(userElement);
    });
}

// Show a general popup with a message
function showPopup(message) {
    const popup = document.getElementById('popup');
    document.getElementById('popupMessage').textContent = message;
    popup.style.display = 'flex'; // Display the popup
}

// Close the general popup
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

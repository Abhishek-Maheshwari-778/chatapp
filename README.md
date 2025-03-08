# Real-Time Chat Application

This is a real-time chat application built using **HTML**, **CSS**, **JavaScript**, **Node.js**, and **WebSocket**. It allows users to join different chat rooms, send messages, create new rooms, and see other users currently in the room.

## Features

- Join and create chat rooms.
- Send and receive real-time messages.
- Display list of users in the room.
- Persist room data in a `rooms.json` file.
- Responsive and user-friendly UI.

## Installation and Setup

### 1. Clone the Repository

First, clone the repository to your local machine.

```bash
git clone https://github.com/your-username/chat-app.git
cd chatapp
```

### 2. Install Dependencies
Ensure you have Node.js installed. Then, run the following command to install the necessary dependencies:

```bash
npm install
```
This will install the required dependencies like express and ws.

### 3. Start the Server
Run the server using Node.js:

```bash
node server.js
```
Your application should now be running at http://localhost:3000.

File Structure
```bash
/chatapp
  ├── /public
  │   ├── index.html       # Frontend HTML structure
  │   ├── styles.css       # Styles for the application
  │   └── chat.js          # Frontend JavaScript for handling WebSocket communication and UI
  ├── rooms.json           # Stores room data (e.g., rooms and users)
  └── server.js            # Backend server setup with Express and WebSocket
```

### 1. index.html (Located in /public)
This file contains the structure for the authentication section and the chat interface. It includes input fields for the username and room selection, as well as sections for displaying messages and users.

### 2. styles.css (Located in /public)
This file contains the styles for the application, including layout, animations, and responsive design. It ensures that the chat interface is user-friendly and visually appealing.

### 3. chat.js (Located in /public)
This is the JavaScript file responsible for handling real-time WebSocket communication. It handles sending and receiving messages, managing room and user data, and updating the user interface.

### 4. server.js (Root directory)
This file sets up the backend server using Express and WebSocket. It listens for incoming WebSocket connections and handles user actions such as joining rooms, sending messages, creating rooms, and leaving rooms. It also saves and loads room data from the rooms.json file.

### 5. rooms.json (Root directory)
This file stores data about chat rooms and their members. It is used to persist room information so that it can be reloaded when the server restarts.

## How It Works
### User Authentication:
The user provides a username and selects an existing chat room or creates a new one.

### WebSocket Communication:
The frontend uses WebSocket to communicate with the server. When a user joins a room, a WebSocket connection is established, and messages are exchanged in real-time.

### Room Management:
Rooms and their users are stored in rooms.json. Users can join and leave rooms, and new rooms can be created.

### Real-Time Messaging:
Messages sent by users are broadcasted to all clients in the room. A chat window displays the messages along with the username and timestamp.

## Usage
### Join a Room:
Enter a username and select an existing room from the dropdown. Then click Join Room to enter the chat.

### Create a New Room:
If you want to create a new room, click the Create Room button, enter a name for the room, and click Create Room.

### Send Messages:
Once you join a room, you can type a message and click Send to send it to the room. All connected users will see the message in real-time.

### Leave the Room:
To leave the room, click the Leave Room button, which will return you to the authentication screen.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Real-time Communication**: WebSocket (ws library)

## Troubleshooting
- **WebSocket connection error**:
If you are having trouble connecting to the WebSocket server, make sure that your server is running on http://localhost:3000.

- **Missing dependencies**:
If you run into any issues with missing dependencies, try running npm install again in the project root.

## Contributing
Feel free to fork the repository and submit pull requests. If you find any bugs or have suggestions for improvements, open an issue, and I will be happy to address them.

## Author

- [Nikhat Ali](https://github.com/nikhat29)

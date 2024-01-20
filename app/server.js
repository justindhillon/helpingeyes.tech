// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle signaling data from clients
    socket.on('signal', (data) => {
        // Broadcast the signal data to other users
        socket.broadcast.emit('signal', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://helpingeyes.tech:3000' })); // Allow CORS for requests from Next.js app
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://helpingeyes.tech:3000",
        methods: ["GET", "POST"]
    }
});

const clients = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('register', (userId) => {
        clients[userId] = socket.id;
        console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
    });

    // Handle signaling data from clients
    socket.on('signal', (data) => {
        // Broadcast the signal data to other users
        socket.broadcast.emit('signal', data);
    });

    // Call initiation
    socket.on('call-initiated', (data) => {
        const recipientSocketId = clients[data.to];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('signal', {
                callInitiated: true,
                from: data.from
            });
        }
    });

    socket.on('disconnect', () => {
        // Remove the user from the clients mapping on disconnect
        for (const userId in clients) {
            if (clients[userId] === socket.id) {
                delete clients[userId];
                break;
            }
        }
        console.log('User disconnected:', socket.id);
    });

    socket.on('validate-id', (data, callback) => {
        const isValid = clients.hasOwnProperty(data.recipientId);
        callback({ isValid });
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

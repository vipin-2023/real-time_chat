const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: process.env.END_POINT || "http://localhost:3000",
    }
});

const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Connect to the database
require("./data_base/connect");

// Import routes
const authRoutes = require('./routes/auth');
const conversationRoutes = require('./routes/conversations');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes(io));
app.use('/api/messages', messageRoutes(io));
app.use('/api/users', userRoutes);

// Socket.io
let users = [];
io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.on('addUser', userId => {
        addUser(socket.id, userId);
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        handleSendMessage(socket, senderId, receiverId, message, conversationId);
    });

    socket.on('disconnect', () => {
        handleUserDisconnect(socket.id);
    });
});

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

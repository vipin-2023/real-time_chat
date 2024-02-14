const express = require("express");
const cors = require("cors");
require('dotenv').config();

// express object
const app = express();

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: {
        origin: process.env.END_POINT || "http://localhost:3000",
    }
});



console.log(`IO : ${io}`)
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
app.use('/api/message', messageRoutes(io));
app.use('/api/users', userRoutes);

const Users = require("./models/Users");

let users = [];

function addUser(socketId, userId) {
    const isUserExist = users.find(user => user.userId === userId);
    if (!isUserExist) {
        const user = { userId, socketId };
        users.push(user);
        if (io) {
            io.emit('getUsers', users);
        } else {
            console.error('io is undefined');
        }
    }
}

async function handleSendMessage (socket, senderId, receiverId, message, conversationId)  {
    const sender = users.find(user => user.userId === senderId);
    const receiver = users.find(user => user.userId === receiverId);
    const user = await Users.findById(senderId);

    if (receiver) {
        if (io) {  // Check if io is defined
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user._id, fullName: user.fullName, email: user.email }
            });
        } else {
            console.error('io is undefined');
        }
    } else {
        if (io) {  // Check if io is defined
            io.to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user._id, fullName: user.fullName, email: user.email }
            });
        } else {
            console.error('io is undefined');
        }
    }
}

function handleUserDisconnect(socketId) {
    users = users.filter(user => user.socketId !== socketId);
    if (io) {
        io.emit('getUsers', users);
    } else {
        console.error('io is undefined');
    }
}


io.on('connection', (socket) => {
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


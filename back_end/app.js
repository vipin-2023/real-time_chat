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
app.use('/api/message', messageRoutes(io));
app.use('/api/users', userRoutes);

// Socket.io
let users = [];

// Function to add a user to the users array
function addUser(socketId, userId) {
    const existingUser = users.find(user => user.userId === userId);
  
    if (!existingUser) {
      const user = { userId, socketId };
      users.push(user);
      console.log(`User added: ${userId}, Socket ID: ${socketId}`);
    } else {
      console.log(`User already exists: ${userId}`);
    }
  
    // Optionally, you may return the updated users array or other information
    return users;
  }
  
  // Function to handle sending messages
  function handleSendMessage(socket, senderId, receiverId, message, conversationId) {
    const receiver = users.find(user => user.userId === receiverId);
    const sender = users.find(user => user.userId === senderId);
  
    if (receiver) {
      io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
        senderId,
        message,
        conversationId,
        receiverId,
        user: { id: senderId, fullName: 'Sender Name', email: 'sender@example.com' } // Replace with actual user data
      });
    } else {
      io.to(sender.socketId).emit('getMessage', {
        senderId,
        message,
        conversationId,
        receiverId,
        user: { id: senderId, fullName: 'Sender Name', email: 'sender@example.com' } // Replace with actual user data
      });
    }
  }
  
  // Function to handle user disconnection
  function handleUserDisconnect(socketId) {
    users = users.filter(user => user.socketId !== socketId);
    io.emit('getUsers', users);
    console.log(`User disconnected: Socket ID ${socketId}`);
  }
  


io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.on('addUser', userId => {
        addUser(socket.id, userId);
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        console.log(senderId)
        console.log(receiverId)
        console.log(message)
        console.log(conversationId)
        handleSendMessage(socket, senderId, receiverId, message, conversationId);
    });

    socket.on('disconnect', () => {
        handleUserDisconnect(socket.id);
    });
});

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

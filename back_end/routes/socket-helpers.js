const Users = require('../models/Users');

let users = [];

function addUser(socketId, userId) {
    const isUserExist = users.find(user => user.userId === userId);
    if (!isUserExist) {
        const user = { userId, socketId };
        users.push(user);
        io.emit('getUsers', users);
    }
}

async function handleSendMessage (socket, senderId, receiverId, message, conversationId)  {
    const receiver = users.find(user => user.userId === receiverId);
    const sender = users.find(user => user.userId === senderId);
    const user = await Users.findById(senderId);

    if (receiver) {
        io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
            senderId,
            message,
            conversationId,
            receiverId,
            user: { id: user._id, fullName: user.fullName, email: user.email }
        });
    } else {
        io.to(sender.socketId).emit('getMessage', {
            senderId,
            message,
            conversationId,
            receiverId,
            user: { id: user._id, fullName: user.fullName, email: user.email }
        });
    }
}

function handleUserDisconnect(socketId) {
    users = users.filter(user => user.socketId !== socketId);
    io.emit('getUsers', users);
}

module.exports = { addUser, handleSendMessage, handleUserDisconnect };

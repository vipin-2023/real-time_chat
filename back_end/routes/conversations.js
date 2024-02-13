const express = require('express');
const router = express.Router();
const Conversations = require('../models/Conversations');
const { addUser, handleSendMessage, handleUserDisconnect } = require('./socket-helpers');

module.exports = (io) => {
    router.post('/', async (req, res) => {
        // Implementation of conversation creation
        try {
            const { senderId, receiverId } = req.body;
            const newCoversation = new Conversations({ members: [senderId, receiverId] });
            await newCoversation.save();
            res.status(200).send('Conversation created successfully');
        } catch (error) {
            console.log(error, 'Error')
        }
        // ...
    });

    router.get('/:userId', async (req, res) => {
        // Implementation of getting user conversations
        try {
            const userId = req.params.userId;
            const conversations = await Conversations.find({ members: { $in: [userId] } });
            const conversationUserData = Promise.all(conversations.map(async (conversation) => {
                const receiverId = conversation.members.find((member) => member !== userId);
                const user = await Users.findById(receiverId);
                return { user: { receiverId: user._id, email: user.email, fullName: user.fullName }, conversationId: conversation._id }
            }))
            res.status(200).json(await conversationUserData);
        } catch (error) {
            console.log(error, 'Error')
        }
        // ...
    });

    return router;
};

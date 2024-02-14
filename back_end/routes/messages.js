const express = require('express');
const router = express.Router();
const Messages = require('../models/Messages');

const Conversations = require('../models/Conversations')
const Users = require('../models/Users')

module.exports = (io) => {
    router.post('/', async (req, res) => {
        // Implementation of sending messages
        try {
            const { conversationId, senderId, message, receiverId = '' } = req.body;
            if (!senderId || !message) return res.status(400).send('Please fill all required fields')
            if (conversationId === 'new' && receiverId) {
                const newCoversation = new Conversations({ members: [senderId, receiverId] });
                await newCoversation.save();
                const newMessage = new Messages({ conversationId: newCoversation._id, senderId, message });
                await newMessage.save();
                return res.status(200).send('Message sent successfully');
            } else if (!conversationId && !receiverId) {
                return res.status(400).send('Please fill all required fields')
            }
            const newMessage = new Messages({ conversationId, senderId, message });
            await newMessage.save();
            res.status(200).send('Message sent successfully');
        } catch (error) {
            console.log(error, 'Error')
        }
        // ...
    });

    router.get('/:conversationId', async (req, res) => {
        // Implementation of getting conversation messages
        try {
            const checkMessages = async (conversationId) => {
                const messages = await Messages.find({ conversationId });
                const messageUserData = Promise.all(messages.map(async (message) => {
                    const user = await Users.findById(message.senderId);
                    return { user: { id: user._id, email: user.email, fullName: user.fullName }, message: message.message }
                }));
                res.status(200).json(await messageUserData);
            }
            const conversationId = req.params.conversationId;
            if (conversationId === 'new') {
              console.log("new id")
                const checkConversation = await Conversations.find({ members: { $all: [req.query.senderId, req.query.receiverId] } });
                if (checkConversation.length > 0) {
                    checkMessages(checkConversation[0]._id);
                } else {
                    return res.status(200).json([])
                }
            } else {
                checkMessages(conversationId);
            }
        } catch (error) {
            console.log('Error', error)
        }
        // ...
    });

    return router;
};

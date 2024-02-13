const express = require('express');
const router = express.Router();
const Users = require('../models/Users');

router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const users = await Users.find({ _id: { $ne: userId } });
        const usersData = Promise.all(users.map(async (user) => {
            return { user: { email: user.email, fullName: user.fullName, receiverId: user._id } }
        }));
        res.status(200).json(await usersData);
    } catch (error) {
        console.log('Error', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

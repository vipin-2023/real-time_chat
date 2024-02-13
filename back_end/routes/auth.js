const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Users = require('../models/Users');
const jwt = require("jsonwebtoken")

router.post('/register', async (req, res, next) => {
    // Implementation of user registration

    try {
      const { fullName, email, password } = req.body;
      if (!fullName || !email || !password) {
        res.status(400).json({success: false, error: "Please full all fields"})
      } else {
        const isAlreadyExist = await Users.findOne({ email });
        if (isAlreadyExist) {
          res.status(400).json({success: false, error: "User already in the system"});
        } else {
          const newUser = new Users({ fullName, email });
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            newUser.set("password", hashedPassword);
  
            newUser.save();
            next();
          });
          return res.status(200).json({success: true, message: "User registered successfully"});
        }
      }
    } catch (error) {}
    // ...
});

router.post('/login', async (req, res, next) => {
    // Implementation of user login
    try {
        const { email, password } = req.body;
  
        if (!email || !password) {
            res.status(400).send('Please fill all required fields');
        } else {
            const user = await Users.findOne({ email });
            if (!user) {
                res.status(400).send('User email or password is incorrect');
            } else {
                const validateUser = await bcrypt.compare(password, user.password);
                if (!validateUser) {
                    res.status(400).send('User email or password is incorrect');
                } else {
                    const payload = {
                        userId: user._id,
                        email: user.email
                    }
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_A_JWT_SECRET_KEY';
  
                    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
                        await Users.updateOne({ _id: user._id }, {
                            $set: { token }
                        })
                        user.save();
                        return res.status(200).json({ user: { id: user._id, email: user.email, fullName: user.fullName }, token: token })
                    })
                }
            }
        }
  
    } catch (error) {
        console.log(error, 'Error')
    }
    // ...
});

module.exports = router;

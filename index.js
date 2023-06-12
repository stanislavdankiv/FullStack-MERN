import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { registerValidator } from './validations/auth.js';

import UserModel from './models/User.js';

mongoose
    .connect('mongodb+srv://admin:admin@cluster0.9fzwqr6.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch(() => console.log('DB ERROR', err));

const app = express();

app.use(express.json());

app.post('/auth/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log(hash);

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash: hash,
            avaterUrl: req.body.avaterUrl,
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        },
        'secret123',
        {
            expiresIn: '30d',
        },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({ 
            ...userData,
            token,
        });

        console.log(token);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Невдалося зареєструватися',
        })
    }
});

// app.get('/', (req, res) => {
//     res.send('Hi');
// });

// app.post('/auth/login', (req, res) => {
//     console.log(req.body, 'req');

//     const token = jwt.sign({
//         email: req.body.email,
//         fullName: 'Пукіч',
//     }, 'secret123');

//     res.json({
//         success: true,
//         token,
//     })
// })

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');

    const a = [3,4,5];
    const b = ['c', 'd', 'e'];

    const c = [a, b];
    console.log(c);




});
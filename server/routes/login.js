const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const app = express();



app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Incorrect User or Password'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDb.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Incorrect Password or User'
                }
            });
        }

        let token = jwt.sign({
            user: userDb,
        }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

        res.json({
            ok: true,
            user: userDb,
            token
        });
    });
});






module.exports = app;
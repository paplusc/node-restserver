const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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


//Google config
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            });
        });

    User.findOne({ email: googleUser.email }, (err, userDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userDb) {
            if (!userDb.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'You must use your regular login'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDb,
                }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

                return res.json({
                    ok: true,
                    user: userDb,
                    token
                });

            }
        } else {
            // If user doesn't exit in database
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((err, userDb) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    user: userDb,
                }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

                return res.json({
                    ok: true,
                    user: userDb,
                    token
                });
            });
        }
    });
});




module.exports = app;
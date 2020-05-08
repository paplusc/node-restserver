const express = require('express');
const User = require('../models/user');

const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/user', function(req, res) {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ status: true }, 'name email role status google img')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.countDocuments({ status: true }, (err, cont) => {
                res.json({
                    ok: true,
                    users,
                    totalUsers: cont
                });
            });
        });

});

app.post('/user', (req, res) => {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDb
        });
    });
});

app.put('/user/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);


    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDb) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDb
        });
    });
});

app.delete('/user/:id', function(req, res) {

    let id = req.params.id;

    //User.findByIdAndRemove(id, (err, userDeleted) => {

    User.findByIdAndUpdate(id, { status: false }, { new: true }, (err, userDeleted) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (userDeleted == null) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            user: userDeleted
        });
    });

});

module.exports = app;
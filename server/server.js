require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/user', (req, res) => res.json('get User'));

app.post('/user', (req, res) => {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            message: 'nombre is needed'
        });
    } else {
        res.json({ user: body })
    }
});

app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    })
});

app.delete('/user', (req, res) => res.json('delete User'));

app.listen(process.env.PORT, () => console.log('Listening port: ', process.env.PORT))
require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Adding public folder
app.use(express.static(path.resolve(__dirname, "..", "public")));

// Global routes configuration
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err) => {
        if (err) {
            throw err;
        }
        console.log('Connected to DB');
    });

app.listen(process.env.PORT, () => console.log('Listening port: ', process.env.PORT));
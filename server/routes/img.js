const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyTokenImg } = require('../middlewares/authorization');
const app = express();



app.get('/img/:type/:img', verifyTokenImg, (req, res) => {

    let type = req.params.type;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, "..", "..", "uploads", type, img);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let noImagePath = path.resolve(__dirname, '..', 'assets', 'no-image.png');
        res.sendFile(noImagePath);
    }
});



module.exports = app;
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');




//default options
app.use(fileUpload({ useTempFiles: true }));


//Upload an user or product image
app.post('/upload/:type/:id', (req, res) => {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }

    // Validate types
    let validTypes = ['user', 'product'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Types admited: ' + validTypes.join(','),
                type
            }
        })
    }
    // sampleFile is a recieved input from the user
    let sampleFile = req.files.sampleFile


    //Validate extensions
    let validExtensions = ['png', 'jpg', 'git', 'jpeg'];

    let splitedFilename = sampleFile.name.split('.');
    let extension = splitedFilename[splitedFilename.length - 1];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'files admited: ' + validExtensions.join(','),
                ext: extension
            }
        })
    }

    // Change file name
    let filename = `${id}-${new Date().getMilliseconds()}.${extension}`;

    sampleFile.mv(`uploads/${type}/${filename}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // here the file is uploaded
        if (type === 'user')
            userImg(id, res, filename);
        else
            productImg(id, res, filename)

    });

});

let userImg = (id, res, filename) => {
    User.findById(id, (err, userDb) => {
        if (err) {
            deleteFile(filename, 'user');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDb) {
            deleteFile(filename, 'user');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not valid'
                }
            });
        }

        deleteFile("" + userDb.img, 'user');

        userDb.img = filename;

        userDb.save((err, userSaved) => {
            res.json({
                ok: true,
                user: userSaved,
                img: filename
            });
        });
    });
};

let productImg = (id, res, filename) => {
    Product.findById(id, (err, productDb) => {
        if (err) {
            deleteFile(filename, 'product');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDb) {
            deleteFile(filename, 'product');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not valid'
                }
            });
        }

        deleteFile("" + productDb.description, 'product');

        productDb.description = filename;

        productDb.save((err, productSaved) => {
            res.json({
                ok: true,
                product: productSaved,
                description: filename
            });
        });
    });
};

let deleteFile = (imgName, type) => {

    let pathImg = path.resolve(__dirname, "..", "..", "uploads", type, imgName);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }

};

module.exports = app;
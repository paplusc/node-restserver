const express = require('express');

const { verifyToken } = require('../middlewares/authorization');

const app = express();

const Product = require('../models/product');

app.get('/product', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    Product.find({ available: true })
        .skip(from)
        .limit(limit)
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Product.countDocuments({ available: true }, (err, cont) => {
                res.json({
                    ok: true,
                    products,
                    totalProducts: cont
                });
            });
        });

});

app.get('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Product.findById(id)
        .populate('category', 'description')
        .populate('user', 'name email')
        .exec((err, productDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productDb) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Product not found'
                    }
                });
            }
            res.json({
                ok: true,
                product: productDb
            });
        });
});

app.get('/product/search/:filter', verifyToken, (req, res) => {

    let filter = req.params.filter;
    let regex = new RegExp(filter, 'i');

    Product.find({ name: regex })
        .populate('category', 'description')
        .exec((err, productDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productDb) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Product not found'
                    }
                });
            }
            res.json({
                ok: true,
                product: productDb
            });
        });
});


app.post('/product', verifyToken, (req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        available: body.available,
        category: body.categoryId,
        user: req.user._id
    });

    product.save((err, productDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            product: productDb
        });
    });
});

app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true, useFindAndModify: false }, (err, productDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDb) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }
        res.json({
            ok: true,
            product: productDb
        });
    });
});

app.delete('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Product.findByIdAndUpdate(id, { available: false }, { new: true, runValidators: true, useFindAndModify: false }, (err, productDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDb) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        res.json({
            ok: true,
            productDb
        });
    });
});

module.exports = app;
const express = require('express');
const { verifyToken, verifyAdminRole } = require('../middlewares/authorization');

const app = express();

const Category = require('../models/category');

// List all categories
app.get('/category', (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Category.countDocuments({}, (err, cont) => {
                res.json({
                    ok: true,
                    categories,
                    totalCategories: cont
                });
            });
        });
});



// Show one category by id
app.get('/category/:id', (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, categoryDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDb) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        }
        res.json({
            ok: true,
            category: categoryDb
        });
    });
});

// Create new category
app.post('/category/', [verifyToken, verifyAdminRole], (req, res) => {
    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            category: categoryDb
        });
    });
});

// Update a category
app.put('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true, useFindAndModify: false }, (err, categoryDb) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDb) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        }
        res.json({
            ok: true,
            category: categoryDb
        });
    });
});

// Delete a category
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDeleted) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            });
        }

        res.json({
            ok: true,
            categoryDeleted
        });
    });
});




module.exports = app;
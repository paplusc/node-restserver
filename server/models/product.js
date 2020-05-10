const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is needed']
    },
    price: {
        type: Number,
        required: [true, 'Price is needed']
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model('Product', productSchema);
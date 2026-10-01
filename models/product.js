const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [5, 'Name must be at least 5 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [2, 'Description must be at least 2 characters'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        minlength: [2, 'Location must be at least 2 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number'],
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        trim: true,
        minlength: [2, 'Brand must be at least 2 characters'],
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    date: {
        type: String,
        required: [true, 'Date is required'],
        match: [
            /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
            'Date must be in DD/MM/YYYY format (e.g., 24/09/2026)'
        ],
    },
}, {
    timestamps: true,
    strict: true,
});

module.exports = mongoose.model('Product', productSchema, 'products');
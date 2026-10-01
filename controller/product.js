const Product = require('../models/product');

const validateEventBody = (body) => {
    const errors = [];

    if (!body || typeof body !== 'object') {
        return ['Request body must be a valid JSON object'];
    }

    // Name
    if (body.name === undefined || body.name === null || body.name === '') {
        errors.push('Name is required');
    } else if (typeof body.name !== 'string') {
        errors.push('Name must be a string');
    } else if (body.name.trim().length < 5) {
        errors.push('Name must be at least 5 characters');
    }

    // Description
    if (body.description === undefined || body.description === null || body.description === '') {
        errors.push('Description is required');
    } else if (typeof body.description !== 'string') {
        errors.push('Description must be a string');
    } else if (body.description.trim().length < 2) {
        errors.push('Description must be at least 2 characters');
    }

    // Location
    if (body.location === undefined || body.location === null || body.location === '') {
        errors.push('Location is required');
    } else if (typeof body.location !== 'string') {
        errors.push('Location must be a string');
    } else if (body.location.trim().length < 2) {
        errors.push('Location must be at least 2 characters');
    }

    // Price
    if (body.price === undefined || body.price === null || body.price === '') {
        errors.push('Price is required');
    } else if (typeof body.price !== 'number' || isNaN(body.price)) {
        errors.push('Price must be a valid number');
    } else if (body.price < 0) {
        errors.push('Price must be 0 or greater');
    }

    // Brand
    if (body.brand === undefined || body.brand === null || body.brand === '') {
        errors.push('Brand is required');
    } else if (typeof body.brand !== 'string') {
        errors.push('Brand must be a string');
    } else if (body.brand.trim().length < 2) {
        errors.push('Brand must be at least 2 characters');
    }

    // Stock
    if (body.stock === undefined || body.stock === null || body.stock === '') {
        errors.push('Stock is required');
    } else if (typeof body.stock !== 'number' || isNaN(body.stock)) {
        errors.push('Stock must be a number');
    } else if (body.stock < 0) {
        errors.push('Stock cannot be negative');
    }

    // isAvailable (optional check or strict boolean check)
    if (body.isAvailable !== undefined && typeof body.isAvailable !== 'boolean') {
        errors.push('isAvailable must be a boolean');
    }

    // Date
    if (body.date === undefined || body.date === null || body.date === '') {
        errors.push('Date is required');
    } else if (typeof body.date !== 'string') {
        errors.push('Date must be a string');
    } else if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(body.date)) {
        errors.push('Date must be in DD/MM/YYYY format (e.g., 24/09/2026)');
    }

    return errors;
};

const getErrorMessage = (error, fallback) => {
    if (error && error.name === 'ValidationError') {
        return Object.values(error.errors).map((item) => item.message);
    }
    return fallback;
};


const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();
        
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({
            error: getErrorMessage(error, 'Unable to retrieve products')
        });
    }
};

const getSingleProduct = async (req, res) => {
    try {
        if (!req.params.id || !/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const product = await Product.findById(req.params.id).lean();

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: getErrorMessage(error, 'Unable to retrieve product') });
    }
};

const createProducts = async (req, res) => {
    try {
        const errors = validateEventBody(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: errors[0] });
        }

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            brand: req.body.brand,
            stock: req.body.stock,
            isAvailable: req.body.isAvailable,
            location: req.body.location,
            date: req.body.date,
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(error.name === 'ValidationError' ? 400 : 500).json({
            error: getErrorMessage(error, 'Unable to create product'),
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        if (!req.params.id || !/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const errors = validateEventBody(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ error: errors[0] });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                brand: req.body.brand,
                stock: req.body.stock,
                isAvailable: req.body.isAvailable,
                location: req.body.location,
                date: req.body.date,
            },
            { new: true, runValidators: true }
        ).lean();

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(error.name === 'ValidationError' ? 400 : 500).json({
            error: getErrorMessage(error, 'Unable to update product'),
        });
    }
};


const deleteProducts = async (req, res) => {
    try {
        if (!req.params.id || !/^[a-f\d]{24}$/i.test(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: getErrorMessage(error, 'Unable to delete product') });
    }
};


module.exports = {
    getAllProducts,
    getSingleProduct,
    createProducts,
    updateProduct,
    deleteProducts
}
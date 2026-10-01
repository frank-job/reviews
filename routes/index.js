const express = require('express');
const router = express.Router();


 

router.use('/', require('./swagger'));
const productRoutes = require('./product');
router.use('/products', productRoutes);

module.exports = router;
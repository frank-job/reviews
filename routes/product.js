const express = require('express');
const router = express.Router();
const productController = require('../controller/product');

router.get('/', productController.getAllProducts);
router.post('/', productController.createProducts);
router.get('/:id', productController.getSingleProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProducts);
module.exports = router;
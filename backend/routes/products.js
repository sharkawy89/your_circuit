const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/api/products', productController.getAllProducts);
router.get('/api/products/:id', productController.getProductById);

// Admin routes (protected)
router.post('/api/products', authMiddleware, productController.createProduct);
router.put('/api/products/:id', authMiddleware, productController.updateProduct);
router.delete('/api/products/:id', authMiddleware, productController.deleteProduct);

module.exports = router;

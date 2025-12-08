const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

// All routes are protected — use middleware per-route with explicit /api prefix
router.get('/api/cart', authMiddleware, cartController.getCart);
router.post('/api/cart/add', authMiddleware, cartController.addToCart);
router.post('/api/cart/remove', authMiddleware, cartController.removeFromCart);
router.put('/api/cart/update', authMiddleware, cartController.updateCartItem);
router.delete('/api/cart/clear', authMiddleware, cartController.clearCart);

module.exports = router;

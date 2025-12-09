const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

// All routes are protected — mounted under /api/cart
router.get('/', authMiddleware, cartController.getCart);
router.post('/add', authMiddleware, cartController.addToCart);
router.post('/remove', authMiddleware, cartController.removeFromCart);
router.put('/update', authMiddleware, cartController.updateCartItem);
router.delete('/clear', authMiddleware, cartController.clearCart);

module.exports = router;

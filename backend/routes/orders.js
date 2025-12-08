const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// All routes are protected — apply auth middleware per-route and include /api prefix
router.post('/api/orders', authMiddleware, orderController.createOrder);
router.get('/api/orders', authMiddleware, orderController.getUserOrders);
router.get('/api/orders/:id', authMiddleware, orderController.getOrderById);
router.put('/api/orders/:id/status', authMiddleware, orderController.updateOrderStatus);
router.delete('/api/orders/:id/cancel', authMiddleware, orderController.cancelOrder);

module.exports = router;

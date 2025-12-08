const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Protected user routes with explicit /api prefix
router.get('/api/users/profile', authMiddleware, userController.getUserProfile);
router.put('/api/users/profile', authMiddleware, userController.updateUserProfile);
// Admin route to list users
router.get('/api/users', authMiddleware, userController.getAllUsers);

module.exports = router;

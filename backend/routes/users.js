const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Protected user routes mounted under /api/users
router.get('/profile', authMiddleware, userController.getUserProfile);
router.put('/profile', authMiddleware, userController.updateUserProfile);
// Admin route to list users
router.get('/', authMiddleware, userController.getAllUsers);

module.exports = router;

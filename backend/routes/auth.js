const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/authValidators');

// Public routes with validation middleware
router.post('/api/auth/register', validate(registerSchema), authController.register);
router.post('/api/auth/login', validate(loginSchema), authController.login);

// Protected routes
router.get('/api/auth/profile', authMiddleware, authController.getProfile);

module.exports = router;

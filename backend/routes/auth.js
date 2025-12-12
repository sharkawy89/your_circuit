const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/authValidators');

// Public routes with validation middleware
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);

// Debug helper (returns whether JWT_SECRET is configured). Remove in production once verified.
router.get('/debug-secret', (req, res) => {
    const hasSecret = !!process.env.JWT_SECRET;
    res.status(200).json({ hasJwtSecret: hasSecret });
});

module.exports = router;

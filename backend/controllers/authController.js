const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../lib/firebase');

const USERS_COLLECTION = 'users';

const signToken = (userId) => jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    { expiresIn: '7d' }
);

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const db = getDb();

        const existingSnap = await db.collection(USERS_COLLECTION)
            .where('email', '==', email.toLowerCase())
            .limit(1)
            .get();

        if (!existingSnap.empty) {
            return res.status(400).json({ success: false, error: 'Email is already registered' });
        }

        const hashed = await bcrypt.hash(password, 10);

        const userRef = await db.collection(USERS_COLLECTION).add({
            name,
            email: email.toLowerCase(),
            password: hashed,
            role: 'user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        const token = signToken(userRef.id);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: { id: userRef.id, name, email: email.toLowerCase() }
        });
    } catch (error) {
        console.error('Register handler error:', error);
        return res.status(500).json({ success: false, error: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = getDb();

        const snap = await db.collection(USERS_COLLECTION)
            .where('email', '==', email.toLowerCase())
            .limit(1)
            .get();

        if (snap.empty) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        const doc = snap.docs[0];
        const user = doc.data();
        const match = await bcrypt.compare(password, user.password || '');
        if (!match) {
            return res.status(400).json({ success: false, error: 'Invalid credentials' });
        }

        const token = signToken(doc.id);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: doc.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Login handler error:', error);
        return res.status(500).json({ success: false, error: 'Server error during login' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const db = getDb();
        const doc = await db.collection(USERS_COLLECTION).doc(req.userId).get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        const user = doc.data();
        return res.status(200).json({ success: true, user: { id: doc.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('GetProfile error:', error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
};

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const db = require('./lib/db'); // MongoDB client module

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'https://your-circuit.vercel.app/',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(compression());

const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5000'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

// Serve static frontend files from public directory
const frontendPath = path.join(__dirname, '..', 'public');
app.use(express.static(frontendPath));

// Connect to MongoDB using native MongoClient
console.log('📡 Initializing MongoDB connection...');
db.connectWithRetry()
    .then(() => {
        console.log('✅ MongoDB initialized successfully');
    })
    .catch(err => {
        console.error('❌ MongoDB initialization error:', err?.message || err);
        process.exit(1);
    });

    // --- Mock API route handlers (temporary - replace with real DB logic later) ---
    // These handlers explicitly use `/api/...` paths to match frontend and serverless setup
    // POST /api/auth/register
    app.post('/api/auth/register', (req, res) => {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'Name, email and password are required' });
        }

        // Mock duplicate check
        if (email === 'taken@example.com') {
            return res.status(400).json({ success: false, error: 'Email is already registered' });
        }

        // Return mock user and token
        const user = { id: 'mock_user_id', name, email };
        const token = 'mock_jwt_token';

        return res.status(201).json({ success: true, message: 'User registered (mock)', token, user });
    });

    // POST /api/auth/login
    app.post('/api/auth/login', (req, res) => {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        // Mock credential check
        if (email !== 'user@example.com' || password !== 'password123') {
            return res.status(401).json({ success: false, error: 'Invalid credentials (mock)' });
        }

        const user = { id: 'mock_user_id', name: 'Mock User', email };
        const token = 'mock_jwt_token';

        return res.status(200).json({ success: true, message: 'Login successful (mock)', token, user });
    });

    // GET /api/products (mocked list)
    app.get('/api/products', (req, res) => {
        const products = [
            {
                id: 'p1',
                name: 'Mock Smartphone',
                brand: 'MockBrand',
                description: 'A sample mock smartphone.',
                price: 499.99,
                category: 'smartphones',
                image: '/images/mock-phone.jpg',
                stock: 12,
                rating: 4.5
            },
            {
                id: 'p2',
                name: 'Mock Laptop',
                brand: 'MockBrand',
                description: 'A sample mock laptop.',
                price: 1199.99,
                category: 'laptops',
                image: '/images/mock-laptop.jpg',
                stock: 5,
                rating: 4.7
            }
        ];

        return res.status(200).json(products);
    });

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: '✅ Backend is running', timestamp: new Date() });
});

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(frontendPath, 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(frontendPath, 'signup.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(frontendPath, 'checkout.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// SPA fallback: serve index.html for unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
    console.log(`📡 API available at http://${HOST}:${PORT}/api`);
});

module.exports = app;
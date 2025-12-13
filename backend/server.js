const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mountRoutes = require('./routes');
const ApiError = require('./utils/apiError');
const globalError = require('./middleware/errorMiddleware');
const config = require('./lib/confij');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(compression());

// Helmet with relaxed CSP to allow our CDN scripts/styles and inline handlers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://unpkg.com'],
            scriptSrcAttr: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com'],
            imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://placehold.co'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", 'https://cdn.tailwindcss.com'],
            objectSrc: ["'none'"],
            frameAncestors: ["'self'"],
            baseUri: ["'self'"],
            formAction: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Rate limit auth endpoints to mitigate brute force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/auth', authLimiter);

// Configure CORS (single source of truth)
const allowedOrigins = [
    'https://your-circuit.vercel.app',
    'http://your-circuit.vercel.app',
    process.env.FRONTEND_URL || 'http://localhost:5000',
    process.env.FRONTEND_URL_PREVIEW, // optional for Vercel preview URLs
    'http://localhost:3000',
    'http://localhost:5000'
].filter(Boolean);

// Allow any *.vercel.app subdomain (preview deployments)
const vercelPattern = /^https?:\/\/[a-zA-Z0-9-]+\.vercel\.app$/;

app.use(cors({
    origin: (origin, callback) => {
        // Allow same-origin/no origin (e.g., mobile apps, curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.some(o => origin === o || origin.startsWith(`${o}/`)) || vercelPattern.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Serve static frontend files from public directory
const frontendPath = path.join(__dirname, '..', 'public');
app.use(express.static(frontendPath));

// Serve uploads (for product images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Stripe/webhook-style endpoints require the raw body parser BEFORE express.json
app.post('/webhook-checkout', express.raw({ type: 'application/json' }), (req, res) => {
    // Placeholder webhook handler. If you integrate Stripe, replace this with actual logic.
    console.log('Webhook received', { length: req.body && req.body.length });
    res.status(200).send('ok');
});

// Parse JSON bodies after webhook route
app.use(express.json());

// API Routes (mount from central routes/index.js)
mountRoutes(app);

// Handle unknown API routes
app.all('/api/*', (req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// Health check (no DB since migrating to Firebase)
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: '✅ Backend is running (Mongo removed, migrate to Firebase)', timestamp: new Date() });
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

// SPA fallback: serve index.html for non-API unknown routes
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Global error handling middleware
app.use(globalError);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// In serverless environments (Vercel), exporting the app is enough; avoid calling listen.
let server;
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

if (!isServerless) {
    server = app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
        console.log(`📡 API available at http://${HOST}:${PORT}/api`);
    });

    // Handle rejection outside express
    process.on('unhandledRejection', (err) => {
        console.error(`UnhandledRejection Errors: ${err?.name} | ${err?.message}`);
        server.close(() => {
            console.error('Shutting down due to unhandled rejection');
            process.exit(1);
        });
    });
}

module.exports = app;
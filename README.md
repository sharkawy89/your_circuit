# Next-Circuit E-Commerce Platform

Full-stack e-commerce application with user authentication, product catalog, shopping cart, and order management. Backend runs on Vercel serverless with **Node.js** + **Express**, data is in **Firebase Firestore**, frontend is **Vanilla HTML/CSS/JS**.

## 🚀 Features

- ✅ User Authentication (Signup/Login with JWT)
- ✅ Product Catalog with Images
- ✅ Shopping Cart Management
- ✅ Order Checkout
- ✅ User Profile Management
- ✅ Password Hashing & Security
- ✅ Input Validation (Joi)
- ✅ Firebase Firestore Database
- ✅ RESTful API
- ✅ Responsive Frontend

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **Firebase Admin SDK** (Firestore access)
- **JWT** (Authentication)
- **bcryptjs** (Password Hashing)
- **Joi** (Input Validation)
- **Helmet**, **CORS**, **Morgan**, **Compression** (Middleware)

### Frontend
- **HTML5** + **CSS3** (Tailwind)
- **Vanilla JavaScript**
- **Lucide Icons**
- **Fetch API**

## 📋 Prerequisites

- **Node.js** v18+ locally / Vercel Node 22.x runtime ([Download](https://nodejs.org/))
- **Firebase** project with Firestore enabled ([Console](https://console.firebase.google.com/))
- **Git** ([Download](https://git-scm.com/))

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/sharkawy89/Next-circuit-.git
cd "Next-circuit-"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend` folder:
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"next-circuit-df46d",...}
```

Notes:
- `FIREBASE_SERVICE_ACCOUNT` must be the raw JSON string (single-line) of a Firebase service account with Firestore access. See Firebase Console → Project Settings → Service Accounts → Generate new private key.

### 4. Start the Server
```bash
npm run dev
```
Server runs on **http://localhost:${PORT:-5000}** (replace PORT in `.env` if you changed it)

### 5. Optional Checks
- Verify Firestore connectivity:
```bash
node backend/scripts/checkFirebase.js
```

### 6. Access the Application
- **Frontend**: http://localhost:${PORT:-5000} (or `${location.origin}` when accessed via browser)
- **API Docs**: http://localhost:${PORT:-5000}/api
- **Health Check**: http://localhost:${PORT:-5000}/api/health

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile (requires JWT) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Cart (auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/cart` | Add to cart (productId, quantity) |
| GET | `/api/cart` | Get cart items |
| PATCH | `/api/cart` | Update cart item (productId, quantity) |
| DELETE | `/api/cart` | Remove from cart (productId) |
| POST | `/api/cart/clear` | Clear cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get user orders |
| GET | `/api/orders/:id` | Get order by id |
| PATCH | `/api/orders/:id` | Update status/paymentStatus |
| POST | `/api/orders/:id/cancel` | Cancel pending order |

## Frontend integration examples

- **Base URL:** Use the same origin as your frontend when served from the backend (e.g. `/api`) or set an environment variable like `REACT_APP_API_BASE` to point at `https://api.example.com`.
- **Include credentials for cookie-based auth:**
```javascript
// Example: fetch cart (cookies + CORS)
fetch(`${API_BASE || '/api'}/cart`, {
	method: 'GET',
	credentials: 'include',
	headers: { 'Content-Type': 'application/json' }
}).then(r => r.json()).then(console.log);
```

- **Bearer token example (JWT):**
```javascript
const token = localStorage.getItem('token');
fetch(`${API_BASE || '/api'}/products`, {
	headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json()).then(console.log);
```

- **Login example:** store token and use for subsequent requests
```javascript
fetch(`${API_BASE || '/api'}/auth/login`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ email, password })
})
.then(r => r.json())
.then(data => {
	if (data.token) localStorage.setItem('token', data.token);
});
```

## 🧪 Health & Diagnostics
- Backend health: `GET /api/health`
- Firestore check: `node backend/scripts/checkFirebase.js`

## 📦 Project Structure

```
Next-circuit-/
├── backend/
│   ├── controllers/        # API logic
│   ├── lib/               # Firebase admin init (`getDb()`)
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, validation
│   ├── validators/        # Joi validation schemas
│   ├── .env               # Environment variables (don't commit)
│   ├── .env.example       # Template for .env
│   ├── server.js          # Express app setup
│   ├── package.json       # Dependencies
│   └── scripts/checkFirebase.js  # Firestore connectivity check
├── frontend files (HTML, CSS, JS)
├── .gitignore             # Git exclusions
└── README.md              # This file
```

## 🔐 Security Features

- ✅ Password hashing with **bcryptjs** (10 salt rounds)
- ✅ JWT token authentication (7-day expiration)
- ✅ Input validation with **Joi**
- ✅ CORS protection
- ✅ Environment variables for secrets
- ✅ `.env` file in `.gitignore` (not committed to Git)

## 🚀 Deployment on Vercel

### Configure rewrites
`vercel.json`:
```json
{
	"rewrites": [
		{ "source": "/api/:path*", "destination": "/api/index" }
	]
}
```

### Deploy
1. Push code to GitHub
2. Import the repo in Vercel
3. Set environment variables (`FIREBASE_SERVICE_ACCOUNT`, `JWT_SECRET`, optional `FRONTEND_URL`)
4. Deploy; test `https://<your-app>.vercel.app/api/health`

### 1. Install Heroku CLI
Download from [heroku.com/cli](https://devcenter.heroku.com/articles/heroku-cli)

### 2. Login to Heroku
```bash
heroku login
```

### 3. Create Heroku App
```bash
heroku create your-app-name
```

### 4. Set Environment Variables
```bash
heroku config:set MONGODB_URI="your-mongodb-atlas-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set NODE_ENV="production"
```

### 5. Deploy
```bash
git push heroku main
```

### 6. View Logs
```bash
heroku logs --tail
```

## 🚀 Deployment on Render.com

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Click **New** → **Web Service**
4. Connect your GitHub repo
5. Set environment variables (same as above)
6. Deploy

## 🚀 Deployment on Railway.app

1. Go to [railway.app](https://railway.app)
2. Connect GitHub account
3. Select this repository
4. Add environment variables
5. Auto-deploys on push

## 🐛 Troubleshooting

### Serverless function 500
**Common causes**:
- Importing browser Firebase SDK on the server (use Admin SDK only in `backend/lib/firebase.js`).
- Wrapped app with `serverless-http` (not needed on Vercel). Export Express app directly from `api/index.js`.
- Missing or malformed `FIREBASE_SERVICE_ACCOUNT` env var (must be raw JSON string, single-line).

### Port 5000 Already in Use
```bash
# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Mac/Linux
lsof -ti :5000 | xargs kill -9
```

### Deployment Fails
- ✅ Make sure `.env` is in `.gitignore`
- ✅ Check `Procfile` exists for Heroku
- ✅ Verify all environment variables are set
- ✅ Check logs: `heroku logs --tail`

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON (single-line) | `{ "type": "service_account", ... }` |
| `JWT_SECRET` | Secret for JWT signing | `your_super_secret_key` |
| `NODE_ENV` | Environment | `production` |

## 🤝 Contributing

Contributions welcome! 

1. Fork the repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit: `git commit -m 'Add YourFeature'`
4. Push: `git push origin feature/YourFeature`
5. Open Pull Request

## 📄 License

ISC License - feel free to use this project

## 👨‍💻 Author

**Adham Sharkawy**  
- GitHub: [@sharkawy89](https://github.com/sharkawy89)
- Repository: [Next-circuit-](https://github.com/sharkawy89/Next-circuit-)

## 📞 Support

For issues:
1. Check [Troubleshooting](#troubleshooting) section
2. Open [GitHub Issue](https://github.com/sharkawy89/Next-circuit-/issues)
3. Review [MongoDB Documentation](https://docs.mongodb.com/manual/)

---

**✅ Ready for Production!**
- MongoDB Atlas configured
- All tests passing
- Security best practices implemented
- Ready to deploy
# next_circuit-

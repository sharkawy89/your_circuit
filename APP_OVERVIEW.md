# Next Circuit – App Overview

## What this app is
- A simple e-commerce demo: browse products, manage a cart, place orders, and handle auth (signup/login/profile) with Firebase Firestore as the data store.
- Frontend is static HTML/CSS/JS (served from `public/`) and calls the backend API.
- Backend is Express, deployed as a Vercel serverless function via `api/index.js`.

## Stack at a glance
- Runtime: Node.js 22.x
- Backend: Express, Joi validation, JWT auth (`Authorization: Bearer <token>`), bcrypt password hashing
- Data: Firebase Admin SDK + Firestore
- Hosting: Vercel (rewrites send `/api/*` to the backend)

## Key environment variables
- `FIREBASE_SERVICE_ACCOUNT`: Raw JSON for the Firebase service account (single-line JSON). Currently set to project `next-circuit-df46d`.
- `JWT_SECRET`: Secret used to sign/verify JWTs.
- `FRONTEND_URL` (optional): Allowed origin for CORS. Also accepts any `*.vercel.app` origin.

## API surface (all JSON)
- Auth
  - `POST /api/auth/register` – name, email, password, confirmPassword. Creates user in Firestore `users` collection.
  - `POST /api/auth/login` – email, password. Returns JWT and user info.
  - `GET /api/auth/profile` – requires `Authorization: Bearer <token>`; returns current user.
- Products
  - `GET /api/products` – optional `category`, `minPrice`, `maxPrice`, `search` query params (price/search filtered in-memory).
  - `GET /api/products/:id`
  - `POST /api/products` – create (no auth guard in code; add one if needed).
  - `PUT /api/products/:id` – update
  - `DELETE /api/products/:id`
- Cart (auth required)
  - `GET /api/cart`
  - `POST /api/cart` – body: productId, quantity; adds/updates item.
  - `PATCH /api/cart` – body: productId, quantity; updates quantity (removes if quantity <= 0).
  - `DELETE /api/cart` – body: productId; removes item.
  - `POST /api/cart/clear` – empties cart.
- Orders (auth required)
  - `POST /api/orders` – uses current cart to create order; clears cart.
  - `GET /api/orders` – list current user orders.
  - `GET /api/orders/:id` – fetch order (only owner).
  - `PATCH /api/orders/:id` – update status/paymentStatus.
  - `POST /api/orders/:id/cancel` – cancel pending order (only owner).
- Users (auth required for these routes)
  - `GET /api/users/me` (via authController profile) and `/api/users/:id` equivalents in userController.
  - `PUT /api/users/me` – update profile fields (name, phone, address).

## Data model (Firestore collections)
- `users`: { name, email, password (bcrypt hash), role, createdAt, updatedAt }
- `products`: free-form product fields used by frontend; includes price, name, brand, description.
- `carts`: doc per user `{ items: [{ productId, quantity, price }], updatedAt }`
- `orders`: { userId, items, totalAmount, shippingAddress, paymentMethod, status, paymentStatus, createdAt, updatedAt }
- `health check`: simple collection used by connectivity check script.

## Frontend behavior
- Pages: `index.html`, `login.html`, `signup.html`, `checkout.html` (all served from `public/`).
- Uses Firebase client SDK (config points to project `next-circuit-df46d`) for client-side needs; calls backend `/api/*` for data and auth.

## Deployment / routing
- Vercel rewrite in `vercel.json`: `/api/:path*` -> `api/index` (Express app exported directly).
- In serverless mode, Express `listen` is skipped; exporting the app is sufficient.

## Health and diagnostics
- `GET /api/health` – simple uptime check.
- Local Firestore connectivity check: `node backend/scripts/checkFirebase.js` (lists collections).

## Quick local run
- Install deps: `cd backend && npm install`
- Set `.env` in `backend` with `FIREBASE_SERVICE_ACCOUNT` and `JWT_SECRET`.
- Start locally: `npm run dev`
- Hit `http://localhost:5000/api/health`

## Notes / caveats
- No role-based guards on product/order mutation endpoints; add admin checks if needed.
- CORS allows any `*.vercel.app` plus `FRONTEND_URL`; tighten for production if required.
- Password policy enforced via Joi: min 8 chars, letters and numbers.

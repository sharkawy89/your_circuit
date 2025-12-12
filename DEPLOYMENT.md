# Deployment Guide (Vercel)

This project is configured to deploy a full-stack app on Vercel, serving static frontend from `public/` and routing API calls to `backend/server.js` via `vercel.json`.

## Prerequisites
- MongoDB cluster URI
- JWT secret
- Vercel account and project linked to this repository

## Environment Variables (Vercel Project Settings → Environment Variables)
- `MONGODB_URI`: your MongoDB connection string
- `JWT_SECRET`: strong random secret
- `NODE_ENV`: `production`
- `FRONTEND_URL`: `https://your-circuit.vercel.app`

## Files of Interest
- `vercel.json`: routes `/api/*` → `backend/server.js`, static from `public/`
- `backend/server.js`: CORS allows your Vercel domain and `FRONTEND_URL`; security middleware enabled

## Deploy Steps
1. Commit and push changes to `main`.
2. In Vercel, import the repo (or trigger a redeploy if already connected).
3. Set the environment variables above for Production.
4. Deploy. Vercel will use `vercel.json` to route API.

## Post-Deploy Smoke Tests
Run from a terminal or browser devtools:

- Health:
  - `GET https://your-circuit.vercel.app/api/health`

- Register:
  - `POST https://your-circuit.vercel.app/api/auth/register`
  - Body JSON: `{ "name": "Test User", "email": "test@ex.com", "password": "Password123", "confirmPassword": "Password123" }`

- Login:
  - `POST https://your-circuit.vercel.app/api/auth/login`
  - Body JSON: `{ "email": "test@ex.com", "password": "Password123" }`

- Profile:
  - `GET https://your-circuit.vercel.app/api/auth/profile`
  - Header: `Authorization: Bearer <token from login/register>`

## Local Development
Start server:

```powershell
cd 'D:\study data\project 5\backend'
$env:PORT='5000'
$env:HOST='localhost'
npm start
```

Test endpoints:

```powershell
# Health
Invoke-RestMethod -Method GET -Uri 'http://localhost:5000/api/health'

# Register
$body = @{ name='Local User'; email="local+$(Get-Random)@example.com"; password='Password123'; confirmPassword='Password123' } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri 'http://localhost:5000/api/auth/register' -ContentType 'application/json' -Body $body

# Login
$login = @{ email = 'local@example.com'; password = 'Password123' } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri 'http://localhost:5000/api/auth/login' -ContentType 'application/json' -Body $login
```

## Notes
- Frontend uses relative `/api/...` paths, so it targets the same domain on Vercel.
- `helmet` and `express-rate-limit` are enabled; adjust limits to your traffic needs.
- Keep `JWT_SECRET` and `MONGODB_URI` out of code, only in env vars.

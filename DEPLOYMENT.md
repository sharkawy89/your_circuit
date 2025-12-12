# Deployment Guide (Vercel)

This project is configured to deploy a full-stack app on Vercel, serving static frontend from `public/` and routing API calls via serverless functions.

## Prerequisites
- MongoDB cluster URI
- JWT secret
- Vercel account and project linked to this repository

## Environment Variables (Vercel Project Settings → Environment Variables)
- `MONGODB_URI`: your MongoDB connection string (format: `mongodb+srv://...`)
- `JWT_SECRET`: strong random secret (generate with `openssl rand -base64 32`)
- `NODE_ENV`: `production`
- `FRONTEND_URL`: `https://your-circuit.vercel.app`

## Architecture
- `vercel.json`: rewrites `/api/*` to serverless function at `/api/index`
- `api/index.js`: serverless wrapper for Express app
- `backend/server.js`: main Express app with CORS, helmet, rate-limiting
- `public/`: static frontend files (HTML/CSS/JS)

## Critical Fixes Applied
1. **Vercel Config**: Changed from `builds` to `rewrites` to avoid build warnings
2. **API Paths**: Fixed frontend to use `${API_URL}/...` with leading slash
3. **Token Storage**: Verified JWT properly stored in localStorage/sessionStorage
4. **CORS**: Backend allows `your-circuit.vercel.app` and `FRONTEND_URL`

## Deploy Steps

### 1. Verify Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:
- Add all 4 variables listed above
- Set for **Production** environment
- Click **Save**

### 2. MongoDB Atlas Network Access
- Go to MongoDB Atlas → Network Access
- Add IP: `0.0.0.0/0` (allow all) for Vercel functions
- Or use Vercel's static IPs if available

### 3. Commit and Deploy
```bash
git add .
git commit -m "Production-ready: fix CORS, API paths, Vercel config"
git push origin main
```

### 4. Deploy on Vercel
- In Vercel dashboard, click **Deploy** or it auto-deploys from GitHub
- Wait for build to complete (~2-3 minutes)
- Check deployment logs for errors

### 5. Run Post-Deploy Tests
See [PRODUCTION_TEST_PLAN.md](PRODUCTION_TEST_PLAN.md) for comprehensive testing.

**Quick Health Check:**
```bash
curl https://your-circuit.vercel.app/api/health
```

Expected: `{"message":"✅ Backend is running","timestamp":"..."}`

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

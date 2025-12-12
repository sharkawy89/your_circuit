# Production Smoke Test Plan

## Critical Issues Fixed

### 1. ✅ Vercel Configuration Warning
**Problem:** Build conflict from `vercel.json` using deprecated `builds` property.
**Solution:** Updated to use `rewrites` for serverless function routing.

### 2. ✅ Server Connection Failure  
**Problem:** Frontend using incorrect relative paths (`api/auth/login` instead of `/api/auth/login`).
**Solution:** Fixed all API calls to use `${API_URL}/...` pattern with proper leading slash.

### 3. ✅ Missing Authentication Token
**Problem:** Token storage logic confirmed working; frontend properly stores JWT in both localStorage and sessionStorage.
**Solution:** Verified token handling in login.html and signup.html.

## Pre-Deployment Checklist

### Vercel Environment Variables
Set these in your Vercel project settings (Settings → Environment Variables):

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
FRONTEND_URL=https://your-circuit.vercel.app
```

### Files to Verify
- ✅ `vercel.json` - uses rewrites (not builds)
- ✅ `api/index.js` - serverless wrapper exists
- ✅ `backend/server.js` - CORS allows your-circuit.vercel.app
- ✅ `public/login.html` - uses `${API_URL}/auth/login`
- ✅ `public/signup.html` - uses `${API_URL}/auth/register`

## Post-Deployment Testing

### Test 1: Health Check
**Endpoint:** `GET https://your-circuit.vercel.app/api/health`

**Expected Response:**
```json
{
  "message": "✅ Backend is running",
  "timestamp": "2025-12-12T..."
}
```

**How to Test:**
- Browser: Open the URL directly
- PowerShell:
```powershell
Invoke-RestMethod -Method GET -Uri 'https://your-circuit.vercel.app/api/health'
```

**Troubleshooting:**
- 404: API routing not working, check `vercel.json`
- 500: Backend error, check Vercel function logs
- CORS: Check backend CORS config includes your domain

---

### Test 2: User Registration
**Endpoint:** `POST https://your-circuit.vercel.app/api/auth/register`

**Test in Browser Console:**
```javascript
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123',
    confirmPassword: 'Password123'
  })
}).then(r => r.json()).then(console.log)
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

**Troubleshooting:**
- `Passwords do not match`: Validator working correctly
- `Email is already registered`: User exists (expected on retry)
- `Unable to reach server`: Check API base URL and CORS
- `500 error`: Check MongoDB connection in Vercel logs

---

### Test 3: User Login
**Endpoint:** `POST https://your-circuit.vercel.app/api/auth/login`

**Test in Browser Console:**
```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Password123'
  })
}).then(r => r.json()).then(console.log)
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

**Troubleshooting:**
- `Invalid credentials`: Check password or user doesn't exist
- `Unable to reach server`: API routing issue

---

### Test 4: Protected Route (Profile)
**Endpoint:** `GET https://your-circuit.vercel.app/api/auth/profile`

**Test in Browser Console:**
```javascript
// First, get token from login or registration
const token = 'YOUR_TOKEN_HERE';

fetch('/api/auth/profile', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}).then(r => r.json()).then(console.log)
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "createdAt": "..."
  }
}
```

**Troubleshooting:**
- `No token provided`: Authorization header missing
- `Invalid or expired token`: Token format wrong or JWT_SECRET mismatch
- Check that JWT_SECRET in Vercel matches what was used to create token

---

### Test 5: Full UI Flow

1. **Navigate to Signup Page**
   - URL: `https://your-circuit.vercel.app/signup.html`
   - Fill form with unique email
   - Submit and verify redirect to index.html

2. **Navigate to Login Page**
   - URL: `https://your-circuit.vercel.app/login.html`
   - Use credentials from signup
   - Submit and verify redirect to index.html

3. **Check Token Storage**
   - Open DevTools → Application → Local Storage
   - Verify `authToken` exists
   - Verify `userSession` exists with user data

4. **Navigate to Checkout**
   - Add items to cart from index.html
   - Click checkout
   - Verify you're not redirected to login (auth check passes)

---

## Common Production Issues

### Issue: "Unable to reach server"
**Causes:**
- API not deployed or offline
- Wrong API_URL in frontend
- CORS blocking requests

**Debug Steps:**
1. Check Vercel function logs
2. Test health endpoint directly
3. Check browser console for CORS errors
4. Verify environment variables are set

### Issue: "No token provided"
**Causes:**
- Token not stored after login/signup
- Authorization header not being sent
- Token cleared by browser

**Debug Steps:**
1. Check localStorage/sessionStorage for `authToken`
2. Check Network tab → Request Headers
3. Verify login/signup stores token: `localStorage.setItem('authToken', data.token)`

### Issue: Token Invalid/Expired
**Causes:**
- JWT_SECRET mismatch between environments
- Token expired (7 day expiry)
- Corrupted token in storage

**Debug Steps:**
1. Clear localStorage and re-login
2. Verify JWT_SECRET in Vercel matches local .env
3. Check token format (should start with `eyJ`)

### Issue: MongoDB Connection Failed
**Causes:**
- MONGODB_URI not set or incorrect
- IP not whitelisted in MongoDB Atlas
- Network connectivity issues

**Debug Steps:**
1. Check Vercel function logs for connection errors
2. Verify MONGODB_URI format: `mongodb+srv://...`
3. In MongoDB Atlas: Network Access → Allow access from Anywhere (0.0.0.0/0)

---

## Performance Checks

### Response Times (Target)
- Health: < 200ms
- Register: < 500ms
- Login: < 400ms
- Profile: < 300ms

### Security Headers (helmet)
Check in DevTools → Network → Response Headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Strict-Transport-Security`

### Rate Limiting
Try 100+ rapid requests to `/api/auth/login`:
- Should get 429 (Too Many Requests) after limit

---

## Rollback Plan

If production deployment fails:

1. **Revert vercel.json** to previous working version
2. **Check Vercel logs** for specific error messages
3. **Test locally first** using the same environment variables
4. **Deploy to preview URL** before production

---

## Success Criteria

✅ Health endpoint returns 200
✅ User can register and receive JWT token
✅ User can login with credentials
✅ Protected routes reject requests without token
✅ Protected routes accept valid JWT token
✅ Frontend stores token and sends in headers
✅ No CORS errors in browser console
✅ MongoDB queries execute successfully
✅ Rate limiting active on auth endpoints
✅ Security headers present in responses

---

## Post-Launch Monitoring

1. **Vercel Analytics** - Check for 4xx/5xx errors
2. **MongoDB Atlas Metrics** - Monitor connection count and query performance
3. **Browser Console** - Watch for JavaScript errors
4. **User Reports** - Document any "Unable to reach server" feedback


Vercel deployment setup

Required environment variables (set these in the Vercel project settings):

- MONGODB_URI
  - Example: mongodb+srv://USER:PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority
- JWT_SECRET
- FRONTEND_URL (optional)
- ALLOW_ALL_ORIGINS (optional) - set to "true" for quick testing

Deployment notes:

1. This repository is configured to deploy from the repository root.
2. The serverless handler is `api/index.js` which wraps the Express app in `backend/server.js`.
3. Static frontend files are served from `/public`.
4. Ensure `MONGODB_URI` is set in Vercel and your Atlas cluster allows connections from Vercel (add `0.0.0.0/0` temporarily under Network Access for testing).

Troubleshooting:

- If signup/login returns "Unable to reach server":
  - Check Vercel Function logs for errors (Dashboard → Functions/Logs).
  - Verify environment variables in your Vercel project.
  - Verify Atlas user credentials and Network Access whitelist.
  - Confirm the function started and you see `MongoDB connected successfully` in logs.

Local testing (optional):

- Install dependencies at repo root (this will install server dependencies used by Vercel):

```powershell
Set-Location "d:\swe  proj 03"
npm install
```

- Start backend locally (from `backend` folder):

```powershell
Set-Location "d:\swe  proj 03\backend"
npm run dev
```

- Test health endpoint:

```powershell
curl http://localhost:5000/api/health -UseBasicParsing
```

If you want, I can also add a small health-check function endpoint or adjust routes further — tell me what you prefer.

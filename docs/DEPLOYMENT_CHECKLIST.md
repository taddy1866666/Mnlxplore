# Deployment Checklist

Use this checklist to deploy MNLXPLORE to production.

---

## Pre-Deployment (Code Quality)

### Frontend
- [ ] Run `npm run build` successfully
- [ ] No console errors in development
- [ ] All pages accessible
- [ ] Responsive design tested on mobile/tablet
- [ ] Environment variables configured
- [ ] API endpoints pointing to production backend
- [ ] All images optimized
- [ ] Meta tags and SEO optimized

### Backend
- [ ] All routes tested with Postman/Insomnia
- [ ] Error handling implemented
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] API response times acceptable
- [ ] No hardcoded secrets
- [ ] CORS properly configured
- [ ] Input validation complete

### Database
- [ ] MongoDB backup created
- [ ] Indexes created for performance
- [ ] Sample data seeded
- [ ] Connection string verified
- [ ] Database user credentials stored securely

---

## Step 1: Deploy Backend to Render (15 minutes)

### 1.1 Push to GitHub

```powershell
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial MNLXPLORE commit"

# Push to GitHub (create repo first on github.com)
git remote add origin https://github.com/YOUR_USERNAME/mnlxplore.git
git branch -M main
git push -u origin main
```

### 1.2 Deploy on Render

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select **your GitHub repository** (mnlxplore)
5. Configure:
   - **Name:** `mnlxplore-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free tier (or Starter)

### 1.3 Add Environment Variables

In Render dashboard → Settings → Environment:

```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
NODE_ENV=production
CLIENT_URL=https://mnlxplore.vercel.app
```

### 1.4 Deploy

- [ ] Click **"Deploy"**
- [ ] Wait for deployment to complete (2-5 minutes)
- [ ] Test: Visit `https://mnlxplore-api.onrender.com/api/health`
- [ ] Should see: `{ "message": "Server is running", ... }`

**Backend URL:** `https://mnlxplore-api.onrender.com`

---

## Step 2: Deploy Frontend to Vercel (10 minutes)

### 2.1 Push Frontend to GitHub (if separate repo)

```powershell
cd frontend

git init
git add .
git commit -m "Initial frontend"
git remote add origin https://github.com/YOUR_USERNAME/mnlxplore-frontend.git
git push -u origin main
```

Or use monorepo approach (keep in same repo).

### 2.2 Deploy on Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import **mnlxplore** (or mnlxplore-frontend) repository
5. Configure:
   - **Framework:** Next.js
   - **Root Directory:** `frontend/` (if monorepo)
   - Click **"Deploy"**

### 2.3 Add Environment Variables

Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://mnlxplore-api.onrender.com
```

### 2.4 Redeploy

- [ ] Trigger redeploy after adding env vars
- [ ] Wait for deployment (2-3 minutes)
- [ ] Visit generated URL (e.g., `mnlxplore.vercel.app`)

**Frontend URL:** `https://mnlxplore.vercel.app`

---

## Step 3: Configure Domain (Optional, 5 minutes)

### 3.1 Custom Domain on Vercel

1. Vercel Dashboard → Settings → Domains
2. Enter your domain: `mnlxplore.com`
3. Add DNS records (Vercel shows exact records)
4. Wait for DNS propagation (up to 48 hours)

### 3.2 Update Backend CORS

In `backend/.env`:
```
CLIENT_URL=https://mnlxplore.com
```

Or in `server.js`:
```javascript
app.use(cors({
  origin: ['https://mnlxplore.com', 'https://www.mnlxplore.com'],
  credentials: true
}));
```

Redeploy backend.

---

## Step 4: Final Testing (10 minutes)

### Frontend Tests
- [ ] Landing page loads
- [ ] Navigation works
- [ ] Trip Planner loads
- [ ] Can register new account
- [ ] Can login
- [ ] Can generate itinerary
- [ ] Explore page shows destinations
- [ ] Mobile responsive

### Backend Tests (via Postman/Insomnia)

#### Register
```
POST https://mnlxplore-api.onrender.com/api/auth/register
{
  "email": "test@example.com",
  "password": "testpassword123"
}
```
Expected: 201 with token

#### Login
```
POST https://mnlxplore-api.onrender.com/api/auth/login
{
  "email": "test@example.com",
  "password": "testpassword123"
}
```
Expected: 200 with token

#### Generate Itinerary
```
POST https://mnlxplore-api.onrender.com/api/trip/generate
{
  "destination": "Manila",
  "budget": 5000,
  "days": 3,
  "preferences": ["Food", "Adventure"]
}
```
Expected: 200 with itinerary

#### Health Check
```
GET https://mnlxplore-api.onrender.com/api/health
```
Expected: 200 OK

---

## Step 5: Monitoring & Maintenance

### Continuous Integration
- [ ] GitHub Actions setup for tests
- [ ] Automatic deployments on push
- [ ] Email alerts on build failures

### Monitoring
- [ ] Setup error tracking (Sentry)
- [ ] Monitor API response times
- [ ] Track server uptime
- [ ] Monitor database performance

### Maintenance
- [ ] Weekly backups of MongoDB
- [ ] Monitor API logs
- [ ] Check for security updates
- [ ] Update dependencies monthly

### Performance Optimization
- [ ] Enable gzip compression
- [ ] Implement caching headers
- [ ] Optimize database queries
- [ ] Add CDN for static assets

---

## Post-Deployment Checklist

### Security
- [ ] All secrets removed from code
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] CORS properly configured
- [ ] Rate limiting tested
- [ ] SQL injection/XSS prevented
- [ ] JWT validation working

### Performance
- [ ] Frontend loads in < 3 seconds
- [ ] API responds in < 500ms
- [ ] Database queries optimized
- [ ] Images properly sized
- [ ] Code splitting implemented

### Analytics & Monitoring
- [ ] Google Analytics integrated (optional)
- [ ] Error logging setup
- [ ] Performance monitoring active
- [ ] User engagement tracked

### Backup & Recovery
- [ ] Database backups automated
- [ ] Backup retention policy set
- [ ] Disaster recovery plan documented
- [ ] Regular backup testing done

---

## Troubleshooting Deployment

### Backend Won't Deploy on Render

**Issue:** Build fails on Render
```
Solution:
1. Check build logs in Render dashboard
2. Ensure package.json exists
3. Verify all dependencies listed
4. Check for Node version conflicts
```

**Issue:** "Cannot connect to MongoDB"
```
Solution:
1. Verify MONGODB_URI in .env
2. Check IP whitelist in MongoDB Atlas
3. Allow all IPs (0.0.0.0/0) for testing
4. Test connection locally first
```

**Issue:** OpenAI API not working
```
Solution:
1. Verify API key is valid
2. Check API key has billing
3. Test in local development first
4. Check API rate limits
```

### Frontend Won't Deploy on Vercel

**Issue:** Build fails
```
Solution:
1. Run `npm run build` locally first
2. Check for TypeScript errors
3. Verify all imports are correct
4. Check build logs in Vercel
```

**Issue:** API calls failing in production
```
Solution:
1. Verify NEXT_PUBLIC_API_URL is set
2. Check backend is running
3. Verify CORS is enabled
4. Check network tab in browser dev tools
```

---

## Rollback Plan

If something goes wrong:

### Rollback Frontend
```
On Vercel dashboard:
1. Deployments tab
2. Click previous deployment
3. Click "Promote to Production"
```

### Rollback Backend
```
On Render dashboard:
1. Events tab
2. Find previous deployment
3. Redeploy that version
```

### Rollback Database
- Use MongoDB Atlas backups
- Contact support for point-in-time recovery

---

## Success Criteria

Your deployment is successful when:

✅ Frontend loads at https://mnlxplore.vercel.app (or custom domain)
✅ Backend API responds at https://mnlxplore-api.onrender.com
✅ Can register and login
✅ Can generate AI itinerary
✅ Database queries work
✅ No console errors
✅ Mobile responsive
✅ SSL/HTTPS working
✅ Performance acceptable
✅ Monitoring in place

🎉 **Congratulations! MNLXPLORE is live!**

# MNLXPLORE Complete Setup Guide

## Prerequisites

Before starting, ensure you have installed:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **Git** - [Download](https://git-scm.com/)
3. **Visual Studio Code** (optional) - [Download](https://code.visualstudio.com/)

### Verify Installation
```powershell
node --version
npm --version
git --version
```

---

## Phase 1: Initial Setup (10 minutes)

### Step 1: Clone/Extract Project

```powershell
cd c:\Projects\htdocs
# Project is already in Mnlxplore folder
cd Mnlxplore
```

### Step 2: Verify Project Structure

You should see:
```
Mnlxplore/
├── frontend/          (Next.js app)
├── backend/           (Express.js server)
├── docs/              (Documentation)
└── README.md
```

---

## Phase 2: Backend Setup (15 minutes)

### Step 1: Install Backend Dependencies

```powershell
cd backend
npm install
```

This installs:
- express (API framework)
- mongoose (MongoDB driver)
- cors (Cross-Origin)
- bcryptjs (Password hashing)
- jsonwebtoken (Authentication)
- openai (AI integration)
- dotenv (Environment variables)
- nodemon (Auto-reload during development)

### Step 2: Configure Environment Variables

Create `.env` file in the `backend` folder:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mnlxplore
JWT_SECRET=your-super-secret-jwt-key-generate-a-strong-one
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Get API Keys:**
- **OpenAI Key:**
  1. Go to [platform.openai.com](https://platform.openai.com)
  2. Sign up/Login
  3. Create API key in Settings → API keys
  4. Copy and paste in `.env`

- **MongoDB URI:**
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. Create free cluster
  3. Create database user
  4. Get connection string
  5. Replace username:password and paste

**Generate JWT Secret (optional, use any 32+ character string):**
```
your-super-secret-jwt-key-abc123xyz789
```

### Step 3: Start Backend Server

```powershell
npm run dev
```

Expected output:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
📚 API Documentation: http://localhost:5000/api
```

**Keep this terminal running!** Open a new terminal for frontend.

---

## Phase 3: Frontend Setup (15 minutes)

### Step 1: Install Frontend Dependencies

Open **new terminal** and:

```powershell
cd frontend
npm install
```

This installs:
- next (React framework)
- react (UI library)
- tailwindcss (Styling)
- axios (HTTP client)
- react-hook-form (Form management)
- lucide-react (Icons)

### Step 2: Configure Frontend Environment

Create `.env.local` file in `frontend` folder:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

The `NEXT_PUBLIC_` prefix makes it available in the browser.

### Step 3: Start Frontend Server

```powershell
npm run dev
```

Expected output:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## Phase 4: Testing the Application (10 minutes)

### Step 1: Open Application

Visit: **http://localhost:3000**

You should see:
- MNLXPLORE landing page
- Navigation bar (Home, Explore, Login)
- Features section with 3 cards
- Call-to-action buttons

### Step 2: Test Registration

1. Click **Login** in top right
2. Click **"Register"** link
3. Enter email and password
4. Click **Register**

Expected: Redirects to login page after 2 seconds

### Step 3: Test Login

1. On login page, enter registered email and password
2. Click **Login**

Expected: Redirects to dashboard (if implemented)

### Step 4: Test Trip Planner

1. Click **"Start Planning"** button on home
2. Fill in:
   - Destination: `Manila`
   - Budget: `5000`
   - Days: `3`
   - Preferences: `Food, Adventure, Shopping`
3. Click **Generate Itinerary**

Wait 5-10 seconds... Expected: AI-generated itinerary appears!

### Step 5: Test Explore Page

1. Click **Explore** in navigation
2. View destination cards
3. See attractions, ratings, descriptions

---

## Phase 5: Database Setup (10 minutes)

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create Organization and Project
4. Create M0 (free) cluster
5. Create database user:
   - Username: `mnlxplore_user`
   - Password: Generate secure password
6. Get connection string:
   - Click "Connect" on cluster
   - Choose "Connect your application"
   - Copy connection string
7. Replace in `.env`:
   ```
   mongodb+srv://mnlxplore_user:PASSWORD@cluster.mongodb.net/mnlxplore
   ```

### Option B: Local MongoDB (Advanced)

1. Install [MongoDB Community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string:
   ```
   mongodb://localhost:27017/mnlxplore
   ```

### Verify Connection

Backend console should show:
```
✅ MongoDB connected
```

---

## Phase 6: Seed Sample Data (Optional)

To populate database with sample destinations:

Create `backend/seed.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const Destination = require('./models/Destination');

const destinations = [
  {
    name: 'Intramuros',
    type: 'Historic Site',
    description: 'Historic walled district with colonial architecture',
    location: { latitude: 14.5994, longitude: 120.9842 },
    rating: 4.5,
    attractions: ['San Agustin Church', 'Fort Santiago', 'Rizal Monument'],
    restaurants: ['Bistro Remedios', 'Ilustrado'],
    estimatedBudget: 1500
  },
  {
    name: 'BGC (Bonifacio Global City)',
    type: 'Entertainment District',
    description: 'Modern district with shopping, dining, and entertainment',
    location: { latitude: 14.5516, longitude: 121.0332 },
    rating: 4.7,
    attractions: ['The Fort Exchange', 'Bonifacio High Street', 'Uptown Mall'],
    restaurants: ['Makanan', 'Edsa Shangri-La Food Court'],
    estimatedBudget: 2500
  },
  {
    name: 'Rizal Park',
    type: 'Nature & Historical',
    description: 'Large green space with historical monuments',
    location: { latitude: 14.5794, longitude: 121.0132 },
    rating: 4.6,
    attractions: ['Rizal Monument', 'Chinese Garden', 'Japanese Garden'],
    restaurants: ['Park cafes and food stalls'],
    estimatedBudget: 500
  }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Destination.deleteMany({});
  await Destination.insertMany(destinations);
  console.log('✅ Sample data seeded!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
```

Run it:
```powershell
cd backend
node seed.js
```

---

## Quick Commands Reference

### Frontend
```powershell
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production build
npm start
```

### Backend
```powershell
cd backend

# Install dependencies
npm install

# Start dev server (with auto-reload)
npm run dev

# Start production server
npm start
```

---

## Troubleshooting

### Backend Issues

**Error: "Cannot find module 'mongoose'"**
```powershell
cd backend
npm install
```

**Error: "MONGODB_URI is not defined"**
- Ensure `.env` file exists in `backend` folder
- Check spelling: `MONGODB_URI` (not `MONGO_URI`)

**Error: "OpenAI API key invalid"**
- Get new key from [platform.openai.com](https://platform.openai.com)
- Save in `.env` as `OPENAI_API_KEY`
- Restart server

**Port 5000 already in use:**
```powershell
# Change in .env
PORT=5001
```

### Frontend Issues

**Error: "Cannot find module 'next'"**
```powershell
cd frontend
npm install
```

**Error: "Cannot GET /api"**
- Ensure backend is running (`npm run dev` in backend folder)
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure it points to correct backend

**Port 3000 already in use:**
```powershell
npm run dev -- -p 3001
```

---

## Project Structure

```
Mnlxplore/
│
├── frontend/                 (Next.js - Client)
│   ├── pages/               
│   │   ├── _app.js         (App wrapper)
│   │   ├── _document.js    (HTML document)
│   │   ├── index.js        (Landing page)
│   │   ├── planner.js      (AI trip planner)
│   │   ├── explore.js      (Destinations)
│   │   ├── login.js        (Login page)
│   │   └── register.js     (Registration)
│   ├── components/          (React components)
│   ├── styles/              (CSS files)
│   ├── utils/               (Helper functions)
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── backend/                  (Express.js - Server)
│   ├── routes/              (API routes)
│   │   ├── authRoutes.js
│   │   ├── tripRoutes.js
│   │   └── destinationRoutes.js
│   ├── controllers/         (Business logic)
│   │   ├── authController.js
│   │   └── tripController.js
│   ├── models/              (Database schemas)
│   │   ├── User.js
│   │   ├── Trip.js
│   │   └── Destination.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js            (Main server)
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── docs/                     (Documentation)
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── SYSTEM_ARCHITECTURE.md
│   └── SETUP_GUIDE.md
│
└── README.md
```

---

## Next Steps After Setup

1. **Deploy Frontend to Vercel:**
   - Push to GitHub
   - Connect to Vercel
   - Set `NEXT_PUBLIC_API_URL` to production backend

2. **Deploy Backend to Render:**
   - Push backend to GitHub
   - Create Web Service on Render
   - Add environment variables
   - Set custom domain (optional)

3. **Add More Features:**
   - Dashboard with saved trips
   - Map integration
   - Payment processing
   - User profiles

4. **Optimization:**
   - Add caching (Redis)
   - Implement rate limiting
   - Add monitoring (Sentry)
   - CDN optimization

---

## Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Express.js Docs:** https://expressjs.com/
- **MongoDB Docs:** https://docs.mongodb.com/
- **OpenAI Docs:** https://platform.openai.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

Need help? Check the documentation files in `/docs` folder!

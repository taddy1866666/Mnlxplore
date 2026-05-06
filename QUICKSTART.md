# 🚀 MNLXPLORE - QUICK START

This is your complete, production-ready MNLXPLORE project setup. Everything is pre-configured and ready to run!

## ⚡ Quick Commands

### **Start Everything** (2 terminals needed)

**Terminal 1 - Backend:**
```powershell
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm install
npm run dev
```

Then visit: **http://localhost:3000**

---

## 📋 What's Included

✅ **Frontend** - Next.js app with 6 pages (home, login, register, planner, explore, dashboard)
✅ **Backend** - Express.js API with auth, trips, and AI integration
✅ **Database** - MongoDB schema (ready for MongoDB Atlas)
✅ **AI** - OpenAI integration for itinerary generation
✅ **Styling** - Tailwind CSS with modern UI
✅ **Documentation** - Complete setup and deployment guides

---

## 📚 Important Files to Check

1. **[README.md](README.md)** - Main project overview
2. **[docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)** - Complete setup instructions
3. **[docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)** - API reference
4. **[docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)** - Deploy to Vercel & Render

---

## 🔑 Required API Keys

Before running, get these:

1. **OpenAI API Key** (for AI itineraries)
   - Go to https://platform.openai.com
   - Create API key
   - Add to `backend/.env`

2. **MongoDB URI** (database)
   - Go to https://mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string
   - Add to `backend/.env`

---

## 📁 Project Structure Overview

```
Mnlxplore/
├── frontend/           (Next.js - Port 3000)
│   ├── pages/         (6 pages ready)
│   ├── styles/        (Tailwind CSS)
│   └── utils/         (API helpers)
│
├── backend/           (Express - Port 5000)
│   ├── routes/        (API endpoints)
│   ├── controllers/    (Business logic)
│   ├── models/        (MongoDB schemas)
│   └── server.js      (Main server)
│
├── docs/              (Complete guides)
│   ├── SETUP_GUIDE.md
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── SYSTEM_ARCHITECTURE.md
│   └── DEPLOYMENT_CHECKLIST.md
│
└── README.md
```

---

## 🛑 Troubleshooting

**Backend won't start?**
```
Error: Cannot find module 'mongoose'
Fix: cd backend && npm install
```

**Frontend can't connect to API?**
```
Error: Cannot connect to http://localhost:5000
Fix: 1. Ensure backend is running
     2. Check NEXT_PUBLIC_API_URL in frontend/.env.local
     3. Verify both are on correct ports
```

**OpenAI errors?**
```
Error: Invalid API key
Fix: Get new key from https://platform.openai.com
     Add to backend/.env as OPENAI_API_KEY
```

---

## 🚀 Next Steps

### For Development
1. Read [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md)
2. Run both servers
3. Test all features
4. Make improvements

### For Production
1. Get OpenAI and MongoDB keys
2. Follow [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)
3. Deploy to Vercel & Render
4. Set up custom domain

### For Thesis/Documentation
1. Use [docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) for Chapter 3
2. Use [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for data model
3. Use [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for system details

---

## 📖 Full Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview & features |
| [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md) | Complete installation guide |
| [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | All API endpoints explained |
| [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | MongoDB structure & queries |
| [docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) | System design & data flow |
| [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md) | Deploy to production |

---

## 🎯 Features Ready to Use

- ✅ User registration & login
- ✅ AI-powered itinerary generator
- ✅ Destination explorer
- ✅ Trip planner
- ✅ Save trips to account
- ✅ Responsive design
- ✅ JWT authentication
- ✅ MongoDB integration

---

## 💡 Tips

1. **Development**: Keep both `npm run dev` running in separate terminals
2. **Database**: Start with free MongoDB Atlas tier, upgrade later if needed
3. **Testing**: Use Postman to test API endpoints
4. **Debugging**: Check browser console and backend logs for errors
5. **Customization**: Edit pages in `frontend/pages/` to customize UI

---

## 🎓 For Students/Thesis

This project includes everything needed for:
- Software Development documentation
- Thesis/Capstone project
- Portfolio showcase
- Production-ready application

All code is commented and well-structured for easy understanding.

---

## 📞 Need Help?

1. Check the relevant documentation file
2. Review the troubleshooting section
3. Check browser console (F12) for errors
4. Check backend logs in terminal

---

**🌟 You're all set! Start building! 🚀**

```powershell
# Run these two commands in separate terminals:
cd backend && npm run dev
cd frontend && npm run dev
```

Then visit: http://localhost:3000

Happy building! 💻✨

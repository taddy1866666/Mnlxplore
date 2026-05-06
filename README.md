# MNLXPLORE - AI-Powered Travel Assistant

An intelligent web application that helps travelers plan personalized trips with AI-generated itineraries, local business support, and seamless travel experiences.

**Live Demo:** Coming soon

---

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Features
- **AI Itinerary Generator** - Generate personalized travel itineraries using GPT-4
- **Smart Recommendations** - AI-powered place suggestions with distance and travel time
- **Themed Trip Plans** - Romantic, Food, Cafe, Cultural, Adventure, Nightlife themes
- **Route Optimization** - Automatically arrange destinations for shortest path
- **Destination Explorer** - Discover attractions, restaurants, and activities in Metro Manila
- **Budget Planning** - Automatic budget breakdown (Food 40%, Transport 30%, Activities 30%)
- **Interactive Maps** - Google Maps integration with location markers
- **Save Trips** - Save and manage your itineraries
- **User Accounts** - Register, login, and save trips for later
- **Preference Matching** - Get recommendations based on your travel preferences
- **AI Processing Animation** - Real-time feedback during itinerary generation
- **Place Ratings and Reviews** - See ratings, prices, and opening hours

### Future Features
- **Booking Integration** - Direct booking for hotels and tours
- **Chatbot Assistant** - Real-time travel assistance
- **Mobile App** - React Native mobile application
- **Multi-language** - Support for multiple languages
- **Route Planning** - Multi-stop route optimization

---

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN UI, Lucide React Icons
- **HTTP Client:** Axios
- **Form Management:** React Hook Form
- **Validation:** Zod

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **AI Integration:** OpenAI API (GPT-4)

### Deployment
- **Frontend:** Vercel CDN
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Version Control:** Git/GitHub

---

## Project Structure

```
Mnlxplore/
│
├── frontend/          # Next.js Frontend Application
│   ├── pages/         # Next.js pages
│   ├── components/    # React components
│   ├── styles/        # CSS files
│   ├── utils/         # Utility functions
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── backend/           # Express.js Backend Server
│   ├── routes/        # API route handlers
│   ├── controllers/   # Business logic
│   ├── models/        # Database schemas
│   ├── middleware/    # Custom middleware
│   ├── server.js      # Main server file
│   ├── package.json
│   └── .env.example
│
├── docs/              # Documentation
│   ├── SETUP_GUIDE.md
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── SYSTEM_ARCHITECTURE.md
│   └── DEPLOYMENT_CHECKLIST.md
│
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Git
- MongoDB Atlas account
- OpenAI API key

### 1. Clone Repository
```bash
git clone https://github.com/taddy1866666/Mnlxplore.git
cd Mnlxplore
```

### 2. Setup Backend
```powershell
cd backend
npm install
# Create .env file based on .env.example
```

### 3. Setup Frontend
```powershell
cd ../frontend
npm install
# Create .env.local
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### 5. Open Application
Visit: **http://localhost:3000**

---

## Documentation

Complete documentation is available in the /docs folder:

| Document | Description |
|----------|-------------|
| SETUP_GUIDE.md | Step-by-step setup instructions with troubleshooting |
| API_DOCUMENTATION.md | Complete API endpoint reference |
| DATABASE_SCHEMA.md | MongoDB schema structure and relationships |
| SYSTEM_ARCHITECTURE.md | System design and data flow diagrams |
| DEPLOYMENT_CHECKLIST.md | Production deployment guide |
| GOOGLE_MAPS_SETUP.md | Google Maps API configuration |
| ADVANCED_FEATURES.md | Smart recommendations, themed plans, route optimization |

---

## API Endpoints

### Authentication
```
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
```

### Trips
```
POST /api/trip/generate    # Generate AI itinerary
POST /api/trips/save       # Save trip (authenticated)
GET /api/trips            # Get user trips (authenticated)
DELETE /api/trips/:id     # Delete trip (authenticated)
```

### Places
```
POST /api/places/curated       # Get themed places from Google
POST /api/places/calculate-distance # Distance matrix calculation
POST /api/places/recommendations # Smart recommendations
```

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

## Installation Commands

### Frontend
```bash
npm install     # Install dependencies
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Start production server
```

### Backend
```bash
npm install     # Install dependencies
npm run dev     # Start with hot-reload
npm start       # Start production server
```

---

## Testing

### Manual Testing
1. Register with email and password
2. Login with credentials
3. Navigate to Trip Planner
4. Enter destination, budget, days, and travel theme
5. Generate itinerary and review output

---

## Deployment

### Frontend Deployment (Vercel)
1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables
4. Deploy

### Backend Deployment (Render)
1. Push to GitHub
2. Create Web Service on Render
3. Set environment variables
4. Deploy

---

## Contributing
1. Fork the repository
2. Create feature branch: git checkout -b feature/amazing-feature
3. Commit changes: git commit -m 'Add amazing feature'
4. Push to branch: git push origin feature/amazing-feature
5. Open Pull Request

---

## License
This project is licensed under the MIT License - see LICENSE file for details.

---

## Team and Credits
**Project Name:** MNLXPLORE
**Type:** AI-Powered Travel Assistant
**Purpose:** Educational and Tourism Support
**Version:** 1.0.0

---

## Support and Feedback
- Email: support@mnlxplore.com
- Report Issues: GitHub Issues
- Discussions: GitHub Discussions

---

## Roadmap
- Version 1.0 - MVP Release
- Version 1.1 - User Dashboard
- Version 1.2 - Map Integration
- Version 2.0 - Mobile App
- Version 2.1 - Booking Integration
- Version 2.2 - Chatbot Assistant

---

## Project Status
```
Development Status: In Development
Last Updated: May 2026
Maintained: Yes
```

---

## Useful Links
- Next.js Documentation
- Express.js Guide
- MongoDB Atlas
- OpenAI API
- Vercel Deployment
- Render Deployment

---

**Made for travelers and tourism in Metro Manila**
If you find this helpful, please consider giving it a star!
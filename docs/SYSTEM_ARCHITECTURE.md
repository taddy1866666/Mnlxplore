# System Architecture

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │         MNLXPLORE Web Application (Next.js)                │ │
│  │  Pages: Landing | Login | Planner | Explore | Dashboard   │ │
│  │  UI: React Components + Tailwind CSS + Lucide Icons       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            ↓                                     │
│                     HTTP/HTTPS (Axios)                          │
│                            ↓                                     │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │     Express.js REST API Server (Node.js)                   │ │
│  │                                                             │ │
│  │  Routes:                                                   │ │
│  │  ├─ /api/auth       (register, login)                     │ │
│  │  ├─ /api/trip       (generate itinerary)                  │ │
│  │  ├─ /api/trips      (save, get, delete trips)             │ │
│  │  └─ /api/destinations (fetch destinations)                │ │
│  │                                                             │ │
│  │  Middleware:                                               │ │
│  │  ├─ CORS & Security                                       │ │
│  │  ├─ JWT Authentication                                    │ │
│  │  └─ Error Handling                                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│            ↓                  ↓                   ↓              │
└────────────┼──────────────────┼───────────────────┼──────────────┘
             ↓                  ↓                   ↓
   ┌─────────────────┐ ┌──────────────┐  ┌──────────────────────┐
   │   DATABASE      │ │  AI SERVICE  │  │ EXTERNAL SERVICES   │
   │   (MongoDB)     │ │  (OpenAI)    │  │                     │
   │                 │ │              │  │  - Google Maps      │
   │ Collections:    │ │ - GPT-4o     │  │  - Payment Gateway  │
   │ ├─ Users        │ │ - Generate   │  │    (Future)         │
   │ ├─ Trips        │ │   Itinerary  │  │                     │
   │ └─ Destinations │ │              │  │                     │
   └─────────────────┘ └──────────────┘  └──────────────────────┘
```

---

## Detailed Architecture

### 1. Frontend (Client Layer)

**Framework:** Next.js 14

**Components:**
- Pages: index, planner, explore, login, register, dashboard
- Components: Navigation, Cards, Forms, Modals
- Utils: API client, helpers
- Styles: Tailwind CSS

**Technologies:**
- React 18
- Tailwind CSS
- Lucide React Icons
- Axios HTTP Client
- React Hook Form

**State Management:** Local Storage (JWT Token)

---

### 2. API Layer (Backend)

**Framework:** Express.js

**Structure:**
```
backend/
├─ server.js           (Main entry point)
├─ routes/             (API endpoints)
│  ├─ authRoutes.js
│  ├─ tripRoutes.js
│  └─ destinationRoutes.js
├─ controllers/        (Business logic)
│  ├─ authController.js
│  ├─ tripController.js
│  └─ destinationController.js
├─ models/             (Database schemas)
│  ├─ User.js
│  ├─ Trip.js
│  └─ Destination.js
├─ middleware/         (Custom middleware)
│  └─ auth.js          (JWT verification)
└─ utils/              (Helper functions)
```

**Core Features:**
- User authentication (JWT)
- Trip CRUD operations
- AI itinerary generation
- Destination management

---

### 3. Database Layer

**Database:** MongoDB

**Collections:**
1. **Users** - User accounts & authentication
2. **Trips** - Travel itineraries
3. **Destinations** - Tourist locations in Manila

**Schema:** See DATABASE_SCHEMA.md

---

### 4. AI Service Layer

**Service:** OpenAI API

**Model:** GPT-4 Turbo (via gpt-4o-mini)

**Features:**
- Generate personalized itineraries
- Consider budget, duration, preferences
- Include activities, restaurants, transport

---

## Data Flow

### 1. User Registration & Login
```
Frontend (Register Form)
    ↓
Backend (POST /api/auth/register)
    ↓
Hash Password (bcrypt)
    ↓
Save User to MongoDB
    ↓
Generate JWT Token
    ↓
Return Token to Frontend
    ↓
Store in LocalStorage
```

### 2. Create Itinerary
```
Frontend (Planner Page)
    ↓ User Input (destination, budget, days, preferences)
    ↓
Backend (POST /api/trip/generate)
    ↓
OpenAI API Generation
    ↓ Create prompt with user data
    ↓
GPT-4 Returns Itinerary
    ↓
Save to MongoDB (if authenticated)
    ↓
Return to Frontend
    ↓
Display Itinerary
```

### 3. View Saved Trips
```
Frontend (Dashboard)
    ↓
Backend (GET /api/trips with JWT)
    ↓
Query MongoDB for user's trips
    ↓
Return Array of Trips
    ↓
Display in List
```

---

## Security Architecture

```
┌─────────────────────────────────────────┐
│        SECURITY LAYERS                  │
├─────────────────────────────────────────┤
│ 1. HTTPS/TLS (Transport)               │
├─────────────────────────────────────────┤
│ 2. CORS (Cross-Origin)                 │
├─────────────────────────────────────────┤
│ 3. Authentication (JWT Bearer Token)   │
├─────────────────────────────────────────┤
│ 4. Password Hashing (bcryptjs)         │
├─────────────────────────────────────────┤
│ 5. Environment Variables (.env)        │
├─────────────────────────────────────────┤
│ 6. Input Validation & Sanitization     │
├─────────────────────────────────────────┤
│ 7. Error Handling (No sensitive info)  │
└─────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│            PRODUCTION DEPLOYMENT                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend                 Backend            Database  │
│  ┌───────────────┐    ┌──────────────┐   ┌─────────┐ │
│  │ Vercel CDN    │    │ Render       │   │ MongoDB │ │
│  │ (Next.js)     │→──→│ (Express.js) │→→→│ Atlas   │ │
│  │               │    │              │   │         │ │
│  └───────────────┘    └──────────────┘   └─────────┘ │
│       Domain              Domain              Cloud   │
│   mnlxplore.com     mnlxplore-api.         Database  │
│                     onrender.com                      │
│                                                         │
│  Users (Browser) →→→ Global CDN →→→ Vercel Servers   │
│                   →→→ API Layer →→→ Render Container  │
│                   →→→ Database →→→ MongoDB Cloud      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Scalability Considerations

1. **Database Indexing** - Optimize frequent queries
2. **API Rate Limiting** - Prevent abuse
3. **Caching** - Redis for frequently accessed data
4. **CDN** - Vercel handles frontend caching
5. **Load Balancing** - Render auto-scales containers
6. **Database Replication** - MongoDB Atlas replication
7. **Monitoring** - Application performance tracking

---

## Future Enhancements

1. **Real-time Features** - WebSocket for live updates
2. **Payment Integration** - Stripe/PayMongo
3. **Mobile App** - React Native version
4. **Chatbot** - Real-time travel assistant
5. **Maps Integration** - Google Maps API
6. **Analytics** - User behavior tracking
7. **Multi-language** - i18n support
8. **Social Features** - Trip sharing, reviews

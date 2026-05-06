# MNLXPLORE Backend

Express.js backend for the MNLXPLORE AI travel assistant.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mnlxplore
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-key
NODE_ENV=development
```

3. Run development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Trips
- `POST /api/trip/generate` - Generate AI itinerary
- `GET /api/trips` - Get user trips
- `POST /api/trips/save` - Save trip

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get destination details

## Database

Uses MongoDB with Mongoose ODM.

# MNLXPLORE API Documentation

## Base URL
- **Production:** `https://mnlxplore-api.onrender.com`
- **Development:** `http://localhost:5000`

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

---

### Login User
**POST** `/api/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

---

## Trip Endpoints

### Generate Itinerary (Public)
**POST** `/api/trip/generate`

Request:
```json
{
  "destination": "Manila",
  "budget": 5000,
  "days": 3,
  "preferences": ["Food", "Adventure", "Shopping"]
}
```

Response:
```json
{
  "message": "Itinerary generated successfully",
  "itinerary": "DAY 1:\n....",
  "tripId": "507f1f77bcf86cd799439012"
}
```

---

### Save Trip (Authenticated)
**POST** `/api/trips/save`

Headers:
```
Authorization: Bearer {token}
```

Request:
```json
{
  "destination": "Manila",
  "budget": 5000,
  "days": 3,
  "preferences": ["Food", "Adventure"],
  "itinerary": "Generated itinerary text here..."
}
```

Response:
```json
{
  "message": "Trip saved successfully",
  "trip": {
    "_id": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439011",
    "destination": "Manila",
    "budget": 5000,
    "days": 3,
    "status": "completed"
  }
}
```

---

### Get User's Trips (Authenticated)
**GET** `/api/trips`

Headers:
```
Authorization: Bearer {token}
```

Response:
```json
{
  "message": "Trips retrieved successfully",
  "trips": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "destination": "Manila",
      "budget": 5000,
      "days": 3,
      "status": "completed",
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

---

### Delete Trip (Authenticated)
**DELETE** `/api/trips/{tripId}`

Headers:
```
Authorization: Bearer {token}
```

Response:
```json
{
  "message": "Trip deleted successfully"
}
```

---

## Destination Endpoints

### Get All Destinations
**GET** `/api/destinations`

Response:
```json
{
  "destinations": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Intramuros",
      "type": "Historic Site",
      "description": "Historic walled district...",
      "rating": 4.5,
      "attractions": ["San Agustin Church", "Fort Santiago"]
    }
  ]
}
```

---

### Get Single Destination
**GET** `/api/destinations/{destinationId}`

Response:
```json
{
  "destination": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Intramuros",
    "type": "Historic Site",
    "description": "...",
    "location": {
      "latitude": 14.5994,
      "longitude": 120.9842
    },
    "rating": 4.5,
    "attractions": ["..."],
    "restaurants": ["..."],
    "estimatedBudget": 1500
  }
}
```

---

## Health Check

### Server Status
**GET** `/api/health`

Response:
```json
{
  "message": "Server is running",
  "timestamp": "2024-01-15T15:30:45.123Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid token"
}
```

### 404 Not Found
```json
{
  "message": "Route not found"
}
```

### 500 Server Error
```json
{
  "message": "Something went wrong"
}
```

---

## Rate Limiting
- No rate limiting implemented yet
- Recommended for production: 100 requests/minute per IP

---

## CORS
Allowed origins:
- `http://localhost:3000` (development)
- `https://mnlxplore.vercel.app` (production)

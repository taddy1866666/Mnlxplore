# Database Schema Documentation

## Collections

### 1. Users
Stores user account information.

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  trips: [ObjectId],        // References to Trip documents
  preferences: [String],    // User travel preferences
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** email (unique)

---

### 2. Trips
Stores travel itineraries and trip details.

```javascript
{
  _id: ObjectId,
  user: ObjectId,           // Reference to User
  destination: String,      // Trip destination (e.g., "Manila", "Intramuros")
  budget: Number,           // Budget in PHP
  days: Number,             // Duration in days
  preferences: [String],    // e.g., ["Food", "Adventure", "Shopping"]
  itinerary: String,        // AI-generated itinerary (long text)
  status: String,           // "draft" | "completed" | "archived"
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** user, destination, status

---

### 3. Destinations
Stores information about tourist destinations in Metro Manila.

```javascript
{
  _id: ObjectId,
  name: String (unique),                        // Destination name
  type: String,                                 // e.g., "Historic Site", "Shopping"
  description: String,                          // Description of destination
  location: {
    latitude: Number,
    longitude: Number
  },
  rating: Number,                               // 0.0 to 5.0 stars
  attractions: [String],                        // Nearby attractions
  restaurants: [String],                        // Nearby restaurants
  estimatedBudget: Number,                      // Estimated cost in PHP
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** name, type, rating

---

## Relationships

```
User (1) ----> (Many) Trips
User (1) ----> (Many) Destinations (via Trips)
Trip (1) ----> (1) User
Trip (1) ----> (1) Destination (implicit via destination string)
```

## Sample Data

### Sample User
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "traveler@mnlxplore.com",
  "password": "$2a$10$...",
  "preferences": ["Food", "Adventure", "Culture"],
  "trips": ["507f1f77bcf86cd799439012"],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Sample Trip
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "destination": "Manila",
  "budget": 5000,
  "days": 3,
  "preferences": ["Food", "Culture"],
  "itinerary": "DAY 1: ...",
  "status": "completed",
  "createdAt": "2024-01-15T11:00:00Z"
}
```

### Sample Destination
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Intramuros",
  "type": "Historic Site",
  "description": "Historic walled district in Manila with Spanish colonial architecture",
  "location": {
    "latitude": 14.5994,
    "longitude": 120.9842
  },
  "rating": 4.5,
  "attractions": ["San Agustin Church", "Fort Santiago", "Rizal Monument"],
  "restaurants": ["Bistro Remedios", "Ilustrado", "Casa Cordoba"],
  "estimatedBudget": 1500,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Query Examples

### Find all trips by a user
```javascript
db.trips.find({ user: ObjectId("507f...") })
```

### Find trips with high budget
```javascript
db.trips.find({ budget: { $gte: 10000 } })
```

### Find top-rated destinations
```javascript
db.destinations.find({ rating: { $gte: 4.5 } })
```

### Count trips by destination
```javascript
db.trips.aggregate([
  { $group: { _id: "$destination", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

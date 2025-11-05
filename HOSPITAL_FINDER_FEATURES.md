# Hospital Finder Features

## Overview
The Hospital Finder feature allows users to discover nearby hospitals with location-based search, filtering, routing, and rating capabilities.

## Features Implemented

### 1. **Location Services**
- Automatically detects user's current location using browser geolocation API
- Shows latitude/longitude coordinates in the header
- Provides fallback message if location services are disabled

### 2. **Distance Calculation**
- Uses Haversine formula to calculate accurate distances
- Each hospital card displays distance in kilometers
- Backend API uses MongoDB 2dsphere geospatial indexing for efficient queries

### 3. **Filtering Options**

#### Specialty Filter
- Dropdown with 10 specialties:
  - All Specialties (default)
  - Cardiology
  - Neurology
  - General Surgery
  - Pediatrics
  - OB-GYN
  - Orthopedics
  - Dentistry
  - Dermatology
  - Emergency Medicine

#### Distance Filter
- Slider to set maximum distance (5-100 km)
- Default: 50 km
- Real-time filtering as slider moves

### 4. **Google Maps Routing**
- "Get Directions" button on each hospital card
- Opens Google Maps in new tab with:
  - Origin: User's current location
  - Destination: Hospital location
  - Travel mode: Driving
- Provides turn-by-turn navigation

### 5. **Rating System**

#### Submit Ratings
- Interactive 5-star rating component
- Optional comment field (text area)
- Authenticated users only
- Prevents duplicate ratings (updates existing)
- Shows "Submitting..." state during API call

#### Display Ratings
- Shows average rating with stars
- Displays total number of ratings
- Updates in real-time after submission

### 6. **Hospital Information**
- Name and address
- Phone number
- Availability status (Available/Busy/Emergency Only)
- List of specialties (shows first 3, then "+X more")
- Distance from user location

## Technical Implementation

### Database Schema
```javascript
{
  name: String,
  address: String,
  city: String,
  phone: String,
  specialties: [String],
  availability_status: Enum,
  location: {
    type: "Point",
    coordinates: [longitude, latitude]  // GeoJSON format
  },
  ratings: [{
    user_id: ObjectId,
    rating: Number (1-5),
    comment: String,
    created_at: Date
  }],
  averageRating: Number,
  totalRatings: Number
}
```

### API Endpoints

#### GET `/api/hospitals`
Query parameters:
- `lat`: User latitude
- `lng`: User longitude
- `maxDistance`: Maximum distance in km (default: 50)
- `specialty`: Filter by specialty (optional)

Returns: Array of hospitals with calculated distances

#### POST `/api/hospitals/[id]/rate`
Body:
```json
{
  "rating": 1-5,
  "comment": "Optional text"
}
```
Returns: Updated hospital with new average rating

#### GET `/api/hospitals/[id]/rate`
Returns: All ratings for a hospital with user details

### Sample Data
7 hospitals seeded across 3 cities:
- **Mumbai** (5 hospitals)
  - City General Hospital
  - Green Valley Medical Center
  - St. Mary's Hospital
  - Metro Health Clinic
  - Rainbow Children's Hospital

- **Delhi** (1 hospital)
  - Apollo Multispecialty Hospital

- **Bangalore** (1 hospital)
  - Fortis Medical Center

## Usage

1. **Navigate** to Dashboard → Hospitals
2. **Allow** location access when prompted
3. **Filter** by specialty and distance
4. **View** hospital details and distance
5. **Click** "Get Directions" to open Google Maps
6. **Click** "Rate" to submit a rating and review

## Security
- Rating submission requires authentication
- User can only rate each hospital once (updates existing rating)
- JWT token validation on all protected routes

## Future Enhancements
- [ ] Add hospital photos
- [ ] Show operating hours
- [ ] Display available beds/ER status
- [ ] Add reviews listing
- [ ] Implement ambulance booking
- [ ] Show nearby pharmacies
- [ ] Add hospital comparison feature

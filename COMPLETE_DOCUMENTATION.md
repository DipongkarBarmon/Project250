# 📚 Complete Healthcare Application Documentation

> **Comprehensive File-by-File Documentation**  
> **Project:** Healthcare Management System  
> **Tech Stack:** Next.js 16, MongoDB, Mongoose, JWT Authentication  
> **Language:** JavaScript (Converted from TypeScript)  
> **Date:** November 3, 2025

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Configuration Files](#configuration-files)
4. [Core Application Files](#core-application-files)
5. [Database Layer](#database-layer)
6. [API Routes](#api-routes)
7. [Frontend Pages](#frontend-pages)
8. [Components](#components)
9. [Utilities & Hooks](#utilities--hooks)
10. [Styling](#styling)
11. [Public Assets](#public-assets)

---

## 1. Project Overview

### Purpose
A comprehensive healthcare management system that allows users to:
- Book medical appointments
- Find nearby hospitals
- Order medicines online
- Request ambulance services
- Chat with AI health assistant

### Architecture
- **Framework:** Next.js 16 (React 19.2.0)
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens) with HTTP-only cookies
- **Password Security:** bcryptjs for hashing
- **Styling:** Tailwind CSS with custom UI components
- **API:** RESTful API routes built with Next.js App Router

---

## 2. Project Structure

```
healthcare/
├── app/                          # Next.js App Router (Pages & API)
│   ├── api/                      # Backend API routes
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Dashboard pages
│   ├── layout.jsx               # Root layout
│   ├── page.jsx                 # Landing page
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── ui/                      # UI component library
│   ├── sidebar.jsx              # Main sidebar navigation
│   └── theme-provider.jsx       # Dark/light theme provider
│
├── lib/                         # Core libraries
│   ├── mongodb/                 # MongoDB utilities
│   │   ├── models/              # Mongoose models
│   │   ├── connection.js        # DB connection handler
│   │   └── auth.js              # JWT authentication
│   ├── supabase/                # Legacy Supabase (deprecated)
│   └── utils.js                 # Utility functions
│
├── hooks/                       # Custom React hooks
│   ├── use-toast.js            # Toast notifications
│   └── use-mobile.js           # Mobile detection
│
├── public/                      # Static assets
│   └── [images]                # Placeholder images
│
├── scripts/                     # Database scripts
│   └── [SQL files]             # Legacy SQL scripts
│
├── styles/                      # Additional styles
│   └── globals.css             # Extra global styles
│
└── [config files]              # Configuration files
```

---

## 3. Configuration Files

### 3.1 `package.json`
**Location:** `/package.json`

**Purpose:** Defines project metadata, dependencies, and scripts.

**Key Scripts:**
- `dev` - Runs development server on port 3000
- `build` - Creates production build
- `start` - Starts production server
- `lint` - Runs ESLint for code quality

**Major Dependencies:**
```json
{
  "next": "16.0.0",                    // Next.js framework
  "react": "19.2.0",                   // React library
  "mongoose": "latest",                // MongoDB ODM
  "jose": "latest",                    // JWT handling
  "bcryptjs": "latest",                // Password hashing
  "@radix-ui/*": "...",               // UI component primitives
  "tailwindcss": "^4.1.9",            // CSS framework
  "zod": "3.25.76"                    // Schema validation
}
```

**Usage in Presentation:**
- Show how the project manages 60+ dependencies
- Highlight the modern tech stack (Next.js 16, React 19)
- Explain the difference between dependencies and devDependencies

---

### 3.2 `next.config.mjs`
**Location:** `/next.config.mjs`

**Purpose:** Next.js framework configuration.

**Content:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration options
};

export default nextConfig;
```

**Key Configurations:**
- Module resolution settings
- Build optimization
- Environment variable handling

**Usage in Presentation:**
- Explain how Next.js can be customized
- Discuss ESM (ECMAScript Modules) usage (.mjs extension)

---

### 3.3 `tsconfig.json`
**Location:** `/tsconfig.json`

**Purpose:** TypeScript configuration (legacy - project now uses JavaScript).

**Status:** ⚠️ Can be removed as project is now fully JavaScript

**Usage in Presentation:**
- Explain the migration from TypeScript to JavaScript
- Discuss why the file still exists (legacy/tooling compatibility)

---

### 3.4 `postcss.config.mjs`
**Location:** `/postcss.config.mjs`

**Purpose:** PostCSS configuration for Tailwind CSS processing.

**Content:**
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

**Functionality:**
- Processes Tailwind directives
- Optimizes CSS output
- Enables autoprefixer

**Usage in Presentation:**
- Explain CSS preprocessing pipeline
- Show how Tailwind integrates with Next.js

---

### 3.5 `components.json`
**Location:** `/components.json`

**Purpose:** Shadcn/ui component library configuration.

**Contains:**
- Component installation paths
- Styling preferences
- TypeScript settings
- Tailwind configuration

**Usage in Presentation:**
- Explain component library management
- Show how UI components are structured

---

### 3.6 `.env.local`
**Location:** `/.env.local`

**Purpose:** Environment variables (sensitive data).

**Content:**
```env
MONGODB_URI=mongodb://localhost:27017/healthcare
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Security:**
- ⚠️ Never commit to version control
- Listed in `.gitignore`
- Different values for dev/staging/production

**Usage in Presentation:**
- Explain environment variable management
- Discuss security best practices
- Show how to handle secrets

---

### 3.7 `.env.local.example`
**Location:** `/.env.local.example`

**Purpose:** Template for environment variables (safe to commit).

**Usage in Presentation:**
- Explain difference between .env.local and .env.local.example
- Show onboarding process for new developers

---

### 3.8 `middleware.js`
**Location:** `/middleware.js`

**Purpose:** Next.js middleware for request interception.

**Functionality:**
- Runs before every request
- Can redirect, rewrite, or modify requests
- Used for authentication checks
- Route protection

**Usage in Presentation:**
- Explain middleware concept in Next.js
- Show how requests are intercepted
- Discuss authentication flow

---

### 3.9 `.gitignore`
**Location:** `/.gitignore`

**Purpose:** Specifies files Git should ignore.

**Key Entries:**
```
node_modules/
.env.local
.next/
build/
*.log
```

**Usage in Presentation:**
- Explain version control best practices
- Discuss what should/shouldn't be committed

---

## 4. Core Application Files

### 4.1 `app/layout.jsx`
**Location:** `/app/layout.jsx`

**Purpose:** Root layout component for entire application.

**Key Features:**
- Wraps all pages
- Includes `<html>` and `<body>` tags
- Applies global providers (Theme, Auth)
- Sets metadata (title, description)

**Code Structure:**
```javascript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Usage in Presentation:**
- Explain Next.js App Router layout system
- Show how layouts nest
- Discuss metadata API

---

### 4.2 `app/page.jsx`
**Location:** `/app/page.jsx`

**Purpose:** Landing page (home page) of the application.

**Route:** `http://localhost:3000/`

**Features:**
- Hero section with call-to-action
- Feature highlights
- Login/Signup buttons
- Responsive design

**Usage in Presentation:**
- First page users see
- Explain routing in Next.js App Router
- Show component structure

---

### 4.3 `app/globals.css`
**Location:** `/app/globals.css`

**Purpose:** Global CSS styles and Tailwind directives.

**Contains:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom global styles */
```

**Key Styles:**
- CSS variables for theming
- Base element resets
- Custom utility classes

**Usage in Presentation:**
- Explain Tailwind CSS integration
- Show CSS custom properties for theming
- Discuss global vs component styles

---

## 5. Database Layer

### 5.1 `lib/mongodb/connection.js`
**Location:** `/lib/mongodb/connection.js`

**Purpose:** MongoDB connection handler with connection pooling.

**Key Features:**
- Singleton pattern (one connection shared across app)
- Connection caching for serverless environments
- Error handling
- Auto-reconnection

**Code Breakdown:**
```javascript
// Global cache for connection
let cached = global.mongoose

// Main connection function
async function connectDB() {
  if (cached.conn) return cached.conn  // Return existing
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }
  
  cached.conn = await cached.promise
  return cached.conn
}
```

**Why This Pattern:**
- Serverless functions create new instances
- Reusing connections improves performance
- Prevents "too many connections" errors

**Usage in Presentation:**
- Explain serverless architecture challenges
- Show connection pooling concept
- Discuss global state in Node.js

---

### 5.2 `lib/mongodb/auth.js`
**Location:** `/lib/mongodb/auth.js`

**Purpose:** JWT authentication utilities.

**Functions:**

#### `createToken(payload)`
- Creates JWT token from user data
- Sets 7-day expiration
- Uses HS256 algorithm

#### `verifyToken(token)`
- Validates JWT token
- Returns payload if valid, null if invalid
- Handles expiration

#### `getUser()`
- Reads auth token from cookies
- Verifies and returns user data
- Returns null if not authenticated

#### `setAuthCookie(token)`
- Sets HTTP-only cookie with token
- Secure flag for HTTPS
- 7-day expiration
- SameSite protection

#### `removeAuthCookie()`
- Deletes auth cookie
- Used for logout

**Security Features:**
- HTTP-only cookies (prevents XSS)
- Secure flag (HTTPS only in production)
- SameSite attribute (CSRF protection)
- Short-lived tokens (7 days)

**Usage in Presentation:**
- Explain JWT authentication flow
- Discuss cookie security
- Show authentication state management

---

### 5.3 `lib/mongodb/models/User.js`
**Location:** `/lib/mongodb/models/User.js`

**Purpose:** User data model (schema).

**Schema Fields:**
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  name: String (required),
  phone: String (optional),
  role: String (enum: user/admin/doctor, default: user),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Features:**
- Email uniqueness enforced at DB level
- Passwords are NEVER stored plain text
- Automatic timestamps
- Role-based access control ready

**Usage in Presentation:**
- Explain Mongoose schemas
- Discuss data modeling
- Show password security (hashing)

---

### 5.4 `lib/mongodb/models/Appointment.js`
**Location:** `/lib/mongodb/models/Appointment.js`

**Purpose:** Appointment booking data model.

**Schema Fields:**
```javascript
{
  user_id: ObjectId (ref: User, required),
  doctor_name: String (required),
  specialty: String (required),
  date: Date (required),
  time: String (required),
  status: String (enum: scheduled/completed/cancelled),
  notes: String (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Relationships:**
- References User model (foreign key)
- One user can have many appointments

**Status Flow:**
- scheduled → completed
- scheduled → cancelled

**Usage in Presentation:**
- Explain document relationships in MongoDB
- Show status enum pattern
- Discuss data validation

---

### 5.5 `lib/mongodb/models/AmbulanceRequest.js`
**Location:** `/lib/mongodb/models/AmbulanceRequest.js`

**Purpose:** Ambulance service request model.

**Schema Fields:**
```javascript
{
  user_id: ObjectId (ref: User, required),
  location: String (required),
  emergency_type: String (required),
  patient_name: String (required),
  phone: String (required),
  status: String (enum: pending/dispatched/completed/cancelled),
  notes: String (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Status Flow:**
- pending → dispatched → completed
- Any status → cancelled

**Usage in Presentation:**
- Show emergency service data modeling
- Discuss status workflows
- Explain required vs optional fields

---

### 5.6 `lib/mongodb/models/Order.js`
**Location:** `/lib/mongodb/models/Order.js`

**Purpose:** Medicine order data model.

**Schema Fields:**
```javascript
{
  user_id: ObjectId (ref: User, required),
  items: Array [
    {
      medicine_id: Number,
      medicine_name: String,
      quantity: Number,
      price: Number
    }
  ],
  total_amount: Number (required),
  delivery_address: String (required),
  payment_method: String (required),
  status: String (enum: pending/processing/shipped/delivered/cancelled),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Features:**
- Embedded items array (denormalized)
- Calculated total_amount
- Order tracking via status

**Status Flow:**
- pending → processing → shipped → delivered
- Any status → cancelled

**Usage in Presentation:**
- Explain embedded documents vs references
- Show e-commerce data modeling
- Discuss order lifecycle

---

## 6. API Routes

### API Route Architecture
All API routes follow Next.js App Router conventions:
- Located in `app/api/` directory
- Use HTTP methods (GET, POST, PATCH, DELETE)
- Return JSON responses
- Include authentication checks

---

### 6.1 Authentication APIs

#### 6.1.1 `app/api/auth/signup/route.js`
**Route:** `POST /api/auth/signup`

**Purpose:** Create new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "phone": "1234567890"
}
```

**Process:**
1. Validate input (email, password, name required)
2. Check if email already exists
3. Hash password with bcrypt (10 rounds)
4. Create user in database
5. Generate JWT token
6. Set HTTP-only cookie
7. Return user data (without password)

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Error Cases:**
- 400: Missing required fields
- 400: Email already exists
- 500: Server error

**Usage in Presentation:**
- Explain user registration flow
- Show password hashing importance
- Discuss input validation

---

#### 6.1.2 `app/api/auth/login/route.js`
**Route:** `POST /api/auth/login`

**Purpose:** Authenticate existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Process:**
1. Validate input
2. Find user by email
3. Compare password with bcrypt
4. Generate JWT token
5. Set HTTP-only cookie
6. Return user data

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Error Cases:**
- 400: Missing credentials
- 401: Invalid email or password
- 500: Server error

**Security:**
- Constant-time password comparison
- Generic error messages (prevents email enumeration)
- Rate limiting recommended (not implemented)

**Usage in Presentation:**
- Show authentication flow
- Discuss security best practices
- Explain bcrypt comparison

---

#### 6.1.3 `app/api/auth/logout/route.js`
**Route:** `POST /api/auth/logout`

**Purpose:** Log out current user.

**Process:**
1. Remove auth cookie
2. Return success

**Response:**
```json
{
  "success": true
}
```

**Usage in Presentation:**
- Show simple logout implementation
- Explain cookie deletion

---

#### 6.1.4 `app/api/auth/user/route.js`
**Route:** `GET /api/auth/user`

**Purpose:** Get current authenticated user.

**Process:**
1. Read auth cookie
2. Verify JWT token
3. Return user data

**Response (Authenticated):**
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Response (Not Authenticated):**
```json
{
  "user": null
}
```

**Usage in Presentation:**
- Show session validation
- Explain how frontend checks auth state

---

### 6.2 Appointment APIs

#### 6.2.1 `app/api/appointments/route.js`
**Methods:** GET, POST

**GET /api/appointments**
- **Purpose:** Fetch all user's appointments
- **Authentication:** Required
- **Response:** Array of appointment objects sorted by date (newest first)

**POST /api/appointments**
- **Purpose:** Create new appointment
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "doctor_name": "Dr. Smith",
    "specialty": "Cardiology",
    "date": "2025-11-10T00:00:00.000Z",
    "time": "14:00",
    "notes": "Regular checkup"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "appointment": { /* created appointment */ }
  }
  ```

**Usage in Presentation:**
- Show CRUD operations
- Explain RESTful API design
- Discuss data filtering by user_id

---

#### 6.2.2 `app/api/appointments/[id]/route.js`
**Methods:** PATCH, DELETE

**PATCH /api/appointments/:id**
- **Purpose:** Update existing appointment
- **Authentication:** Required (must own appointment)
- **Request Body:** Partial appointment object
- **Security:** Ensures user_id match

**DELETE /api/appointments/:id**
- **Purpose:** Cancel/delete appointment
- **Authentication:** Required (must own appointment)
- **Response:** Success confirmation

**Usage in Presentation:**
- Show dynamic route parameters
- Explain authorization (ownership check)
- Discuss soft delete vs hard delete

---

### 6.3 Ambulance APIs

#### 6.3.1 `app/api/ambulance/route.js`
**Methods:** GET, POST

**Structure:** Similar to appointments API

**Specific Fields:**
- location (critical for emergency)
- emergency_type
- patient_name
- phone (for contact)
- status tracking (pending → dispatched → completed)

**Usage in Presentation:**
- Show emergency service API
- Discuss real-time status updates (future: WebSocket)

---

#### 6.3.2 `app/api/ambulance/[id]/route.js`
**Methods:** PATCH, DELETE

**Similar to:** Appointment [id] route
**Special:** Status updates (dispatch coordination)

---

### 6.4 Order APIs

#### 6.4.1 `app/api/orders/route.js`
**Methods:** GET, POST

**GET /api/orders**
- Returns user's order history

**POST /api/orders**
- Creates new medicine order
- **Request Body:**
  ```json
  {
    "items": [
      {
        "medicine_id": 1,
        "medicine_name": "Paracetamol",
        "quantity": 2,
        "price": 5.99
      }
    ],
    "total_amount": 11.98,
    "delivery_address": "123 Main St",
    "payment_method": "card"
  }
  ```

**Usage in Presentation:**
- Show e-commerce order flow
- Discuss array handling
- Explain total calculation

---

### 6.5 Dashboard APIs

#### 6.5.1 `app/api/dashboard/stats/route.js`
**Method:** GET

**Purpose:** Fetch dashboard statistics for user.

**Process:**
1. Authenticate user
2. Count appointments
3. Count orders
4. Count ambulance requests
5. Return aggregate data

**Response:**
```json
{
  "appointments": 5,
  "orders": 3,
  "ambulance": 1,
  "hospitals": 5
}
```

**Usage in Presentation:**
- Show data aggregation
- Explain dashboard metrics
- Discuss performance (counting vs fetching all)

---

### 6.6 Static Data APIs

#### 6.6.1 `app/api/hospitals/route.js`
**Method:** GET

**Purpose:** Return list of hospitals (mock data).

**Authentication:** Not required (public data)

**Response:**
```json
[
  {
    "id": 1,
    "name": "City General Hospital",
    "address": "123 Main Street",
    "distance": "2.5 km",
    "rating": 4.5,
    "specialties": ["Emergency", "Cardiology"]
  }
]
```

**Future Enhancement:**
- Integration with Google Maps API
- Real-time availability
- Distance calculation based on user location

**Usage in Presentation:**
- Show static data serving
- Discuss future API integrations
- Explain mock data for prototyping

---

#### 6.6.2 `app/api/medicines/route.js`
**Method:** GET

**Purpose:** Return medicine catalog with search.

**Query Parameters:**
- `?q=search_term` - Filter medicines by name

**Response:**
```json
[
  {
    "id": 1,
    "name": "Paracetamol 500mg",
    "price": 5.99,
    "description": "Pain relief",
    "inStock": true
  }
]
```

**Features:**
- Case-insensitive search
- Stock status
- Pricing information

**Usage in Presentation:**
- Show query parameter handling
- Explain search implementation
- Discuss data filtering

---

#### 6.6.3 `app/api/chatbot/route.js`
**Method:** POST

**Purpose:** AI chatbot endpoint (placeholder).

**Current Status:** Mock/placeholder for AI integration

**Future Implementation:**
- Integration with OpenAI/Anthropic
- Medical advice generation
- Symptom analysis

**Usage in Presentation:**
- Show AI integration points
- Discuss future features
- Explain API placeholders

---

## 7. Frontend Pages

### 7.1 Authentication Pages

#### 7.1.1 `app/auth/login/page.jsx`
**Route:** `/auth/login`

**Purpose:** User login page.

**Features:**
- Email/password form
- Form validation
- Error handling
- Redirect on success
- Link to signup page

**Components Used:**
- Form component
- Input components
- Button component
- Card component

**Flow:**
1. User enters credentials
2. Submit to `/api/auth/login`
3. On success: redirect to `/dashboard`
4. On error: show error message

**Usage in Presentation:**
- Show form handling in React
- Explain client-side validation
- Discuss user experience (loading states)

---

#### 7.1.2 `app/auth/sign-up/page.jsx`
**Route:** `/auth/sign-up`

**Purpose:** New user registration page.

**Features:**
- Multi-field form (email, password, name, phone)
- Password strength indicator
- Form validation
- Duplicate email handling
- Link to login page

**Validation:**
- Email format
- Password minimum length
- Required fields

**Flow:**
1. User fills registration form
2. Submit to `/api/auth/signup`
3. On success: redirect to `/auth/sign-up-success`
4. On error: show specific error messages

**Usage in Presentation:**
- Show form complexity
- Explain validation patterns
- Discuss password requirements

---

#### 7.1.3 `app/auth/sign-up-success/page.jsx`
**Route:** `/auth/sign-up-success`

**Purpose:** Registration confirmation page.

**Features:**
- Success message
- Welcome content
- Link to dashboard
- Auto-redirect option

**Usage in Presentation:**
- Show confirmation UX pattern
- Discuss user onboarding flow

---

### 7.2 Dashboard Pages

#### 7.2.1 `app/dashboard/layout.jsx`
**Route:** `/dashboard/*` (layout)

**Purpose:** Dashboard wrapper with sidebar navigation.

**Features:**
- Sidebar component
- Protected route (requires auth)
- Responsive layout
- Navigation menu

**Components:**
- Sidebar with navigation links
- Main content area
- Mobile menu toggle

**Authentication:**
- Checks for valid session
- Redirects to login if not authenticated

**Usage in Presentation:**
- Explain nested layouts in Next.js
- Show protected route implementation
- Discuss layout composition

---

#### 7.2.2 `app/dashboard/page.jsx`
**Route:** `/dashboard`

**Purpose:** Main dashboard overview page.

**Features:**
- Statistics cards (appointments, orders, etc.)
- Quick action buttons
- Recent activity
- Welcome message

**Data Sources:**
- `/api/dashboard/stats` for metrics
- Real-time data updates

**Components:**
- Card components for stats
- Button components for actions
- Grid layout

**Usage in Presentation:**
- Show dashboard design patterns
- Explain data visualization
- Discuss metrics display

---

#### 7.2.3 `app/dashboard/appointments/page.jsx`
**Route:** `/dashboard/appointments`

**Purpose:** View and manage all appointments.

**Features:**
- Appointment list table
- Status badges (scheduled, completed, cancelled)
- Edit button (future)
- Cancel button
- Link to book new appointment

**Data Flow:**
1. Fetch appointments from `/api/appointments`
2. Display in table
3. Cancel via DELETE `/api/appointments/:id`

**Components:**
- Table component
- Badge component
- Dialog/Modal for confirmation

**Usage in Presentation:**
- Show CRUD operations in action
- Explain state management
- Discuss optimistic UI updates

---

#### 7.2.4 `app/dashboard/appointments/book/page.jsx`
**Route:** `/dashboard/appointments/book`

**Purpose:** Book new medical appointment.

**Features:**
- Doctor selection
- Specialty filter
- Date picker
- Time slot selection
- Notes field
- Form validation

**Form Fields:**
- Doctor name (dropdown/search)
- Specialty (dropdown)
- Date (calendar picker)
- Time (time slots)
- Notes (textarea)

**Flow:**
1. User selects doctor/specialty
2. Choose date and time
3. Add optional notes
4. Submit to `/api/appointments` (POST)
5. Redirect to appointments list

**Usage in Presentation:**
- Show multi-step form
- Explain date/time handling
- Discuss form state management

---

#### 7.2.5 `app/dashboard/hospitals/page.jsx`
**Route:** `/dashboard/hospitals`

**Purpose:** Find nearby hospitals.

**Features:**
- Hospital list/grid view
- Distance indicator
- Rating display
- Specialties shown
- "Get Directions" button (future: Maps integration)
- Search/filter

**Data Source:**
- `/api/hospitals` for hospital list

**Future Features:**
- Google Maps integration
- Real-time distance calculation
- Availability status

**Usage in Presentation:**
- Show list/grid layouts
- Discuss future API integrations
- Explain location services

---

#### 7.2.6 `app/dashboard/medicines/page.jsx`
**Route:** `/dashboard/medicines`

**Purpose:** Browse and order medicines.

**Features:**
- Medicine catalog/grid
- Search bar
- Shopping cart
- "Add to Cart" buttons
- Price display
- Stock status
- Cart summary
- Checkout button

**Shopping Cart:**
- Client-side state (React state/context)
- Add/remove items
- Quantity adjustment
- Total calculation

**Flow:**
1. Browse medicines
2. Search/filter
3. Add to cart
4. Review cart
5. Proceed to checkout
6. Submit order to `/api/orders` (POST)

**Usage in Presentation:**
- Show e-commerce patterns
- Explain shopping cart state
- Discuss checkout flow

---

#### 7.2.7 `app/dashboard/orders/page.jsx`
**Route:** `/dashboard/orders`

**Purpose:** View order history.

**Features:**
- Orders list
- Status tracking
- Order details
- Date/time information
- Total amount
- Items breakdown

**Data Source:**
- `/api/orders` (GET)

**Order Statuses:**
- Pending
- Processing
- Shipped
- Delivered
- Cancelled

**Usage in Presentation:**
- Show order tracking UI
- Explain status workflows
- Discuss order management

---

#### 7.2.8 `app/dashboard/ambulance/page.jsx`
**Route:** `/dashboard/ambulance`

**Purpose:** Request ambulance service.

**Features:**
- Emergency request form
- Location input
- Emergency type selection
- Patient information
- Phone number
- Request history
- Status tracking

**Form Fields:**
- Location (text/map picker)
- Emergency type (dropdown)
- Patient name
- Contact phone
- Additional notes

**Flow:**
1. Fill emergency details
2. Confirm location
3. Submit to `/api/ambulance` (POST)
4. Show confirmation
5. Track status

**Usage in Presentation:**
- Show emergency service UX
- Discuss critical form design
- Explain status updates

---

#### 7.2.9 `app/dashboard/chatbot/page.jsx`
**Route:** `/dashboard/chatbot`

**Purpose:** AI health assistant chat interface.

**Features:**
- Chat message display
- Message input
- AI responses (mock/future)
- Conversation history
- Typing indicator

**Future Implementation:**
- OpenAI GPT integration
- Medical knowledge base
- Symptom analysis
- Health recommendations

**Usage in Presentation:**
- Show chat UI patterns
- Discuss AI integration
- Explain future roadmap

---

## 8. Components

### 8.1 Layout Components

#### 8.1.1 `components/sidebar.jsx`
**Purpose:** Main navigation sidebar for dashboard.

**Features:**
- Navigation links
- Active route highlighting
- Icons for each section
- Responsive (drawer on mobile)
- Logout button

**Navigation Items:**
- Dashboard (overview)
- Appointments
- Hospitals
- Medicines
- Orders
- Ambulance
- Chatbot

**Usage in Presentation:**
- Show navigation patterns
- Explain active link styling
- Discuss mobile responsiveness

---

#### 8.1.2 `components/theme-provider.jsx`
**Purpose:** Dark/light theme provider.

**Features:**
- Theme switching
- Persists preference (localStorage)
- System theme detection
- Smooth transitions

**Usage in Presentation:**
- Explain React Context API
- Show theme implementation
- Discuss user preferences

---

### 8.2 UI Components Library

All components in `components/ui/` are reusable, accessible UI primitives based on Radix UI and styled with Tailwind CSS.

#### Common UI Components:

**Button (`button.jsx`)**
- Primary, secondary, outline variants
- Sizes: sm, md, lg
- Loading states
- Icon support

**Card (`card.jsx`)**
- Container component
- Header, content, footer sections
- Elevation variants

**Input (`input.jsx`)**
- Text input
- Form integration
- Validation states
- Prefix/suffix support

**Dialog (`dialog.jsx`)**
- Modal dialogs
- Accessible (keyboard, screen reader)
- Customizable

**Table (`table.jsx`)**
- Data table component
- Sortable columns
- Responsive design

**Form (`form.jsx`)**
- Form wrapper
- Validation integration
- Error handling

**Badge (`badge.jsx`)**
- Status indicators
- Color variants
- Size options

**Alert (`alert.jsx`)**
- Notification messages
- Variants: info, success, warning, error
- Dismissible

**Toast (`toast.jsx`, `toaster.jsx`)**
- Toast notifications
- Auto-dismiss
- Action buttons
- Stacking

**Calendar (`calendar.jsx`)**
- Date picker
- Range selection
- Disabled dates

**Select (`select.jsx`)**
- Dropdown selection
- Searchable
- Multi-select

**Tabs (`tabs.jsx`)**
- Tabbed interface
- Keyboard navigation

**Accordion (`accordion.jsx`)**
- Collapsible sections
- Single/multiple expand

**Usage in Presentation:**
- Show component library structure
- Explain reusability
- Discuss accessibility features
- Demonstrate Radix UI primitives

---

## 9. Utilities & Hooks

### 9.1 `lib/utils.js`
**Purpose:** Utility functions.

**Main Function:**
```javascript
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

**What it does:**
- Combines Tailwind classes intelligently
- Resolves conflicts (later class wins)
- Handles conditional classes

**Example:**
```javascript
cn("px-4 py-2", isActive && "bg-blue-500", "px-6")
// Result: "py-2 bg-blue-500 px-6"
```

**Usage in Presentation:**
- Explain class merging
- Show Tailwind best practices
- Discuss utility function patterns

---

### 9.2 `hooks/use-toast.js`
**Purpose:** Toast notification management hook.

**Exports:**
- `useToast()` - React hook
- `toast()` - Imperative API

**Features:**
- Show toast messages
- Auto-dismiss
- Multiple toasts
- Action buttons
- Variants (success, error, info)

**Usage:**
```javascript
const { toast } = useToast()

toast({
  title: "Success",
  description: "Appointment booked!",
  variant: "success"
})
```

**Usage in Presentation:**
- Show custom hooks
- Explain toast notification patterns
- Discuss global state for UI

---

### 9.3 `hooks/use-mobile.js`
**Purpose:** Detect mobile/responsive breakpoints.

**Returns:** Boolean indicating if screen is mobile-sized

**Usage:**
```javascript
const isMobile = useIsMobile()

return isMobile ? <MobileMenu /> : <DesktopMenu />
```

**Breakpoint:** 768px (Tailwind md breakpoint)

**Usage in Presentation:**
- Show responsive design hooks
- Explain window event listeners
- Discuss mobile-first approach

---

## 10. Styling

### 10.1 Tailwind CSS
**Configuration:** Via `postcss.config.mjs` and `tailwind.config.js`

**Approach:**
- Utility-first CSS
- Custom design tokens
- Dark mode support
- Responsive utilities

**Usage in Presentation:**
- Show Tailwind workflow
- Explain utility classes
- Discuss pros/cons vs traditional CSS

---

### 10.2 Global Styles
**Files:**
- `app/globals.css` - Main global styles
- `styles/globals.css` - Additional styles

**Contains:**
- CSS custom properties for theming
- Base element styles
- Animation keyframes
- Utility classes

**Usage in Presentation:**
- Show CSS architecture
- Explain theming system
- Discuss CSS variables

---

## 11. Public Assets

### 11.1 Images
**Location:** `/public/`

**Files:**
- `placeholder.svg` - Generic placeholder
- `placeholder.jpg` - Image placeholder
- `placeholder-logo.svg` - Logo placeholder
- `placeholder-user.jpg` - User avatar placeholder

**Usage:**
- During development
- Replace with real assets in production

**Usage in Presentation:**
- Show asset management in Next.js
- Explain public directory
- Discuss image optimization

---

## 12. Database Scripts

### 12.1 SQL Scripts (Legacy)
**Location:** `/scripts/`

**Files:**
- `001_create_tables.sql`
- `001_init_database.sql`
- `002_seed_data.sql`

**Status:** ⚠️ Legacy files from Supabase (PostgreSQL)

**Current Database:** MongoDB (NoSQL) - SQL scripts not used

**Usage in Presentation:**
- Explain migration history
- Discuss SQL vs NoSQL
- Show project evolution

---

## 13. Additional Files

### 13.1 Legacy Supabase Files
**Location:** `/lib/supabase/`

**Files:**
- `client.js` - Supabase client setup
- `server.js` - Server-side Supabase
- `middleware.js` - Supabase middleware

**Status:** ⚠️ Deprecated - Project now uses MongoDB

**Can be removed:** Yes, but kept for reference

**Usage in Presentation:**
- Explain migration from Supabase to MongoDB
- Discuss why MongoDB was chosen
- Show comparison

---

## 14. Key Takeaways for Presentation

### Architecture Highlights

1. **Full-Stack JavaScript**
   - Next.js 16 (App Router)
   - React 19
   - MongoDB with Mongoose
   - All JavaScript (no TypeScript)

2. **Authentication**
   - JWT-based
   - HTTP-only cookies
   - bcrypt password hashing
   - Secure session management

3. **Database**
   - MongoDB (NoSQL)
   - Mongoose ODM
   - 4 main models (User, Appointment, Ambulance, Order)
   - Connection pooling

4. **API Design**
   - RESTful endpoints
   - Consistent error handling
   - Authentication middleware
   - JSON responses

5. **Frontend**
   - Component-based architecture
   - Reusable UI library (60+ components)
   - Responsive design
   - Dark/light theme

6. **Features**
   - User authentication
   - Appointment booking
   - Hospital locator
   - Medicine ordering
   - Ambulance requests
   - AI chatbot (future)

---

## 15. Presentation Flow Suggestions

### Introduction (2 min)
- Project overview
- Tech stack
- Features demo

### Architecture (5 min)
- Project structure
- Database design
- API architecture
- Authentication flow

### Code Walkthrough (10 min)
- **Backend:** MongoDB models, API routes
- **Frontend:** Key pages, components
- **Authentication:** JWT implementation

### Features Demo (5 min)
- Live demo of main features
- User flow walkthrough

### Challenges & Solutions (3 min)
- TypeScript to JavaScript migration
- Supabase to MongoDB migration
- Authentication implementation

### Future Enhancements (2 min)
- Google Maps integration
- Real-time updates (WebSocket)
- AI chatbot (OpenAI)
- Payment integration

### Q&A (3 min)

---

## 16. Files Summary Count

- **Total Files:** 240+
- **API Routes:** 15
- **Pages:** 12
- **Components:** 60+
- **Models:** 4
- **Configuration:** 10+

---

## 📌 Final Notes

This documentation covers every significant file in your healthcare application. Use this as a reference during your presentation to explain:

1. **What each file does**
2. **Why it exists**
3. **How it connects to other parts**
4. **Its role in the overall system**

Good luck with your presentation! 🎉

---

**Document Version:** 1.0  
**Last Updated:** November 3, 2025  
**Author:** Healthcare App Development Team

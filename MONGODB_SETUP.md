# Healthcare Application - MongoDB Setup

## ✅ MongoDB Successfully Integrated!

Your healthcare application now uses **MongoDB** instead of Supabase.

---

## 🚀 Quick Start

### 1. Install MongoDB Locally

**Option A: Ubuntu/Debian**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Option B: Using Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option C: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `.env.local` with your Atlas connection string

---

### 2. Configure Environment Variables

The `.env.local` file has already been updated with:
```env
MONGODB_URI=mongodb://localhost:27017/healthcare
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**⚠️ Important:** Change the `JWT_SECRET` to a random secure string!

---

### 3. Install Dependencies

```bash
npm install --legacy-peer-deps
```

---

### 4. Run the Application

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

---

## 📊 Database Models

### User
- `email` (String, unique, required)
- `password` (String, hashed, required)
- `name` (String, required)
- `phone` (String)
- `role` (String: 'user', 'admin', 'doctor')
- `createdAt`, `updatedAt` (timestamps)

### Appointment
- `user_id` (ObjectId, ref: User)
- `doctor_name` (String)
- `specialty` (String)
- `date` (Date)
- `time` (String)
- `status` (String: 'scheduled', 'completed', 'cancelled')
- `notes` (String)
- `createdAt`, `updatedAt` (timestamps)

### AmbulanceRequest
- `user_id` (ObjectId, ref: User)
- `location` (String)
- `emergency_type` (String)
- `patient_name` (String)
- `phone` (String)
- `status` (String: 'pending', 'dispatched', 'completed', 'cancelled')
- `notes` (String)
- `createdAt`, `updatedAt` (timestamps)

### Order
- `user_id` (ObjectId, ref: User)
- `items` (Array of objects)
  - `medicine_id` (Number)
  - `medicine_name` (String)
  - `quantity` (Number)
  - `price` (Number)
- `total_amount` (Number)
- `delivery_address` (String)
- `payment_method` (String)
- `status` (String: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
- `createdAt`, `updatedAt` (timestamps)

---

## 🔐 Authentication

The app now uses **JWT (JSON Web Tokens)** for authentication:

- **Signup:** `POST /api/auth/signup`
- **Login:** `POST /api/auth/login`
- **Logout:** `POST /api/auth/logout`
- **Get User:** `GET /api/auth/user`

Authentication tokens are stored in HTTP-only cookies for security.

---

## 📝 API Endpoints

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Create appointment
- `PATCH /api/appointments/[id]` - Update appointment
- `DELETE /api/appointments/[id]` - Delete appointment

### Ambulance
- `GET /api/ambulance` - Get ambulance requests
- `POST /api/ambulance` - Create ambulance request
- `PATCH /api/ambulance/[id]` - Update request
- `DELETE /api/ambulance/[id]` - Delete request

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Static Data (No auth required)
- `GET /api/hospitals` - Get hospitals list
- `GET /api/medicines` - Get medicines list

---

## 🛠️ Verify MongoDB Connection

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Or connect with mongo shell
mongosh
> use healthcare
> show collections
```

---

## 🔧 Troubleshooting

**MongoDB not starting?**
```bash
sudo systemctl restart mongod
sudo journalctl -u mongod
```

**Port already in use?**
```bash
sudo lsof -i :27017
```

**Can't connect to MongoDB?**
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env.local`
- Check firewall settings

---

## 📦 What Changed?

✅ Removed Supabase dependencies
✅ Added MongoDB with Mongoose
✅ Implemented JWT authentication
✅ Created database models
✅ Updated all API routes
✅ Added bcrypt for password hashing

---

## 🎉 Ready to Go!

Your application is now fully configured with MongoDB. Start the development server and begin testing!

```bash
npm run dev
```

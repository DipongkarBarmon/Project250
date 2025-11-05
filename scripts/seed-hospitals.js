const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare'

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  specialties: [String],
  availability_status: {
    type: String,
    enum: ['Available', 'Busy', 'Emergency Only'],
    default: 'Available'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  ratings: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    created_at: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 }
}, { timestamps: true })

hospitalSchema.index({ location: '2dsphere' })

const Hospital = mongoose.models.Hospital || mongoose.model('Hospital', hospitalSchema)

const sampleHospitals = [
  {
    name: "Sylhet MAG Osmani Medical College Hospital",
    address: "Medical College Road, Mirabazar",
    city: "Sylhet",
    phone: "+880 821-713491",
    specialties: ["Cardiology", "Neurology", "General Surgery", "Emergency Medicine", "Pediatrics", "OB-GYN"],
    availability_status: "Available",
    location: {
      type: "Point",
      coordinates: [91.8697, 24.8949] // [longitude, latitude] Sylhet
    }
  },
  {
    name: "Jalalabad Ragib-Rabeya Medical College Hospital",
    address: "Jalalabad, Airport Road",
    city: "Sylhet",
    phone: "+880 821-710050",
    specialties: ["Cardiology", "Neurology", "Orthopedics", "General Surgery", "Emergency Medicine"],
    availability_status: "Available",
    location: {
      type: "Point",
      coordinates: [91.8346, 24.8614]
    }
  },
  {
    name: "Mount Adora Hospital",
    address: "Akhalia, Near Shahjalal University",
    city: "Sylhet",
    phone: "+880 821-720045",
    specialties: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "OB-GYN"],
    availability_status: "Available",
    location: {
      type: "Point",
      coordinates: [91.8832, 24.9207]
    }
  },
  {
    name: "Noorjahan Hospital",
    address: "Subid Bazar, Zindabazar",
    city: "Sylhet",
    phone: "+880 821-716888",
    specialties: ["General Surgery", "OB-GYN", "Pediatrics", "Emergency Medicine"],
    availability_status: "Available",
    location: {
      type: "Point",
      coordinates: [91.8701, 24.8990]
    }
  },
  {
    name: "Oasis Hospital",
    address: "Chowhatta, Mirabazar",
    city: "Sylhet",
    phone: "+880 821-723333",
    specialties: ["Cardiology", "Neurology", "General Surgery", "Orthopedics"],
    availability_status: "Busy",
    location: {
      type: "Point",
      coordinates: [91.8689, 24.8935]
    }
  },
  {
    name: "Ibn Sina Hospital Sylhet",
    address: "Subhani Ghat, Sylhet Sadar",
    city: "Sylhet",
    phone: "+880 821-2885983",
    specialties: ["Cardiology", "Neurology", "Orthopedics", "Emergency Medicine", "Dermatology"],
    availability_status: "Available",
    location: {
      type: "Point",
      coordinates: [91.8719, 24.8869]
    }
  },
  {
    name: "Popular Hospital Sylhet",
    address: "Mirboxtula, Ambarkhana",
    city: "Sylhet",
    phone: "+880 821-720220",
    specialties: ["Cardiology", "General Surgery", "Pediatrics", "OB-GYN"],
    availability_status: "Available",
    location: {
      type: "Point",
      coordinates: [91.8667, 24.8898]
    }
  },
  {
    name: "Al-Haramain Hospital",
    address: "Shahjalal Uposhohor, Sylhet",
    city: "Sylhet",
    phone: "+880 821-711177",
    specialties: ["General Surgery", "Emergency Medicine", "Pediatrics", "Dentistry"],
    availability_status: "Available",
    location: {
      type: "Point",
      coordinates: [91.8850, 24.9150]
    }
  },
  {
    name: "Trust Hospital & Diagnostic Centre",
    address: "Mendibag, Sylhet Sadar",
    city: "Sylhet",
    phone: "+880 821-726677",
    specialties: ["Cardiology", "Neurology", "Orthopedics", "General Surgery"],
    availability_status: "Available",
    location: {
      type: "Point",
      coordinates: [91.8705, 24.8845]
    }
  },
  {
    name: "Parkview Hospital",
    address: "Shahjalal Upashahar, Sylhet",
    city: "Sylhet",
    phone: "+880 821-717444",
    specialties: ["Pediatrics", "OB-GYN", "Emergency Medicine", "Dermatology"],
    availability_status: "Available",
    location: {
      type: "Point",
      coordinates: [91.8880, 24.9180]
    }
  }
]

async function seedHospitals() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing hospitals
    await Hospital.deleteMany({})
    console.log('Cleared existing hospitals')

    // Insert sample hospitals
    const result = await Hospital.insertMany(sampleHospitals)
    console.log(`Inserted ${result.length} hospitals in Sylhet, Bangladesh`)

    console.log('\nHospitals seeded successfully:')
    result.forEach(hospital => {
      console.log(`- ${hospital.name}`)
      console.log(`  Address: ${hospital.address}`)
      console.log(`  Phone: ${hospital.phone}`)
    })

    await mongoose.connection.close()
    console.log('\nDatabase connection closed')
  } catch (error) {
    console.error('Error seeding hospitals:', error)
    process.exit(1)
  }
}

seedHospitals()

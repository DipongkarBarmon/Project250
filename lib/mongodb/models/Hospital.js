import mongoose from 'mongoose'

const HospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    specialties: [{
      type: String,
    }],
    facilities: [{
      type: String,
    }],
    beds_available: {
      type: Number,
      default: 0,
    },
    availability_status: {
      type: String,
      enum: ['Available', 'Limited', 'Full'],
      default: 'Available',
    },
    emergency_services: {
      type: Boolean,
      default: true,
    },
    ratings: [{
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      comment: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// Create geospatial index for location-based queries
HospitalSchema.index({ location: '2dsphere' })

// Method to calculate average rating
HospitalSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0
    this.totalRatings = 0
  } else {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0)
    this.averageRating = sum / this.ratings.length
    this.totalRatings = this.ratings.length
  }
}

export default mongoose.models.Hospital || mongoose.model('Hospital', HospitalSchema)

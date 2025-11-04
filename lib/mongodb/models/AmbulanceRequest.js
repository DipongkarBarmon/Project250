import mongoose from 'mongoose'

const AmbulanceRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    emergency_type: {
      type: String,
      required: true,
    },
    patient_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'dispatched', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.AmbulanceRequest || mongoose.model('AmbulanceRequest', AmbulanceRequestSchema)

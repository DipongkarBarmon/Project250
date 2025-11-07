import mongoose from 'mongoose'

const AmbulanceSchema = new mongoose.Schema({
  ambulanceNumber: {
    type: String,
    required: true,
    trim: true
  },
  driverName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

const ServiceProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
})

// Virtual for ambulances
ServiceProviderSchema.virtual('ambulances', {
  ref: 'Ambulance',
  localField: '_id',
  foreignField: 'serviceProvider'
})

ServiceProviderSchema.set('toJSON', { virtuals: true })
ServiceProviderSchema.set('toObject', { virtuals: true })

export const Ambulance = mongoose.models.Ambulance || mongoose.model('Ambulance', AmbulanceSchema)
export const ServiceProvider = mongoose.models.ServiceProvider || mongoose.model('ServiceProvider', ServiceProviderSchema)

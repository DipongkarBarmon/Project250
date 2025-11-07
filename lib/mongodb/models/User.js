import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    
    // Patient-specific fields
    dateOfBirth: {
      type: Date,
    },
    bloodGroup: {
      type: String,
    },
    address: {
      type: String,
    },
    isVarified:{
      type:Boolean,
      default:false
    },
    verificationCode:String,
    // resetPasswordCode:String,
    // resetPasswordExpires:Date,
     
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.User || mongoose.model('User', UserSchema)

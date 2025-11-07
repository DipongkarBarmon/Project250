import mongoose from 'mongoose'
 

const doctorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      // unique: true,
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
    profilePicture: {
      type: String, // URL or path to the profile picture
    },
    isVarified:{
       type:Boolean,
       default:false,
    },
    verificationCode:String,
    // Admin approval for displaying to patients
    isApproved: {
      type: Boolean,
      default: false,
    },
    // Admin approval for listing on patient site
  // resetPasswordCode:String,
  // resetPasswordExpires:Date,
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      default: 'patient',
    },
    // Doctor-specific fields - Basic Info (filled during signup)
    mbbsFrom: {
      type: String,
      required: function() { return this.role === 'doctor' }
    },
    currentWorkplace: {
      type: String,
      required: function() { return this.role === 'doctor' }
    },
    // Doctor-specific fields - Profile Info (editable after signup)
    specialty: {
      type: String,
    },
    additionalDegrees: {
      type: [String], // e.g., ['MD (Cardiology)', 'Fellowship in Interventional Cardiology']
    },
    academicPosition: {
      type: String, // e.g., 'Professor', 'Associate Professor', 'Assistant Professor'
    },
    departmentHead: {
      isDepartmentHead: { type: Boolean, default: false },
      department: String, // e.g., 'Cardiology Department'
      institution: String, // e.g., 'Johns Hopkins Medical College'
    },
    experience: {
      type: Number, // years of experience
    },
    consultationFee: {
      type: Number,
    },
    schedule: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String, // e.g., '09:00'
      endTime: String,   // e.g., '17:00'
    }],
    // Profile fields (filled after signup)
    licenseNumber: {
      type: String,
      sparse: true,
    },
    qualifications: {
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
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
  },
  {
    timestamps: true,
  }
)

//export default mongoose.models.doctorSchema || mongoose.model('User',doctorSchema)

const doctor =
  mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default doctor;
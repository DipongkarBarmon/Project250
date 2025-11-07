import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import Appointment from "@/lib/mongodb/models/Appointment"
import User from "@/lib/mongodb/models/User"
import { getUserDoctor } from "@/lib/mongodb/auth"

export async function GET() {
  const doctor = await getUserDoctor()
  
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    
    const doctorId = doctor.id || doctor.userId
    
    // Get all appointments for this doctor with patient details
    const appointments = await Appointment.find({ doctorId: doctorId })
      .sort({ appointmentDate: -1, appointmentTime: -1 })
      .lean()

    // Get unique patient IDs
    const patientIds = [...new Set(appointments.map(apt => apt.user_id.toString()))]
    
    // Fetch patient details
    const patients = await User.find({ _id: { $in: patientIds } })
      .select('name email phone')
      .lean()

    // Create a map for quick patient lookup
    const patientMap = {}
    patients.forEach(patient => {
      patientMap[patient._id.toString()] = patient
    })

    // Combine appointments with patient info
    const appointmentsWithPatients = appointments.map(apt => ({
      ...apt,
      patient: patientMap[apt.user_id.toString()] || null
    }))

    return NextResponse.json({ appointments: appointmentsWithPatients })
  } catch (error) {
    console.error('Appointments fetch error:', error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

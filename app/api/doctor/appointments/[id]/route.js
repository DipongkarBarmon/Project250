import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import Appointment from "@/lib/mongodb/models/Appointment"
import { getUserDoctor } from "@/lib/mongodb/auth"

export async function PATCH(request, { params }) {
  const doctor = await getUserDoctor()
  
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    
    const { id } = await params
    const body = await request.json()
    const { doctorNotes, status } = body

    const doctorId = doctor.id || doctor.userId

    console.log('Update appointment:', { id, doctorId, doctorNotes, status })

    // Find the appointment and verify it belongs to this doctor
    const appointment = await Appointment.findOne({ _id: id, doctorId: doctorId })

    console.log('Found appointment:', appointment ? 'Yes' : 'No')

    if (!appointment) {
      // Try to find without doctorId check to debug
      const anyAppointment = await Appointment.findById(id)
      console.log('Appointment exists but doctorId mismatch:', anyAppointment ? { 
        appointmentDoctorId: anyAppointment.doctorId, 
        requestDoctorId: doctorId 
      } : 'Not found at all')
      
      return NextResponse.json({ error: "Appointment not found or doesn't belong to you" }, { status: 404 })
    }

    // Update the appointment
    if (doctorNotes !== undefined) {
      appointment.doctorNotes = doctorNotes
    }
    if (status !== undefined) {
      appointment.status = status
    }

    await appointment.save()

    return NextResponse.json({ success: true, appointment })
  } catch (error) {
    console.error('Appointment update error:', error)
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}

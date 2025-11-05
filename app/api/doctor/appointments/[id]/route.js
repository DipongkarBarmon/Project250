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
    
    const { id } = params
    const body = await request.json()
    const { doctorNotes, status } = body

    // Find the appointment and verify it belongs to this doctor
    const appointment = await Appointment.findOne({ _id: id, doctorId: doctor.id })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
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

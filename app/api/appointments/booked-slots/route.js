import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import Appointment from "@/lib/mongodb/models/Appointment"

export async function GET(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get('doctorId')
    const date = searchParams.get('date')

    if (!doctorId || !date) {
      return NextResponse.json({ error: "Doctor ID and date are required" }, { status: 400 })
    }

    // Find all booked appointments for this doctor on this date (exclude cancelled)
    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: date,
      status: { $in: ['scheduled', 'completed'] }
    }).select('appointmentTime')

    // Extract just the time slots
    const bookedSlots = bookedAppointments.map(apt => apt.appointmentTime)

    return NextResponse.json({ bookedSlots })
  } catch (error) {
    console.error('Error fetching booked slots:', error)
    return NextResponse.json({ error: "Failed to fetch booked slots" }, { status: 500 })
  }
}

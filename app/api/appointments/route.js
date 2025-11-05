import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import Appointment from "@/lib/mongodb/models/Appointment"
import { getUser } from "@/lib/mongodb/auth"

export async function GET() {
  const user = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    
    const appointments = await Appointment.find({ user_id: user.id })
      .sort({ date: -1 })
      .lean()

    return NextResponse.json({appointments})
  } catch (error) {
    console.error('Appointments fetch error:', error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request) {
  const user = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    
    const body = await request.json()

    const appointment = await Appointment.create({
      user_id: user.id,
      ...body,
    })

    return NextResponse.json({ success: true, appointment })
  } catch (error) {
    console.error('Appointment creation error:', error)
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 })
  }
}

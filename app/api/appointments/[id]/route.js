import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import Appointment from "@/lib/mongodb/models/Appointment"
import { getUser } from "@/lib/mongodb/auth"

export async function PATCH(request, { params }) {
  const user = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    
    const body = await request.json()
    const { id } =await params

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, user_id: user.id },
      body,
      { new: true }
    )

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, appointment })
  } catch (error) {
    console.error('Appointment update error:', error)
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const user = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    
    const { id } = await params

    const appointment = await Appointment.findOneAndDelete({
      _id: id,
      user_id: user.id,
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Appointment deletion error:', error)
    return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 })
  }
}

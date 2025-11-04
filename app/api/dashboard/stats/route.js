import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import Appointment from "@/lib/mongodb/models/Appointment"
import Order from "@/lib/mongodb/models/Order"
import AmbulanceRequest from "@/lib/mongodb/models/AmbulanceRequest"
import { getUser } from "@/lib/mongodb/auth"

export async function GET() {
  const user = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    
    const [appointmentsCount, ordersCount, ambulanceCount] = await Promise.all([
      Appointment.countDocuments({ user_id: user.id }),
      Order.countDocuments({ user_id: user.id }),
      AmbulanceRequest.countDocuments({ user_id: user.id }),
    ])

    return NextResponse.json({
      appointments: appointmentsCount || 0,
      orders: ordersCount || 0,
      ambulance: ambulanceCount || 0,
      hospitals: 5,
    })
  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

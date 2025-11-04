import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import AmbulanceRequest from "@/lib/mongodb/models/AmbulanceRequest"
import { getUser } from "@/lib/mongodb/auth"

export async function GET() {
  const user = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    
    const requests = await AmbulanceRequest.find({ user_id: user.id })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Ambulance requests fetch error:', error)
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
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

    const ambulanceRequest = await AmbulanceRequest.create({
      user_id: user.id,
      ...body,
      status: "pending",
    })

    return NextResponse.json({ success: true, request: ambulanceRequest })
  } catch (error) {
    console.error('Ambulance request creation error:', error)
    return NextResponse.json({ error: "Failed to request ambulance" }, { status: 500 })
  }
}

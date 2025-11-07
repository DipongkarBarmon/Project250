import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import AmbulanceRequest from "@/lib/mongodb/models/AmbulanceRequest"
import { getUser } from "@/lib/mongodb/auth"

export async function PATCH(request, { params }) {
  const user = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    
    const body = await request.json()
    const { id } = await params

    const ambulanceRequest = await AmbulanceRequest.findOneAndUpdate(
      { _id: id, user_id: user.id },
      body,
      { new: true }
    )

    if (!ambulanceRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, request: ambulanceRequest })
  } catch (error) {
    console.error('Ambulance request update error:', error)
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
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

    const ambulanceRequest = await AmbulanceRequest.findOneAndDelete({
      _id: id,
      user_id: user.id,
    })

    if (!ambulanceRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ambulance request deletion error:', error)
    return NextResponse.json({ error: "Failed to delete request" }, { status: 500 })
  }
}

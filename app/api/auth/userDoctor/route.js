import { NextResponse } from "next/server"
import { getUserDoctor } from "@/lib/mongodb/auth"
import connectDB from "@/lib/mongodb/connection"
import doctor from "@/lib/mongodb/models/doctor"

export async function GET() {
  try {
    const userFromToken = await getUserDoctor()

    if (!userFromToken) {
      return NextResponse.json({ user: null })
    }

    // Fetch fresh data from MongoDB instead of using cached JWT data
    await connectDB()
    const freshUser = await doctor.findById(userFromToken.id).select('-password')

    if (!freshUser) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: freshUser })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ user: null })
  }
}

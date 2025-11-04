import { NextResponse } from "next/server"
import { getUser } from "@/lib/mongodb/auth"
import connectDB from "@/lib/mongodb/connection"
import User from "@/lib/mongodb/models/User"

export async function GET() {
  try {
    const userFromToken = await getUser()

    if (!userFromToken) {
      return NextResponse.json({ user: null })
    }

    // Fetch fresh data from MongoDB instead of using cached JWT data
    await connectDB()
    const freshUser = await User.findById(userFromToken.id).select('-password')

    if (!freshUser) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: freshUser })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ user: null })
  }
}

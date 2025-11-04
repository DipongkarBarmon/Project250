import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import User from "@/lib/mongodb/models/User"
import { createToken, setAuthCookie } from "@/lib/mongodb/auth"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    await connectDB()
    
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user
    const user = await User.findOne({ email })
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await createToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // Set cookie
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    )
  }
}

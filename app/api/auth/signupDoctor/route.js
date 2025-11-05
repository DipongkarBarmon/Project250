import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import doctor from "@/lib/mongodb/models/doctor"
import { createToken, setDoctorAuthCookie } from "@/lib/mongodb/auth"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { email, password, name, phone, role, ...additionalData } = body

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await doctor.findOne({ email })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with role and additional data
    const userData = {
      email,
      password: hashedPassword,
      name,
      phone,
      role: role || 'patient',
      ...additionalData
    }

    const user = await doctor.create(userData)

    // Create JWT token
    const token = await createToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // Set cookie
    await setDoctorAuthCookie(token)

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
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    )
  }
}

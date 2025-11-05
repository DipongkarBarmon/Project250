import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import Doctor from "@/lib/mongodb/models/doctor"
import { createToken, setDoctorAuthCookie } from "@/lib/mongodb/auth"
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

    // Find doctor
    const doctor = await Doctor.findOne({ email })
    console.log(doctor);
    if (!doctor) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, doctor.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = await createToken({
      id: doctor._id.toString(),
      email: doctor.email,
      name: doctor.name,
      role: doctor.role,
    })

    // Set cookie
    await setDoctorAuthCookie(token)

    return NextResponse.json({
      success: true,
      doctor: {
        id: doctor._id,
        email: doctor.email,
        name: doctor.name,
        role: doctor.role,
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

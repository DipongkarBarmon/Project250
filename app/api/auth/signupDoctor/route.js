import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import doctor from "@/lib/mongodb/models/doctor"
import {sendVerifictionCode} from '@/Middleware/Email.js'
import { createToken, setDoctorAuthCookie } from "@/lib/mongodb/auth"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    await connectDB()
    
    const body = await request.json()
    // Destructure licenseNumber separately to ensure it's not included in additionalData
    const { email, password, name, phone, licenseNumber, ...additionalData } = body

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      )
    }

    // Check if doctor already exists
    const existingUser = await doctor.findOne({ email })
    if (existingUser) {
      if (existingUser.isVarified === true) {
        return NextResponse.json(
          { error: "Doctor with this email already exists."},
          { status: 400 }
        )
      }
      // Reuse unverified doctor account: refresh data & resend code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      existingUser.name = name || existingUser.name
      existingUser.phone = phone || existingUser.phone
      if (licenseNumber) existingUser.licenseNumber = licenseNumber
      // Apply any additional doctor fields provided
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          existingUser[key] = value
        }
      })
      existingUser.verificationCode = verificationCode
      existingUser.password = await bcrypt.hash(password, 10)
      await existingUser.save()
      sendVerifictionCode(existingUser.email, verificationCode)
      const token = await createToken({
        id: existingUser._id.toString(),
        email: existingUser.email,
        name: existingUser.name,
      })
      await setDoctorAuthCookie(token)
      return NextResponse.json({
        success: true,
        reused: true,
        message: "Unverified doctor account reused. New verification code sent.",
        user: {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
        },
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
  const verificationCode = Math.floor(100000+Math.random()*900000).toString();
    // Create user with role and additional data
    const userData = {
      email,
      password: hashedPassword,
      name,
      phone,
  verificationCode,
      // role: role || 'patient',
      ...additionalData
    }

  const user = await doctor.create(userData)
  // send verification email
  sendVerifictionCode(user.email, verificationCode);
    // Create JWT token
    const token = await createToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      // role: user.role,
    })

    // Set cookie
    await setDoctorAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        // role: user.role,
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



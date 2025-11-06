import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import User from "@/lib/mongodb/models/User"
import {sendVerifictionCode} from '@/Middleware/Email.js'
import { createToken, setAuthCookie } from "@/lib/mongodb/auth"
import bcrypt from "bcryptjs"

export async function POST(request) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { email, password, name, phone} = body

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
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
      verificationCode
    }

    const user = await User.create(userData)
    sendVerifictionCode(user.email, verificationCode);
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
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    )
  }
}

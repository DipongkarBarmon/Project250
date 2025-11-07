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
      // If already verified, block duplicate signup
      if (existingUser.isVarified === true) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        )
      }
      // Unverified account reuse path: refresh data & resend code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      // Update mutable fields (only if provided)
      existingUser.name = name || existingUser.name
      existingUser.phone = phone || existingUser.phone
      existingUser.verificationCode = verificationCode
      // Replace password with new hashed one (user is reattempting signup)
      existingUser.password = await bcrypt.hash(password, 10)
      await existingUser.save()
      sendVerifictionCode(existingUser.email, verificationCode)
      const token = await createToken({
        id: existingUser._id.toString(),
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
      })
      await setAuthCookie(token)
      return NextResponse.json({
        success: true,
        reused: true,
        message: "Unverified account reused. New verification code sent.",
        user: {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
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

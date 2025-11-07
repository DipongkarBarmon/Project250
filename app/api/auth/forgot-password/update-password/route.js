import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import User from "@/lib/mongodb/models/User"
import bcrypt from "bcryptjs"
import {successfullyReset} from '@/Middleware/Email.js'

// Simple password update endpoint for user accounts.
// Expects JSON body: { email: string, password: string }
// Returns: { success: true } or error with status code.
// NOTE: This endpoint does NOT perform auth checks. Add JWT / session validation before using in production.

export async function POST(request) {
  try {
    await connectDB()
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }
    // if (password.length < 8) {
    //   return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    // }

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 404 })
    }

    // Hash new password
    const hashed = await bcrypt.hash(password, 10)
    user.password = hashed
    await user.save()
    await successfullyReset(email,user.name)
    return NextResponse.json({ success: true, message: "Password updated" })
  } catch (err) {
    console.error("[user/update-password] error", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

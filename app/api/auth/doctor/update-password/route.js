import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import Doctor from "@/lib/mongodb/models/doctor"
import bcrypt from "bcryptjs"
import {successfullyReset} from '@/Middleware/Email'
// Simple password update endpoint for doctor accounts.
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

    const doctor = await Doctor.findOne({ email })
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    // Hash new password
    const hashed = await bcrypt.hash(password, 10)
    doctor.password = hashed
    await doctor.save()
    await successfullyReset(email,doctor.name);
    return NextResponse.json({ success: true, message: "Password updated" })
  } catch (err) {
    console.error("[doctor/update-password] error", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

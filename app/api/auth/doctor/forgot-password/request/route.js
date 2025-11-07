import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import Doctor from "@/lib/mongodb/models/doctor"
import { sendResetCode } from "@/Middleware/Email.js"

export async function POST(request) {
  try {
    await connectDB()
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const doctor = await Doctor.findOne({ email })
    if (!doctor) return NextResponse.json({ success: true }) // silent

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  doctor.verificationCode = code
  await doctor.save()
//   const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    

//   console.log('[ForgotPassword][Doctor] code:', code, 'expiresAt:', expires.toISOString())
  await sendResetCode(doctor.email, code)

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('doctor forgot-password request error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

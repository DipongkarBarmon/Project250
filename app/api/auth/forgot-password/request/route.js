import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import User from "@/lib/mongodb/models/User"
import { sendResetCode } from "@/Middleware/Email.js"

export async function POST(request) {
  try {
    await connectDB()
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const user = await User.findOne({ email })
    if (!user) return NextResponse.json({ success: true }) // silent

  const code = Math.floor(100000 + Math.random() * 900000).toString()
  user.verificationCode = code
  await user.save()
//   const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    

//   console.log('[ForgotPassword][user] code:', code, 'expiresAt:', expires.toISOString())
  await sendResetCode(user.email, code)

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('user forgot-password request error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

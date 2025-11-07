import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import Doctor from "@/lib/mongodb/models/doctor"
 

export async function POST(request) {
  try {
    await connectDB()
    const {varifyCode, email } = await request.json()
    console.log(varifyCode, email)

    if (!email || !varifyCode) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const doctor = await Doctor.findOne({ email })
    if (!doctor || !doctor.verificationCode) {
      return NextResponse.json({ error: 'Invalid or expired varifyCode' }, { status: 400 })
    }

    if (doctor.verificationCode !== varifyCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }
    doctor.verificationCode = undefined
    return NextResponse.json({success:true,message:"Successfully varified"})
    
  } catch (e) {
    console.error('doctor forgot-password verify error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

 
import Doctor from "@/lib/mongodb/models/doctor"
 
import { sendWelcomeEmail } from "@/Middleware/Email.js";
import { NextResponse } from "next/server";
 



export async function POST(request) {
  try {
    const body = await request.json();
    const { varifyCode, email } = body
    console.log('verify code received:', varifyCode, 'for email:', email)

    if (!email || !varifyCode) {
      return NextResponse.json({ success: false, message: 'Email and verification code are required' }, { status: 400 })
    }

    // Debug: Check what's stored in the database
    // const doctorCheck = await Doctor.findOne({ email: email })
    

    // Find the doctor by BOTH email AND verification code
    const doctor = await Doctor.findOne({
      email: email,
      verificationCode: varifyCode
    })
    
    if (!doctor) {
      return NextResponse.json({ success: false, message: 'Invalid or expired verification code' }, { status: 400 })
    }

    // Mark as verified and clear the code
    doctor.isVarified = true
    doctor.verificationCode = undefined
  
    await doctor.save()
    await sendWelcomeEmail(doctor.email, doctor.name)
    return NextResponse.json({success:true,message:"Email verified successfully"})
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({success:false,message:"Internal server error"}, { status: 500 })
  }
  
}
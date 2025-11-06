 
import User from "@/lib/mongodb/models/User"
 
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
    // const userCheck = await user.findOne({ email: email })
    
    console.log("CHUNU");
    // Find the user by BOTH email AND verification code
    const user = await User.findOne({
      email: email,
      verificationCode: varifyCode
    })
    console.log(user);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid or expired verification code' }, { status: 400 })
    }

    // Mark as verified and clear the code
    user.isVarified = true
    user.verificationCode = undefined
  
    await user.save()


    await sendWelcomeEmail(user.email, user.name)
    return NextResponse.json({success:true,message:"Email verified successfully"})
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({success:false,message:"Internal server error"}, { status: 500 })
  }
  
}
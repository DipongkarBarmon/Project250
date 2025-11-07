 
import Doctor from "@/lib/mongodb/models/doctor"
 
import { sendWelcomeEmail } from "@/Middleware/Email.js";
import { NextResponse } from "next/server";
 



export async function POST(request) {
  try {
    const body = await request.json();
    const varifyCode = body.varifyCode
    console.log('verify code received:', varifyCode)

    // Find the doctor by either `verificationCode` or legacy `varificationCode` (some files use the typo)
    const doctor = await Doctor.findOne(
      { verificationCode: varifyCode })
    if (!doctor) {
      return NextResponse.json({ success: false, message: 'Invalid or expired code' })
    }

  doctor.isVarified = true
  // Clear both possible fields to be safe
  doctor.verificationCode = undefined
  
    await doctor.save()
    console.log(doctor);
    
    await sendWelcomeEmail(doctor.email, doctor.name)
    return NextResponse.json({success:true,message:"Email varified Successfully"})
  } catch (error) {
     return NextResponse.json({success:false,message:"internal server error"})
  }
  
}
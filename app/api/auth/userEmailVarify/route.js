 
import User from "@/lib/mongodb/models/User"
 
import { sendWelcomeEmail } from "@/Middleware/Email";
import { NextResponse } from "next/server";
 



export async function POST(request) {
  try {
    const body=await request.json();
    const varifyCode=body.varifyCode;
    const user=User.find({varificationCode:varifyCode})
    if(!user){
      return NextResponse.json({success:false,message:"Inavlid or Expired Code"})
    }
    user.isVarified=true;
    user.varificationCode=undefined;
    await user.save();
    await sendWelcomeEmail(user.email,user.name);
    return NextResponse.json({success:true,message:"Email varified Successfully"})
  } catch (error) {
     return NextResponse.json({success:false,message:"internal server error"})
  }
}
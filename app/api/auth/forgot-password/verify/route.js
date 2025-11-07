import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import User from "@/lib/mongodb/models/User"
 

export async function POST(request) {
  try {
    await connectDB()
    const {varifyCode, email } = await request.json()
    console.log(varifyCode, email)

    if (!email || !varifyCode) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const user = await User.findOne({ email })
    if (!user || !user.verificationCode) {
      return NextResponse.json({ error: 'Invalid or expired varifyCode' }, { status: 400 })
    }

    if (user.verificationCode !== varifyCode) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }
    user.verificationCode = undefined
    return NextResponse.json({success:true,message:"Successfully varified"})
    
  } catch (e) {
    console.error('user forgot-password verify error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

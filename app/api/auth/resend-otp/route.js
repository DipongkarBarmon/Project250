import { NextResponse } from "next/server"

// Placeholder for resending OTP
// TODO: Implement backend logic
export async function POST(request) {
  try {
    const { email, isDoctor } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // TODO: Backend implementation
    // 1. Find user by email in User or Doctor model
    // 2. Generate new 6-digit OTP
    // 3. Store OTP with expiry time (e.g., 10 minutes)
    // 4. Send OTP via email using nodemailer
    // 5. Return success

    console.log(`TODO: Resend OTP to ${email} (isDoctor: ${isDoctor})`)

    // Temporary success response
    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully" 
    })

  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json({ 
      error: "Failed to send OTP" 
    }, { status: 500 })
  }
}

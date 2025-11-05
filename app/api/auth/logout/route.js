import { NextResponse } from "next/server"
import { removeAuthCookie, removeDoctorAuthCookie } from "@/lib/mongodb/auth"

export async function POST() {
  try {
    // Remove both patient and doctor cookies
    await removeAuthCookie()
    await removeDoctorAuthCookie()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    )
  }
}

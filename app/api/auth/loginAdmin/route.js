import { NextResponse } from "next/server"
import { createToken, setAdminAuthCookie } from "@/lib/mongodb/auth"

// Simple admin login using env variables
// Set ADMIN_EMAIL and ADMIN_PASSWORD in your environment (plain for now)
export async function POST(request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createToken({ role: 'admin', email })
    await setAdminAuthCookie(token)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Admin login error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

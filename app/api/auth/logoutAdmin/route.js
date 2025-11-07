import { NextResponse } from 'next/server'
import { removeAdminAuthCookie } from '@/lib/mongodb/auth'

export async function POST() {
  try {
    await removeAdminAuthCookie()
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Admin logout error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

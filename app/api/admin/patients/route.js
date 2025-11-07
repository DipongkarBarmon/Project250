import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/connection'
import User from '@/lib/mongodb/models/User'
import { getAdminUser } from '@/lib/mongodb/auth'

export async function GET() {
  try {
    const admin = await getAdminUser()
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const users = await User.find({}).select('-password')
    return NextResponse.json({ users })
  } catch (e) {
    console.error('Admin list patients error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

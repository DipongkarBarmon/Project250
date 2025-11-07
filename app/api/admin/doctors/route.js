import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/connection'
import Doctor from '@/lib/mongodb/models/doctor'
import { getAdminUser } from '@/lib/mongodb/auth'

export async function GET() {
  try {
    const admin = await getAdminUser()
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const doctors = await Doctor.find({}).select('-password')
    return NextResponse.json({ doctors })
  } catch (e) {
    console.error('Admin list doctors error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

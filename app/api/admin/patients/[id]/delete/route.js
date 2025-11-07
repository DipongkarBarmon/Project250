import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/connection'
import User from '@/lib/mongodb/models/User'
import { getAdminUser } from '@/lib/mongodb/auth'

export async function DELETE(_req, { params }) {
  try {
    const admin = await getAdminUser()
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const { id } = await params
    const user = await User.findByIdAndDelete(id)
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Delete patient error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

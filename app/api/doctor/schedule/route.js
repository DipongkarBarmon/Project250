import { NextResponse } from 'next/server'
import { getUserDoctor } from '@/lib/mongodb/auth'
import connectDB from '@/lib/mongodb/connection'
import Doctor from '@/lib/mongodb/models/doctor'

export async function PUT(request) {
  try {
    const user = await getUserDoctor()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { schedule } = body

    // Validate schedule format
    if (!Array.isArray(schedule)) {
      return NextResponse.json({ error: 'Invalid schedule format' }, { status: 400 })
    }

    // Validate each schedule entry
    for (const entry of schedule) {
      if (!entry.day || !entry.startTime || !entry.endTime) {
        return NextResponse.json({ error: 'Each schedule entry must have day, startTime, and endTime' }, { status: 400 })
      }
    }

    await connectDB()

    const doctorId = user.id || user.userId
    const updatedUser = await Doctor.findByIdAndUpdate(
      doctorId,
      { schedule },
      { new: true, runValidators: true }
    ).select('-password')

    return NextResponse.json({
      message: 'Schedule updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Schedule update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update schedule' },
      { status: 500 }
    )
  }
}

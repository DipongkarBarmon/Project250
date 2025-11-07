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

    if (user.role !== 'doctor') {
      return NextResponse.json({ error: 'Only doctors can access this endpoint' }, { status: 403 })
    }

    const body = await request.json()
    const {
      specialty,
      additionalDegrees,
      academicPosition,
      departmentHead,
      experience,
      consultationFee,
      licenseNumber,
      qualifications,
    } = body

    await connectDB()

    const updatedUser = await Doctor.findByIdAndUpdate(
      user.id,
      {
        specialty,
        additionalDegrees,
        academicPosition,
        departmentHead,
        experience,
        consultationFee,
        licenseNumber,
        qualifications,
      },
      { new: true, runValidators: true }
    ).select('-password')

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    )
  }
}

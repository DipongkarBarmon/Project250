import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/connection'
import User from '@/lib/mongodb/models/User'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')

    if (!specialty) {
      return NextResponse.json({ error: 'Specialty parameter is required' }, { status: 400 })
    }

    await connectDB()

    // Search for doctors with matching specialty
    const doctors = await User.find({
      role: 'doctor',
      specialty: { $regex: new RegExp(specialty, 'i') } // Case-insensitive search
    }).select('-password')

    return NextResponse.json({
      doctors,
      count: doctors.length
    })
  } catch (error) {
    console.error('Doctor search error:', error)
    return NextResponse.json(
      { error: 'Failed to search doctors' },
      { status: 500 }
    )
  }
}

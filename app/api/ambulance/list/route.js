import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/connection'
import { ServiceProvider } from '@/lib/mongodb/models/Ambulance'

// GET - Fetch all ambulances for patients
export async function GET() {
  try {
    await connectDB()
    
    const serviceProviders = await ServiceProvider.find()
      .populate('ambulances')
      .sort({ name: 1 })

    return NextResponse.json({ serviceProviders })
  } catch (error) {
    console.error('Error fetching ambulances:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ambulances' },
      { status: 500 }
    )
  }
}

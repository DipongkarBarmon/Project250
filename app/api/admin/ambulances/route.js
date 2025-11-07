import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/connection'
import { ServiceProvider, Ambulance } from '@/lib/mongodb/models/Ambulance'
import { verifyAdmin } from '@/lib/mongodb/auth'

// GET - Fetch all service providers with their ambulances
export async function GET(request) {
  try {
    const adminCheck = await verifyAdmin(request)
    if (!adminCheck.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    
    const serviceProviders = await ServiceProvider.find()
      .populate('ambulances')
      .sort({ createdAt: -1 })

    return NextResponse.json({ serviceProviders })
  } catch (error) {
    console.error('Error fetching service providers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service providers' },
      { status: 500 }
    )
  }
}

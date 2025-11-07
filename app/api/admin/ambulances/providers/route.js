import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/connection'
import { ServiceProvider, Ambulance } from '@/lib/mongodb/models/Ambulance'
import { verifyAdmin } from '@/lib/mongodb/auth'

// POST - Create a new service provider
export async function POST(request) {
  try {
    const adminCheck = await verifyAdmin(request)
    if (!adminCheck.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, location, phone } = await request.json()

    if (!name || !location || !phone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const serviceProvider = await ServiceProvider.create({
      name,
      location,
      phone
    })

    return NextResponse.json({ 
      message: 'Service provider created successfully',
      serviceProvider 
    })
  } catch (error) {
    console.error('Error creating service provider:', error)
    return NextResponse.json(
      { error: 'Failed to create service provider' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a service provider and all its ambulances
export async function DELETE(request) {
  try {
    const adminCheck = await verifyAdmin(request)
    if (!adminCheck.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Provider ID is required' }, { status: 400 })
    }

    await connectDB()

    // Delete all ambulances under this provider
    await Ambulance.deleteMany({ serviceProvider: id })

    // Delete the provider
    await ServiceProvider.findByIdAndDelete(id)

    return NextResponse.json({ message: 'Service provider deleted successfully' })
  } catch (error) {
    console.error('Error deleting service provider:', error)
    return NextResponse.json(
      { error: 'Failed to delete service provider' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/connection'
import { Ambulance } from '@/lib/mongodb/models/Ambulance'
import { verifyAdmin } from '@/lib/mongodb/auth'

// POST - Create a new ambulance
export async function POST(request) {
  try {
    const adminCheck = await verifyAdmin(request)
    if (!adminCheck.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ambulanceNumber, driverName, contactNumber, serviceProviderId } = await request.json()

    if (!ambulanceNumber || !driverName || !contactNumber || !serviceProviderId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    await connectDB()

    const ambulance = await Ambulance.create({
      ambulanceNumber,
      driverName,
      contactNumber,
      serviceProvider: serviceProviderId
    })

    return NextResponse.json({ 
      message: 'Ambulance created successfully',
      ambulance 
    })
  } catch (error) {
    console.error('Error creating ambulance:', error)
    return NextResponse.json(
      { error: 'Failed to create ambulance' },
      { status: 500 }
    )
  }
}

// PUT - Update an ambulance
export async function PUT(request) {
  try {
    const adminCheck = await verifyAdmin(request)
    if (!adminCheck.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Ambulance ID is required' }, { status: 400 })
    }

    const { ambulanceNumber, driverName, contactNumber } = await request.json()

    await connectDB()

    const ambulance = await Ambulance.findByIdAndUpdate(
      id,
      {
        ambulanceNumber,
        driverName,
        contactNumber
      },
      { new: true }
    )

    if (!ambulance) {
      return NextResponse.json({ error: 'Ambulance not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Ambulance updated successfully',
      ambulance 
    })
  } catch (error) {
    console.error('Error updating ambulance:', error)
    return NextResponse.json(
      { error: 'Failed to update ambulance' },
      { status: 500 }
    )
  }
}

// DELETE - Delete an ambulance
export async function DELETE(request) {
  try {
    const adminCheck = await verifyAdmin(request)
    if (!adminCheck.isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Ambulance ID is required' }, { status: 400 })
    }

    await connectDB()

    const ambulance = await Ambulance.findByIdAndDelete(id)

    if (!ambulance) {
      return NextResponse.json({ error: 'Ambulance not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Ambulance deleted successfully' })
  } catch (error) {
    console.error('Error deleting ambulance:', error)
    return NextResponse.json(
      { error: 'Failed to delete ambulance' },
      { status: 500 }
    )
  }
}

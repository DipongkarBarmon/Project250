import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import connectDB from '@/lib/mongodb/connection'
import Doctor from '@/lib/mongodb/models/doctor'
import { getUserDoctor } from '@/lib/mongodb/auth'

export async function POST(req) {
  try {
    const doctor = await getUserDoctor()
    if (!doctor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const formData = await req.formData()
    const file = formData.get('profilePicture')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    // Create unique filename
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = path.extname(file.name)
    const doctorId = doctor.id || doctor.userId
    const filename = `doctor-${doctorId}-${Date.now()}${ext}`

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-pictures')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Update doctor profile with new picture URL
    const profilePictureUrl = `/uploads/profile-pictures/${filename}`
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { profilePicture: profilePictureUrl },
      { new: true }
    ).select('-password')

    if (!updatedDoctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      profilePicture: profilePictureUrl,
      doctor: updatedDoctor
    })
  } catch (error) {
    console.error('Profile picture upload error:', error)
    return NextResponse.json({ error: 'Upload failed', message: error.message }, { status: 500 })
  }
}

// GET endpoint to retrieve current profile picture
export async function GET() {
  try {
    const doctor = await getUserDoctor()
    if (!doctor) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const doctorId = doctor.id || doctor.userId
    const doc = await Doctor.findById(doctorId).select('profilePicture')
    
    if (!doc) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    return NextResponse.json({ profilePicture: doc.profilePicture || null })
  } catch (error) {
    console.error('Get profile picture error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

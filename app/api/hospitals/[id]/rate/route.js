import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import Hospital from "@/lib/mongodb/models/Hospital"
import { getUser } from "@/lib/mongodb/auth"

export async function POST(request, { params }) {
  const user = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    
    const { id } = params
    const { rating, comment } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const hospital = await Hospital.findById(id)

    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 })
    }

    // Check if user already rated this hospital
    const existingRatingIndex = hospital.ratings.findIndex(
      r => r.user_id && r.user_id.toString() === user.id
    )

    if (existingRatingIndex !== -1) {
      // Update existing rating
      hospital.ratings[existingRatingIndex] = {
        user_id: user.id,
        rating,
        comment: comment || '',
        createdAt: new Date()
      }
    } else {
      // Add new rating
      hospital.ratings.push({
        user_id: user.id,
        rating,
        comment: comment || '',
      })
    }

    // Recalculate average rating
    hospital.calculateAverageRating()
    await hospital.save()

    return NextResponse.json({ 
      success: true, 
      averageRating: hospital.averageRating,
      totalRatings: hospital.totalRatings 
    })
  } catch (error) {
    console.error('Rating error:', error)
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 })
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB()
    
    const { id } = params

    const hospital = await Hospital.findById(id)
      .populate('ratings.user_id', 'name')
      .lean()

    if (!hospital) {
      return NextResponse.json({ error: "Hospital not found" }, { status: 404 })
    }

    return NextResponse.json({ ratings: hospital.ratings })
  } catch (error) {
    console.error('Get ratings error:', error)
    return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 })
  }
}

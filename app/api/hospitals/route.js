import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import Hospital from "@/lib/mongodb/models/Hospital"
import { getUser } from "@/lib/mongodb/auth"

export async function GET(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat'))
    const lng = parseFloat(searchParams.get('lng'))
    const maxDistance = parseInt(searchParams.get('maxDistance')) || 50000 // Default 50km
    const specialty = searchParams.get('specialty')

    let query = {}

    // If location is provided, find hospitals nearby
    if (!isNaN(lat) && !isNaN(lng)) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: maxDistance // in meters
        }
      }
    }

    // Filter by specialty if provided
    if (specialty) {
      query.specialties = { $in: [specialty] }
    }

    const hospitals = await Hospital.find(query)
      .select('-ratings') // Don't send all individual ratings
      .lean()

    // Calculate distance if user location is provided
    const hospitalsWithDistance = hospitals.map(hospital => {
      if (!isNaN(lat) && !isNaN(lng)) {
        const distance = calculateDistance(
          lat, 
          lng, 
          hospital.location.coordinates[1], 
          hospital.location.coordinates[0]
        )
        return { ...hospital, distance }
      }
      return hospital
    })

    return NextResponse.json({ hospitals: hospitalsWithDistance })
  } catch (error) {
    console.error('Hospitals fetch error:', error)
    return NextResponse.json({ error: "Failed to fetch hospitals" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    
    const body = await request.json()
    const hospital = await Hospital.create(body)

    return NextResponse.json({ success: true, hospital })
  } catch (error) {
    console.error('Hospital creation error:', error)
    return NextResponse.json({ error: "Failed to create hospital" }, { status: 500 })
  }
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c // Distance in kilometers
  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

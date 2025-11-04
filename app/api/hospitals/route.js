import { NextResponse } from "next/server"

const MOCK_HOSPITALS = [
  {
    id: "h1",
    name: "City Medical Center",
    address: "123 Main Street, Downtown",
    phone: "+1-800-123-4567",
    specialties: ["Cardiology", "Neurology", "General Surgery"],
    rating: 4.8,
    beds_available: 45,
  },
  {
    id: "h2",
    name: "Green Valley Hospital",
    address: "456 Oak Avenue, Suburbs",
    phone: "+1-800-234-5678",
    specialties: ["Pediatrics", "OB-GYN", "Orthopedics"],
    rating: 4.6,
    beds_available: 32,
  },
  {
    id: "h3",
    name: "St. Mary's Clinic",
    address: "789 Pine Road, Uptown",
    phone: "+1-800-345-6789",
    specialties: ["Dentistry", "Dermatology", "Physical Therapy"],
    rating: 4.5,
    beds_available: 18,
  },
  {
    id: "h4",
    name: "Heart Care Institute",
    address: "321 Elm Street, Medical District",
    phone: "+1-800-456-7890",
    specialties: ["Cardiology", "Cardiac Surgery", "Arrhythmia Management"],
    rating: 4.9,
    beds_available: 28,
  },
  {
    id: "h5",
    name: "Children's Medical Center",
    address: "654 Birch Lane, East Side",
    phone: "+1-800-567-8901",
    specialties: ["Pediatrics", "Neonatology", "Child Psychology"],
    rating: 4.7,
    beds_available: 35,
  },
]

export async function GET() {
  try {
    return NextResponse.json(MOCK_HOSPITALS)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hospitals" }, { status: 500 })
  }
}

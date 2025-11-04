import { NextResponse } from "next/server"

const MOCK_MEDICINES = [
  {
    id: "m1",
    name: "Aspirin 500mg",
    description: "Pain reliever and anti-inflammatory",
    price: 150,
    stock: 50,
    category: "Pain Relief",
  },
  {
    id: "m2",
    name: "Vitamin C 1000mg",
    description: "Immunity booster supplement",
    price: 200,
    stock: 75,
    category: "Vitamins",
  },
  {
    id: "m3",
    name: "Ibuprofen 400mg",
    description: "Anti-inflammatory medication",
    price: 180,
    stock: 60,
    category: "Pain Relief",
  },
  {
    id: "m4",
    name: "Multivitamin Tablet",
    description: "Complete daily nutrition support",
    price: 250,
    stock: 40,
    category: "Vitamins",
  },
  {
    id: "m5",
    name: "Cough Syrup 100ml",
    description: "For cough and cold relief",
    price: 120,
    stock: 30,
    category: "Cold & Cough",
  },
  {
    id: "m6",
    name: "Antibiotic Cream 50g",
    description: "Topical antibiotic treatment",
    price: 180,
    stock: 25,
    category: "Topical",
  },
  {
    id: "m7",
    name: "Blood Pressure Monitor",
    description: "Digital BP monitoring device",
    price: 1500,
    stock: 10,
    category: "Devices",
  },
  {
    id: "m8",
    name: "Digital Thermometer",
    description: "Fast and accurate temperature reading",
    price: 300,
    stock: 20,
    category: "Devices",
  },
]

export async function GET() {
  try {
    return NextResponse.json(MOCK_MEDICINES)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch medicines" }, { status: 500 })
  }
}

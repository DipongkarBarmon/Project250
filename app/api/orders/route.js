import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb/connection"
import Order from "@/lib/mongodb/models/Order"
import { getUser } from "@/lib/mongodb/auth"

export async function GET() {
  const user = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    
    const orders = await Order.find({ user_id: user.id })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request) {
  const user = await getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    
    const body = await request.json()

    const order = await Order.create({
      user_id: user.id,
      ...body,
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

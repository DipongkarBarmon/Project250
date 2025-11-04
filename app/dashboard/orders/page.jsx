"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        if (!response.ok) throw new Error('Failed to load orders')
        
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>

      {loading ? (
        <p className="text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No orders yet. Start shopping for medicines!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Order ID: {order.id.slice(0, 8)}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">${order.total_amount}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-3">{new Date(order.created_at).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

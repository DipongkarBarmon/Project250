"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const response = await fetch('/api/medicines')
        if (!response.ok) throw new Error('Failed to load medicines')
        
        const data = await response.json()
        setMedicines(data.medicines || [])
      } catch (error) {
        console.error("Error loading medicines:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMedicines()
  }, [])

  const addToCart = (medicine) => {
    const existing = cart.find((item) => item.id === medicine.id)
    if (existing) {
      setCart(cart.map((item) => (item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }])
    }
  }

  const removeFromCart = (medicineId) => {
    setCart(cart.filter((item) => item.id !== medicineId))
  }

  const updateQuantity = (medicineId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicineId)
    } else {
      setCart(cart.map((item) => (item.id === medicineId ? { ...item, quantity } : item)))
    }
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }

    try {
      const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            medicine_id: item.id,
            medicine_name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          total_amount: totalAmount,
          delivery_address: "To be confirmed",
          payment_method: "cash"
        })
      })

      if (!response.ok) throw new Error('Failed to place order')

      setCart([])
      alert("Order placed successfully!")
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Failed to place order")
    }
  }

  const filteredMedicines = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Online Pharmacy</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Cart Items: {cart.length}</p>
          <p className="text-2xl font-bold text-blue-600">${cartTotal.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading medicines...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMedicines.map((medicine) => (
                <Card key={medicine.id} className="p-4 hover:shadow-lg transition">
                  <h3 className="font-bold text-gray-900 mb-1">{medicine.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{medicine.category}</p>
                  {medicine.dosage && <p className="text-xs text-gray-500 mb-2">Dosage: {medicine.dosage}</p>}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{medicine.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">${medicine.price}</p>
                      <p className="text-xs text-gray-600">Stock: {medicine.stock}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => addToCart(medicine)}
                    disabled={medicine.stock === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Add to Cart
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shopping Cart</h3>
              {cart.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="p-3 bg-gray-50 rounded">
                        <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              -
                            </button>
                            <span className="px-3">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 bg-gray-300 rounded"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-3 mb-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-600">Subtotal:</p>
                      <p className="font-semibold text-gray-900">${cartTotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Shipping:</p>
                      <p className="font-semibold text-gray-900">Free</p>
                    </div>
                  </div>

                  <div className="border-t pt-3 mb-4">
                    <div className="flex justify-between">
                      <p className="font-bold text-gray-900">Total:</p>
                      <p className="text-2xl font-bold text-blue-600">${cartTotal.toFixed(2)}</p>
                    </div>
                  </div>

                  <Button onClick={handleCheckout} className="w-full bg-green-600 hover:bg-green-700 mb-2">
                    Checkout
                  </Button>
                  <Button onClick={() => setCart([])} variant="outline" className="w-full">
                    Clear Cart
                  </Button>
                </>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"

export default function DashboardLayout({ children }) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/user')
        if (!response.ok) {
          router.push("/auth/login")
        } else {
          setLoading(false)
        }
      } catch (error) {
        router.push("/auth/login")
      }
    }
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">{children}</main>
    </div>
  )
}

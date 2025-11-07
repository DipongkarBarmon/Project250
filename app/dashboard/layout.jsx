"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import ThemeToggle from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({ children }) {
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
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

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push("/")
    } catch (error) {
      console.error('Logout error:', error)
    }
    setLoggingOut(false)
  }

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
      <main className="ml-64 flex-1 p-8 pt-20 bg-gray-50 dark:bg-gradient-to-br dark:from-[#0a0e1f] dark:via-[#0e1529] dark:to-[#121933] min-h-screen relative">
        {/* Top Right Controls - Theme Toggle & Logout */}
        <div className="fixed top-4 right-4 z-50 flex gap-3 items-center">
          <ThemeToggle />
          <Button 
            onClick={handleLogout} 
            disabled={loggingOut}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
        
        {/* Ambient Background Effects for Dark Mode */}
        <div className="hidden dark:block absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  )
}

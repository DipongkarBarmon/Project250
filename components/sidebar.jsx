"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/dashboard/appointments", label: "Appointments", icon: "📅" },
    { href: "/dashboard/hospitals", label: "Hospitals", icon: "🏥" },
    { href: "/dashboard/medicines", label: "Medicines", icon: "💊" },
    { href: "/dashboard/ambulance", label: "Ambulance", icon: "🚑" },
    { href: "/dashboard/chatbot", label: "Health Advisor", icon: "🤖" },
  ]

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push("/")
    } catch (error) {
      console.error('Logout error:', error)
    }
    setLoading(false)
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold">HealthCare+</h1>
        <p className="text-blue-100 text-sm">Your Health Companion</p>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              aria-current={pathname === item.href ? "page" : undefined}
              className={`px-6 py-3 cursor-pointer transition flex items-center gap-3 rounded-r-lg ${
                pathname === item.href
                  // Active state: solid white background with dark text for contrast
                  ? "bg-white text-blue-700 shadow-sm"
                  // Hover state: subtle white overlay while keeping text white
                  : "hover:bg-white/10"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <Button onClick={handleLogout} disabled={loading} className="w-full bg-red-500 hover:bg-red-600">
          {loading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </aside>
  )
}
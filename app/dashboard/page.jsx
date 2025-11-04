"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    appointments: 0,
    medicines: 0,
    hospitals: 0,
  })
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Fetch user and stats from our MongoDB API
        const [userRes, statsRes] = await Promise.all([
          fetch('/api/auth/user'),
          fetch('/api/dashboard/stats')
        ])

        if (userRes.ok) {
          const userData = await userRes.json()
          setUser(userData.user)
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats({
            appointments: statsData.appointments || 0,
            medicines: statsData.medicines || 0,
            hospitals: statsData.hospitals || 0,
          })
        }
      } catch (error) {
        console.error("Error loading dashboard:", error)
      }
    }

    loadDashboard()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-2">
          {user?.email ? `Logged in as ${user.email}` : "Manage your health in one place"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon="📅" title="Your Appointments" value={stats.appointments} color="blue" />
        <StatCard icon="💊" title="Available Medicines" value={stats.medicines} color="green" />
        <StatCard icon="🏥" title="Partner Hospitals" value={stats.hospitals} color="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <ActionCard
          icon="📅"
          title="Book Appointment"
          description="Schedule an appointment with a doctor"
          href="/dashboard/appointments/book"
          buttonText="Book Now"
        />
        <ActionCard
          icon="🏥"
          title="Find Hospitals"
          description="Browse nearby hospitals and specialties"
          href="/dashboard/hospitals"
          buttonText="Browse"
        />
        <ActionCard
          icon="💊"
          title="Order Medicines"
          description="Order medicines and get them delivered"
          href="/dashboard/medicines"
          buttonText="Shop"
        />
        <ActionCard
          icon="🚑"
          title="Emergency Service"
          description="Request ambulance in case of emergency"
          href="/dashboard/ambulance"
          buttonText="Request"
        />
        <ActionCard
          icon="🤖"
          title="Health Advisor"
          description="Get instant health advice from AI"
          href="/dashboard/chatbot"
          buttonText="Chat"
        />
        <ActionCard
          icon="📋"
          title="My Orders"
          description="View your medicine orders history"
          href="/dashboard/orders"
          buttonText="View"
        />
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: "from-blue-50 border-blue-200",
    green: "from-green-50 border-green-200",
    purple: "from-purple-50 border-purple-200",
  }

  return (
    <Card className={`bg-gradient-to-br ${colors[color]} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-5xl">{icon}</div>
      </div>
    </Card>
  )
}

function ActionCard({ icon, title, description, href, buttonText }) {
  return (
    <Card className="p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link href={href}>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full">{buttonText}</Button>
      </Link>
    </Card>
  )
}

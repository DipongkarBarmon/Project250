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
        <h1 className="text-4xl font-bold text-gray-900 dark:bg-gradient-to-r dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 dark:bg-clip-text dark:text-transparent">Welcome back!</h1>
        <p className="text-gray-600 dark:text-blue-200/70 mt-2">
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
    blue: "from-slate-100/60 via-gray-50/40 to-slate-100/60 border-slate-300/40 backdrop-blur-xl shadow-xl dark:from-blue-600/20 dark:to-blue-800/20 dark:border-blue-500/30 dark:shadow-blue-500/10",
    green: "from-emerald-50/60 via-teal-50/40 to-cyan-50/60 border-emerald-300/40 backdrop-blur-xl shadow-xl dark:from-green-600/20 dark:to-emerald-800/20 dark:border-green-500/30 dark:shadow-green-500/10",
    purple: "from-violet-50/60 via-purple-50/40 to-fuchsia-50/60 border-violet-300/40 backdrop-blur-xl shadow-xl dark:from-purple-600/20 dark:to-pink-800/20 dark:border-purple-500/30 dark:shadow-purple-500/10",
  }

  return (
    <Card className={`bg-gradient-to-br ${colors[color]} p-6 dark:backdrop-blur-sm dark:shadow-lg border hover:shadow-2xl hover:scale-105 transition-all dark:hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-blue-200/70 text-sm font-medium">{title}</p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className="text-5xl opacity-80">{icon}</div>
      </div>
    </Card>
  )
}

function ActionCard({ icon, title, description, href, buttonText }) {
  return (
    <Card className="backdrop-blur-xl bg-white/60 border border-gray-200/60 shadow-xl p-6 hover:shadow-2xl hover:bg-white/70 hover:scale-105 transition-all dark:bg-gradient-to-br dark:from-slate-800/40 dark:to-slate-900/40 dark:backdrop-blur-sm dark:border-slate-700/50 dark:hover:shadow-xl dark:hover:shadow-blue-500/10 dark:hover:scale-105 dark:hover:border-blue-500/30">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-blue-200/70 mb-4">{description}</p>
      <Link href={href}>
        <Button className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white shadow-lg w-full dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 dark:shadow-lg dark:shadow-blue-500/20">
          {buttonText}
        </Button>
      </Link>
    </Card>
  )
}

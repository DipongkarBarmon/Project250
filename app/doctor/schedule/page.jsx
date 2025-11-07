"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function DoctorSchedulePage() {
  const [doctor, setDoctor] = useState(null)
  const [schedule, setSchedule] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const router = useRouter()

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const response = await fetch('/api/auth/userDoctor', {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        
        if (!response.ok) {
          router.push('/auth/doctor/login')
          return
        }
        
        const data = await response.json()
        
        // if (data.user.role !== 'doctor') {
        //   router.push('/auth/doctor/login')
        //   return
        // }
        
        setDoctor(data.user)
        
        // Initialize schedule from existing data
        const initialSchedule = {}
        if (data.user.schedule && Array.isArray(data.user.schedule)) {
          data.user.schedule.forEach(daySchedule => {
            initialSchedule[daySchedule.day] = {
              enabled: true,
              startTime: daySchedule.startTime,
              endTime: daySchedule.endTime,
            }
          })
        }
        
        // Fill in disabled days
        DAYS_OF_WEEK.forEach(day => {
          if (!initialSchedule[day]) {
            initialSchedule[day] = {
              enabled: false,
              startTime: "09:00",
              endTime: "17:00",
            }
          }
        })
        
        setSchedule(initialSchedule)
        setLoading(false)
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/auth/doctor/login')
      }
    }
    
    loadSchedule()
  }, [router])

  const handleDayToggle = (day) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        enabled: !schedule[day].enabled,
      }
    })
  }

  const handleTimeChange = (day, field, value) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: value,
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      // Convert schedule object to array for enabled days only
      const scheduleArray = DAYS_OF_WEEK
        .filter(day => schedule[day].enabled)
        .map(day => ({
          day,
          startTime: schedule[day].startTime,
          endTime: schedule[day].endTime,
        }))

      const response = await fetch('/api/doctor/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule: scheduleArray })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update schedule')
      }

      setMessage({ type: "success", text: "Schedule updated successfully!" })
      
      setTimeout(() => {
        router.push('/doctor/dashboard')
      }, 1500)
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update schedule" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-blue-200/70">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Background with Floating Orbs */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-[#0a0e1f] dark:via-[#0e1529] dark:to-[#121933]">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-300/30 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-300/30 dark:bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-300/20 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Glassmorphic Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Manage Schedule</h1>
            <p className="text-sm text-gray-600 dark:text-blue-200/70">Set your availability for each day</p>
          </div>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
            <Link href="/doctor/dashboard">
              <Button className="backdrop-blur-md bg-white hover:bg-gray-100 border border-gray-300 shadow-lg text-gray-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-white">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <div className="backdrop-blur-xl bg-white/60 dark:bg-gradient-to-br dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-3xl border border-white/40 dark:border-indigo-500/30 dark:shadow-indigo-500/10 shadow-2xl p-6">{" "}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl backdrop-blur-md ${
              message.type === "success" 
                ? "bg-green-100/70 border border-green-400/50 text-green-700 dark:bg-green-900/30 dark:border-green-600/50 dark:text-green-300" 
                : "bg-red-100/70 border border-red-400/50 text-red-700 dark:bg-red-900/30 dark:border-red-600/50 dark:text-red-300"
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day, index) => {
                // Create different gradient colors for each day
                const gradients = [
                  'dark:from-emerald-900/40 dark:via-teal-900/30 dark:to-cyan-900/30 dark:border-emerald-500/30 dark:shadow-emerald-500/20',
                  'dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/30 dark:border-blue-500/30 dark:shadow-blue-500/20',
                  'dark:from-cyan-900/40 dark:via-blue-900/30 dark:to-teal-900/30 dark:border-cyan-500/30 dark:shadow-cyan-500/20',
                  'dark:from-violet-900/40 dark:via-purple-900/30 dark:to-fuchsia-900/30 dark:border-violet-500/30 dark:shadow-violet-500/20',
                  'dark:from-teal-900/40 dark:via-emerald-900/30 dark:to-green-900/30 dark:border-teal-500/30 dark:shadow-teal-500/20',
                  'dark:from-indigo-900/40 dark:via-blue-900/30 dark:to-cyan-900/30 dark:border-indigo-500/30 dark:shadow-indigo-500/20',
                  'dark:from-purple-900/40 dark:via-pink-900/30 dark:to-rose-900/30 dark:border-purple-500/30 dark:shadow-purple-500/20',
                ]
                const gradient = gradients[index % gradients.length]
                
                return (
                  <div key={day} className={`backdrop-blur-md bg-white/50 dark:bg-gradient-to-br ${gradient} border border-white/40 rounded-2xl p-4 hover:shadow-lg transition`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`day-${day}`}
                          checked={schedule[day]?.enabled || false}
                          onChange={() => handleDayToggle(day)}
                          className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor={`day-${day}`} className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent cursor-pointer">
                          {day}
                        </label>
                      </div>
                      {!schedule[day]?.enabled && (
                        <span className="text-sm text-gray-500 dark:text-blue-200/50 italic">Not available</span>
                      )}
                    </div>

                    {schedule[day]?.enabled && (
                      <div className="grid grid-cols-2 gap-4 ml-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-blue-100 mb-1">
                            Start Time
                          </label>
                          <Input
                            type="time"
                            value={schedule[day].startTime}
                            onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                            required
                            className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/60 dark:border-slate-600/50 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-blue-100 mb-1">
                            End Time
                          </label>
                          <Input
                            type="time"
                            value={schedule[day].endTime}
                            onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                            required
                            className="backdrop-blur-sm bg-white/70 dark:bg-slate-800/60 dark:border-slate-600/50 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex gap-4 pt-4 border-t border-white/30 dark:border-slate-600/30">
              <Button 
                type="submit" 
                disabled={saving}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
              >
                {saving ? "Saving..." : "Save Schedule"}
              </Button>
              <Link href="/doctor/dashboard">
                <Button type="button" className="backdrop-blur-md bg-white/70 hover:bg-white/90 border border-white/30 shadow-lg text-gray-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-600 dark:text-white">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"

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
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Schedule</h1>
            <p className="text-sm text-gray-600">Set your availability for each day</p>
          </div>
          <Link href="/doctor/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Card className="p-6">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === "success" 
                ? "bg-green-100 border border-green-400 text-green-700" 
                : "bg-red-100 border border-red-400 text-red-700"
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {DAYS_OF_WEEK.map(day => (
                <div key={day} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`day-${day}`}
                        checked={schedule[day]?.enabled || false}
                        onChange={() => handleDayToggle(day)}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <label htmlFor={`day-${day}`} className="text-lg font-semibold text-gray-900 cursor-pointer">
                        {day}
                      </label>
                    </div>
                    {!schedule[day]?.enabled && (
                      <span className="text-sm text-gray-500 italic">Not available</span>
                    )}
                  </div>

                  {schedule[day]?.enabled && (
                    <div className="grid grid-cols-2 gap-4 ml-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <Input
                          type="time"
                          value={schedule[day].startTime}
                          onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Time
                        </label>
                        <Input
                          type="time"
                          value={schedule[day].endTime}
                          onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button 
                type="submit" 
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? "Saving..." : "Save Schedule"}
              </Button>
              <Link href="/doctor/dashboard">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}

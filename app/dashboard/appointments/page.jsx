"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (!response.ok) throw new Error('Failed to load appointments')
     
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error("Error loading appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (appointmentId) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      })

      if (!response.ok) throw new Error('Failed to cancel appointment')
      loadAppointments()
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      alert("Failed to cancel appointment")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <Link href="/dashboard/appointments/book">
          <Button className="bg-blue-600 hover:bg-blue-700">Book New</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">No appointments scheduled yet</p>
          <Link href="/dashboard/appointments/book">
            <Button className="bg-blue-600 hover:bg-blue-700">Book Your First Appointment</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <Card key={apt._id} className="p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{apt.doctorName}</h3>
                  <p className="text-gray-600">{apt.specialty}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    apt.status === "scheduled"
                      ? "bg-green-100 text-green-800"
                      : apt.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {apt.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-semibold text-gray-900">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Time</p>
                  <p className="font-semibold text-gray-900">{apt.appointmentTime}</p>
                </div>
              </div>
              {apt.reason && (
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Reason</p>
                  <p className="text-gray-900">{apt.reason}</p>
                </div>
              )}
              {apt.status === "scheduled" && (
                <Button
                  onClick={() => handleCancel(apt._id)}
                  variant="outline"
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                >
                  Cancel Appointment
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

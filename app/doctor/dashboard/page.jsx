"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null)
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingAppointments: 0
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadDoctorData = async () => {
    try {
      const response = await fetch('/api/auth/userDoctor', { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (!response.ok) {
        router.push('/auth/doctor/login')
        return
      }
      
      const data = await response.json()
      
      // Check if user is a doctor
      // if (data.user.role !== 'doctor') {
      //   router.push('/auth/doctor/login')
      //   return
      // }
      
      setDoctor(data.user)
      setLoading(false)
    } catch (error) {
      console.error('Auth error:', error)
      router.push('/auth/doctor/login')
    }
  }

  useEffect(() => {
    loadDoctorData()
    
    // Reload data when the page becomes visible (user returns from another page)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadDoctorData()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
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
            <h1 className="text-2xl font-bold text-gray-900">👨‍⚕️ Doctor Portal</h1>
            <p className="text-sm text-gray-600">Welcome, Dr. {doctor?.name}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={loadDoctorData} variant="outline">
              🔄 Refresh
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">Your Profile</h2>
            <Link href="/doctor/profile/edit">
              <Button className="bg-green-600 hover:bg-green-700">Edit Profile</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Basic Info */}
            <div className="md:col-span-2 lg:col-span-3 border-b pb-3 mb-2">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Basic Information</h3>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold">{doctor?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{doctor?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold">{doctor?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">MBBS From</p>
              <p className="font-semibold">{doctor?.mbbsFrom}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Workplace</p>
              <p className="font-semibold">{doctor?.currentWorkplace}</p>
            </div>

            {/* Professional Info */}
            <div className="md:col-span-2 lg:col-span-3 border-b pb-3 mb-2 mt-4">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Professional Information</h3>
            </div>

            <div>
              <p className="text-sm text-gray-600">Specialty</p>
              <p className="font-semibold">{doctor?.specialty || <span className="text-gray-400 italic">Not set</span>}</p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Additional Degrees</p>
              <p className="font-semibold">
                {doctor?.additionalDegrees && doctor.additionalDegrees.length > 0 
                  ? doctor.additionalDegrees.join(', ') 
                  : <span className="text-gray-400 italic">Not set</span>}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Academic Position</p>
              <p className="font-semibold">{doctor?.academicPosition || <span className="text-gray-400 italic">Not set</span>}</p>
            </div>

            {doctor?.departmentHead?.isDepartmentHead ? (
              <>
                <div>
                  <p className="text-sm text-gray-600">Department Head</p>
                  <p className="font-semibold">{doctor.departmentHead.department || <span className="text-gray-400 italic">Not set</span>}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Institution</p>
                  <p className="font-semibold">{doctor.departmentHead.institution || <span className="text-gray-400 italic">Not set</span>}</p>
                </div>
              </>
            ) : (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Department Head</p>
                <p className="font-semibold text-gray-400 italic">Not a department head</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600">Experience</p>
              <p className="font-semibold">
                {doctor?.experience ? `${doctor.experience} years` : <span className="text-gray-400 italic">Not set</span>}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Consultation Fee</p>
              <p className="font-semibold">
                {doctor?.consultationFee ? `BDT ${doctor.consultationFee}` : <span className="text-gray-400 italic">Not set</span>}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">License Number</p>
              <p className="font-semibold">{doctor?.licenseNumber || <span className="text-gray-400 italic">Not set</span>}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Qualifications</p>
              <p className="font-semibold">{doctor?.qualifications || <span className="text-gray-400 italic">Not set</span>}</p>
            </div>

            {/* Show message if profile is incomplete */}
            {(!doctor?.specialty || !doctor?.licenseNumber) && (
              <div className="md:col-span-2 lg:col-span-3 mt-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Your profile is incomplete. Please update your professional information to help patients find you.
                  </p>
                  <Link href="/doctor/profile/edit">
                    <Button className="mt-2 bg-yellow-600 hover:bg-yellow-700">
                      Complete Profile
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-green-600">{stats.todayAppointments}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Appointments</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingAppointments}</p>
              </div>
              <div className="text-4xl">⏰</div>
            </div>
          </Card>
        </div>

        {/* Current Schedule */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">📅 Your Schedule</h2>
            <Link href="/doctor/schedule">
              <Button variant="outline" size="sm">Edit Schedule</Button>
            </Link>
          </div>
          
          {doctor?.schedule && doctor.schedule.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctor.schedule.map((slot, index) => (
                <div key={index} className="border rounded-lg p-4 bg-green-50">
                  <p className="font-semibold text-gray-900">{slot.day}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No schedule set yet</p>
              <Link href="/doctor/schedule">
                <Button className="bg-purple-600 hover:bg-purple-700">Set Your Schedule</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <h3 className="text-xl font-bold mb-2">📋 My Appointments</h3>
            <p className="text-gray-600 mb-4">View and manage patient appointments</p>
            <Button className="bg-green-600 hover:bg-green-700">View Appointments</Button>
          </Card> */}
          
          <Card className="p-6 hover:shadow-lg transition cursor-pointer">
            <h3 className="text-xl font-bold mb-2">👥 Patient Records</h3>
            <p className="text-gray-600 mb-4">Access patient history and records</p>
            <Button className="bg-blue-600 hover:bg-blue-700">View Patients</Button>
          </Card>
          
          {/* <Link href="/doctor/schedule" className="block">
            <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
              <h3 className="text-xl font-bold mb-2">⚙️ Manage Schedule</h3>
              <p className="text-gray-600 mb-4">Set your availability and time slots</p>
              <Button className="bg-purple-600 hover:bg-purple-700">Manage Schedule</Button>
            </Card>
          </Link> */}
          
          <Link href="/doctor/profile/edit" className="block">
            <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
              <h3 className="text-xl font-bold mb-2">✏️ Edit Profile</h3>
              <p className="text-gray-600 mb-4">Update your professional information</p>
              <Button className="bg-gray-600 hover:bg-gray-700">Edit Profile</Button>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}

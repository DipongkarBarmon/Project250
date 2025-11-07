"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"

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
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gradient-to-br dark:from-[#0a0e1f] dark:via-[#0e1529] dark:to-[#121933]">
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
        {/* Animated orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-300/30 dark:bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-300/30 dark:bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-300/20 dark:bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Glassmorphic Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/50 dark:ring-emerald-400/30">
              {doctor?.profilePicture ? (
                <img 
                  src={doctor.profilePicture} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">👨‍⚕️</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Doctor Portal</h1>
              <p className="text-sm text-gray-600 dark:text-blue-200/70">Welcome, Dr. {doctor?.name}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
            <Button onClick={handleLogout} className="backdrop-blur-md bg-white hover:bg-gray-100 border border-gray-300 shadow-lg text-gray-900 hover:text-gray-900 dark:bg-gradient-to-r dark:from-red-600 dark:to-pink-600 dark:hover:from-red-700 dark:hover:to-pink-700 dark:text-white dark:border-red-400/30">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-purple-600 dark:via-blue-600 dark:to-teal-600 rounded-3xl border border-gray-200 dark:border-purple-400/50 shadow-xl dark:shadow-purple-500/50 p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-emerald-600 dark:text-white">Your Profile</h2>
            <Link href="/doctor/profile/edit">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg text-white">Edit Profile</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Basic Info */}
            <div className="md:col-span-2 lg:col-span-3 border-b dark:border-white/20 pb-3 mb-2">
              <h3 className="text-lg font-semibold text-green-700 dark:text-white mb-2">Basic Information</h3>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-white/70">Name</p>
              <p className="font-semibold dark:text-white">{doctor?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-white/70">Email</p>
              <p className="font-semibold dark:text-white">{doctor?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-white/70">Phone</p>
              <p className="font-semibold dark:text-white">{doctor?.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-white/70">MBBS From</p>
              <p className="font-semibold dark:text-white">{doctor?.mbbsFrom}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-white/70">Current Workplace</p>
              <p className="font-semibold dark:text-white">{doctor?.currentWorkplace}</p>
            </div>

            {/* Professional Info */}
            <div className="md:col-span-2 lg:col-span-3 border-b dark:border-white/20 pb-3 mb-2 mt-4">
              <h3 className="text-lg font-semibold text-green-700 dark:text-white mb-2">Professional Information</h3>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-white/70">Specialty</p>
              <p className="font-semibold dark:text-white">{doctor?.specialty || <span className="text-gray-400 dark:text-white/50 italic">Not set</span>}</p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 dark:text-white/70">Additional Degrees</p>
              <p className="font-semibold dark:text-white">
                {doctor?.additionalDegrees && doctor.additionalDegrees.length > 0 
                  ? doctor.additionalDegrees.join(', ') 
                  : <span className="text-gray-400 dark:text-white/50 italic">Not set</span>}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-white/70">Academic Position</p>
              <p className="font-semibold dark:text-white">{doctor?.academicPosition || <span className="text-gray-400 dark:text-white/50 italic">Not set</span>}</p>
            </div>

            {doctor?.departmentHead?.isDepartmentHead ? (
              <>
                <div>
                  <p className="text-sm text-gray-600 dark:text-white/70">Department Head</p>
                  <p className="font-semibold dark:text-white">{doctor.departmentHead.department || <span className="text-gray-400 dark:text-white/50 italic">Not set</span>}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-white/70">Institution</p>
                  <p className="font-semibold dark:text-white">{doctor.departmentHead.institution || <span className="text-gray-400 dark:text-white/50 italic">Not set</span>}</p>
                </div>
              </>
            ) : (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 dark:text-white/70">Department Head</p>
                <p className="font-semibold text-gray-400 dark:text-white/50 italic">Not a department head</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 dark:text-white/70">Experience</p>
              <p className="font-semibold dark:text-white">
                {doctor?.experience ? `${doctor.experience} years` : <span className="text-gray-400 dark:text-white/50 italic">Not set</span>}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-white/70">Consultation Fee</p>
              <p className="font-semibold dark:text-white">
                {doctor?.consultationFee ? `BDT ${doctor.consultationFee}` : <span className="text-gray-400 dark:text-white/50 italic">Not set</span>}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-white/70">License Number</p>
              <p className="font-semibold dark:text-white">{doctor?.licenseNumber || <span className="text-gray-400 dark:text-white/50 italic">Not set</span>}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-white/70">Qualifications</p>
              <p className="font-semibold dark:text-white">{doctor?.qualifications || <span className="text-gray-400 dark:text-white/50 italic">Not set</span>}</p>
            </div>

            {/* Show message if profile is incomplete */}
            {(!doctor?.specialty || !doctor?.licenseNumber) && (
              <div className="md:col-span-2 lg:col-span-3 mt-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-600/50 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ Your profile is incomplete. Please update your professional information to help patients find you.
                  </p>
                  <Link href="/doctor/profile/edit">
                    <Button className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white">
                      Complete Profile
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gradient-to-br dark:from-emerald-600 dark:to-teal-600 rounded-2xl border border-gray-200 dark:border-emerald-400/50 shadow-xl dark:shadow-emerald-500/50 p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-emerald-50">Today's Appointments</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-white">{stats.todayAppointments}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gradient-to-br dark:from-blue-600 dark:to-cyan-600 rounded-2xl border border-gray-200 dark:border-blue-400/50 shadow-xl dark:shadow-blue-500/50 p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-blue-50">Total Patients</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-white">{stats.totalPatients}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gradient-to-br dark:from-purple-600 dark:to-pink-600 rounded-2xl border border-gray-200 dark:border-purple-400/50 shadow-xl dark:shadow-purple-500/50 p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-purple-50">Pending Appointments</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-white">{stats.pendingAppointments}</p>
              </div>
              <div className="text-4xl">⏰</div>
            </div>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-indigo-600 dark:via-purple-600 dark:to-blue-600 rounded-3xl border border-gray-200 dark:border-indigo-400/50 shadow-xl dark:shadow-indigo-500/50 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">📅 Your Schedule</h2>
            <Link href="/doctor/schedule">
              <Button variant="outline" className="dark:bg-white/10 dark:text-white dark:border-white/30 dark:hover:bg-white/20">Edit Schedule</Button>
            </Link>
          </div>
          
          {doctor?.schedule && doctor.schedule.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctor.schedule.map((slot, index) => (
                <div key={index} className="border border-gray-200 dark:border-white/20 rounded-lg p-4 bg-green-50 dark:bg-white/10">
                  <p className="font-semibold text-gray-900 dark:text-white">{slot.day}</p>
                  <p className="text-sm text-gray-600 dark:text-white/80 mt-1">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-white/70">
              <p className="mb-2">No schedule set yet</p>
              <Link href="/doctor/schedule">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Set Your Schedule</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Action Card */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <Link href="/doctor/patients">
            <div className="bg-white dark:bg-gradient-to-br dark:from-cyan-600 dark:via-blue-600 dark:to-teal-600 rounded-3xl border border-gray-200 dark:border-cyan-400/50 shadow-xl dark:shadow-cyan-500/50 p-6 hover:scale-105 transition-transform cursor-pointer">
              <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-white">👥 Patient Appointments</h3>
              <p className="text-gray-600 dark:text-white/80 mb-4">View appointments, patient history, and add notes</p>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg">View Patients</Button>
            </div>
          </Link>
          
          {/* <Link href="/doctor/schedule" className="block">
            <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
              <h3 className="text-xl font-bold mb-2">⚙️ Manage Schedule</h3>
              <p className="text-gray-600 mb-4">Set your availability and time slots</p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Manage Schedule</Button>
            </Card>
          </Link> */}
          
          {/* <Link href="/doctor/profile/edit" className="block">
            <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
              <h3 className="text-xl font-bold mb-2">✏️ Edit Profile</h3>
              <p className="text-gray-600 mb-4">Update your professional information</p>
              <Button className="bg-gray-600 hover:bg-gray-700">Edit Profile</Button>
            </Card>
          </Link> */}
        </div>
      </main>
    </div>
  )
}

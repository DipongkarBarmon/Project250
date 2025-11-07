"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import Link from "next/link"

const SPECIALTIES = [
  "General Medicine",
  "Cardiology",
  "Dentistry",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Neurology",
  "Gynecology",
  "Ophthalmology",
  "Psychiatry",
  "ENT",
  "Urology"
]

const VISIT_REASONS = [
  "New Visit",
  "Routine Check up",
  "Discussing Lab Reports"
]

export default function BookAppointmentPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [bookedSlots, setBookedSlots] = useState([])
  const [fetchingSlots, setFetchingSlots] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const router = useRouter()

  const searchDoctors = async (specialty) => {
    if (!specialty) {
      setDoctors([])
      return
    }

    setSearching(true)
    try {
      const response = await fetch(`/api/doctors/search?specialty=${encodeURIComponent(specialty)}`)
      if (!response.ok) throw new Error('Failed to search doctors')
      
      const data = await response.json()
      setDoctors(data.doctors || [])
    } catch (error) {
      console.error("Error searching doctors:", error)
      setMessage({ type: "error", text: "Failed to search doctors" })
    } finally {
      setSearching(false)
    }
  }

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialty(specialty)
    setSelectedDoctor(null)
    setAppointmentDate("")
    setAppointmentTime("")
    searchDoctors(specialty)
  }

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor)
    setAppointmentDate("")
    setAppointmentTime("")
    setBookedSlots([])
  }

  const fetchBookedSlots = async (doctorId, date) => {
    if (!doctorId || !date) return
    
    setFetchingSlots(true)
    try {
      const response = await fetch(`/api/appointments/booked-slots?doctorId=${doctorId}&date=${date}`)
      if (!response.ok) throw new Error('Failed to fetch booked slots')
      
      const data = await response.json()
      setBookedSlots(data.bookedSlots || [])
    } catch (error) {
      console.error("Error fetching booked slots:", error)
      setBookedSlots([])
    } finally {
      setFetchingSlots(false)
    }
  }

  const handleDateChange = (date) => {
    setAppointmentDate(date)
    setAppointmentTime("")
    if (selectedDoctor && date) {
      fetchBookedSlots(selectedDoctor._id, date)
    }
  }

  const getAvailableTimeSlots = () => {
    if (!selectedDoctor || !appointmentDate) return []
    
    const date = new Date(appointmentDate)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    
    const daySchedule = selectedDoctor.schedule?.find(s => s.day === dayName)
    
    if (!daySchedule) return []
    
    // Generate time slots between start and end time (30 min intervals)
    const slots = []
    const [startHour, startMin] = daySchedule.startTime.split(':').map(Number)
    const [endHour, endMin] = daySchedule.endTime.split(':').map(Number)
    
    let currentHour = startHour
    let currentMin = startMin
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`
      
      // Only include slots that are NOT already booked
      if (!bookedSlots.includes(timeStr)) {
        slots.push(timeStr)
      }
      
      currentMin += 20
      if (currentMin >= 60) {
        currentMin = 0
        currentHour++
      }
    }
    
    return slots
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedDoctor) {
      setMessage({ type: "error", text: "Please select a doctor" })
      return
    }
    
    if (!appointmentDate || !appointmentTime) {
      setMessage({ type: "error", text: "Please select date and time" })
      return
    }

    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          doctorName: selectedDoctor.name,
          specialty: selectedDoctor.specialty,
          appointmentDate,
          appointmentTime,
          reason: reason || "New Visit",
          consultationFee: selectedDoctor.consultationFee || 0,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment')
      }

      setMessage({ type: "success", text: "Appointment booked successfully!" })
      
      setTimeout(() => {
        router.push('/dashboard/appointments')
      }, 2000)
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to book appointment" })
    } finally {
      setLoading(false)
    }
  }

  const availableTimeSlots = getAvailableTimeSlots()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
            <p className="text-gray-600">Find and book a doctor</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === "success" 
              ? "bg-green-100 border border-green-400 text-green-700" 
              : "bg-red-100 border border-red-400 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        {/* Step 1: Select Specialty */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Select Specialty</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {SPECIALTIES.map(specialty => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                onClick={() => handleSpecialtyChange(specialty)}
                className={selectedSpecialty === specialty ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {specialty}
              </Button>
            ))}
          </div>
        </Card>

        {/* Step 2: Select Doctor */}
        {selectedSpecialty && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Select Doctor</h2>
            
            {searching ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Searching for {selectedSpecialty} doctors...</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No doctors found for {selectedSpecialty}</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {doctors.map(doctor => (
                  <div
                    key={doctor._id}
                    onClick={() => handleDoctorSelect(doctor)}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      selectedDoctor?._id === doctor._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {doctor.profilePicture ? (
                          <img 
                            src={doctor.profilePicture} 
                            alt={doctor.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl text-gray-400">👤</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-semibold">MBBS:</span> {doctor.mbbsFrom}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Currently at:</span> {doctor.currentWorkplace}
                        </p>
                        {doctor.experience && (
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Experience:</span> {doctor.experience} years
                          </p>
                        )}
                        {doctor.additionalDegrees && doctor.additionalDegrees.length > 0 && (
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Degrees:</span> {doctor.additionalDegrees.join(', ')}
                          </p>
                        )}
                        {doctor.qualifications && (
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Qualifications:</span> {doctor.qualifications}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-bold text-green-600">
                          BDT {doctor.consultationFee || 50}
                        </p>
                        <p className="text-sm text-gray-500">Consultation Fee</p>
                        {doctor.schedule && doctor.schedule.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 font-semibold">Available:</p>
                            {doctor.schedule.slice(0, 2).map((slot, idx) => (
                              <p key={idx} className="text-xs text-gray-600">
                                {slot.day}: {slot.startTime}-{slot.endTime}
                              </p>
                            ))}
                            {doctor.schedule.length > 2 && (
                              <p className="text-xs text-gray-500">+{doctor.schedule.length - 2} more</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {selectedDoctor?._id === doctor._id && (
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-sm font-semibold text-blue-600">✓ Selected</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Step 3: Select Date and Time */}
        {selectedDoctor && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Select Date & Time</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <Input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="max-w-xs"
                />
              </div>

              {appointmentDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time Slot
                  </label>
                  {fetchingSlots ? (
                    <p className="text-sm text-gray-600">Loading available time slots...</p>
                  ) : availableTimeSlots.length === 0 && bookedSlots.length === 0 ? (
                    <p className="text-sm text-red-600">
                      Doctor is not available on {new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long' })}
                    </p>
                  ) : availableTimeSlots.length === 0 && bookedSlots.length > 0 ? (
                    <p className="text-sm text-red-600">
                      All time slots are booked for this date. Please select a different date.
                    </p>
                  ) : (
                    <>
                      {bookedSlots.length > 0 && (
                        <p className="text-sm text-gray-600 mb-2">
                          {bookedSlots.length} slot{bookedSlots.length > 1 ? 's' : ''} already booked
                        </p>
                      )}
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {availableTimeSlots.map(slot => (
                          <Button
                            key={slot}
                            variant={appointmentTime === slot ? "default" : "outline"}
                            onClick={() => setAppointmentTime(slot)}
                            className={appointmentTime === slot ? "bg-blue-600 hover:bg-blue-700" : ""}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {appointmentTime && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit
                  </label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue placeholder="Select reason for visit" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISIT_REASONS.map((visitReason) => (
                        <SelectItem key={visitReason} value={visitReason}>
                          {visitReason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Submit Button */}
        {selectedDoctor && appointmentDate && appointmentTime && (
          <Card className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Appointment Summary</h3>
                <p className="text-sm text-gray-600">Doctor: {selectedDoctor.name}</p>
                <p className="text-sm text-gray-600">Date: {new Date(appointmentDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Time: {appointmentTime}</p>
                <p className="text-sm font-semibold text-green-600">Fee:BDT{selectedDoctor.consultationFee || 50}</p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 px-8"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AmbulancePage() {
  const [requests, setRequests] = useState([])
  const [serviceProviders, setServiceProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    urgencyLevel: "medium",
    medicalInfo: "",
    latitude: "",
    longitude: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadRequests()
    loadAmbulances()
  }, [])

  const loadAmbulances = async () => {
    try {
      const response = await fetch('/api/ambulance/list')
      if (response.ok) {
        const data = await response.json()
        setServiceProviders(data.serviceProviders || [])
      }
    } catch (error) {
      console.error("Error loading ambulances:", error)
    }
  }

  const loadRequests = async () => {
    try {
      const response = await fetch('/api/ambulance')
      if (!response.ok) throw new Error('Failed to load ambulance requests')
      
      const data = await response.json()
      setRequests(data || [])
    } catch (error) {
      console.error("Error loading ambulance requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        })
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/ambulance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: `${formData.latitude}, ${formData.longitude}`,
          emergency_type: formData.urgencyLevel,
          patient_name: 'User', // You can add a field for this
          phone: '1234567890', // You can add a field for this
        })
      })

      if (!response.ok) throw new Error('Failed to submit ambulance request')

      alert("Ambulance request submitted! ETA will be provided shortly.")
      setShowModal(false)
      setFormData({
        urgencyLevel: "medium",
        medicalInfo: "",
        latitude: "",
        longitude: "",
      })
      loadRequests()
    } catch (error) {
      console.error("Error submitting ambulance request:", error)
      alert("Failed to submit ambulance request")
    } finally {
      setSubmitting(false)
    }
  }

  const urgencyColors = {
    critical: "border-red-300 bg-red-50",
    high: "border-orange-300 bg-orange-50",
    medium: "border-yellow-300 bg-yellow-50",
    low: "border-green-300 bg-green-50",
  }

  const urgencyBadges = {
    critical: "bg-red-100 text-red-800",
    high: "bg-orange-100 text-orange-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🚑 Ambulance Service</h1>
        <Button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white">
          Request Ambulance
        </Button>
      </div>

      {/* Available Ambulances Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Available Ambulances</h2>
        {serviceProviders.length === 0 ? (
          <Card className="backdrop-blur-xl bg-white/60 border border-gray-200/60 shadow-xl p-8 text-center">
            <div className="text-4xl mb-2">🚑</div>
            <p className="text-gray-600">No ambulances available at the moment</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {serviceProviders.map((provider) => (
              <Card key={provider._id} className="backdrop-blur-xl bg-white/60 border border-gray-200/60 shadow-xl p-6">
                <div className="mb-4 border-b pb-3">
                  <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
                  <p className="text-gray-600">📍 {provider.location}</p>
                  <p className="text-gray-600">📞 {provider.phone}</p>
                </div>
                {provider.ambulances && provider.ambulances.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {provider.ambulances.map((ambulance) => (
                      <Card key={ambulance._id} className="bg-gradient-to-br from-slate-100/60 via-gray-50/40 to-slate-100/60 border-slate-300/40 backdrop-blur-xl shadow-lg p-4 hover:shadow-xl hover:scale-105 transition-all">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="text-3xl">🚑</div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500">Vehicle Number</p>
                            <p className="font-bold text-gray-900">{ambulance.ambulanceNumber}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-500">Driver Name</p>
                            <p className="font-semibold text-gray-900">{ambulance.driverName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Contact Number</p>
                            <p className="font-semibold text-gray-900">{ambulance.contactNumber}</p>
                          </div>
                          <Button 
                            className="w-full mt-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                            onClick={() => window.open(`tel:${ambulance.contactNumber}`)}
                          >
                            📞 Call Now
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No ambulances available from this provider</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Ambulance</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Urgency Level</label>
                  <select
                    value={formData.urgencyLevel}
                    onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="low">Low - Non-emergency</option>
                    <option value="medium">Medium - Regular</option>
                    <option value="high">High - Urgent</option>
                    <option value="critical">Critical - Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Medical Information</label>
                  <textarea
                    value={formData.medicalInfo}
                    onChange={(e) => setFormData({ ...formData, medicalInfo: e.target.value })}
                    placeholder="Describe the medical situation"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Location</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`${formData.latitude}, ${formData.longitude}`}
                      readOnly
                      placeholder="Click button to get location"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <Button type="button" onClick={getLocation} variant="outline" className="px-4 bg-transparent">
                      📍
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" onClick={() => setShowModal(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="flex-1 bg-red-600 hover:bg-red-700">
                    {submitting ? "Requesting..." : "Request Now"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* My Requests Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Requests</h2>
        {loading ? (
          <p className="text-gray-600">Loading ambulance requests...</p>
        ) : requests.length === 0 ? (
          <Card className="backdrop-blur-xl bg-white/60 border border-gray-200/60 shadow-xl p-8 text-center">
            <p className="text-gray-600">No ambulance requests yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request._id} className={`backdrop-blur-xl bg-white/60 border border-gray-200/60 shadow-xl p-6 border-2 ${urgencyColors[request.emergency_type]}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">Ambulance Request</h3>
                    <p className="text-gray-600 text-sm">{new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${urgencyBadges[request.emergency_type]}`}
                  >
                    {request.emergency_type ? request.emergency_type.toUpperCase() : 'PENDING'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-semibold text-gray-900 capitalize">{request.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{request.location}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-gray-600 text-sm">Patient</p>
                  <p className="text-gray-900">{request.patient_name} - {request.phone}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

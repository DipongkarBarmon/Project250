"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedHospital, setSelectedHospital] = useState(null)

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const response = await fetch('/api/hospitals')
        if (!response.ok) throw new Error('Failed to load hospitals')
        
        const data = await response.json()
        setHospitals(data.hospitals || [])
      } catch (error) {
        console.error("Error loading hospitals:", error)
      } finally {
        setLoading(false)
      }
    }

    loadHospitals()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Find Hospitals</h1>

      {loading ? (
        <p className="text-gray-600">Loading hospitals...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {hospitals.map((hospital) => (
              <Card
                key={hospital.id}
                className="p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedHospital(hospital)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{hospital.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {hospital.address}, {hospital.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="font-bold text-gray-900">{hospital.rating}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="text-gray-900">{hospital.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {hospital.availability_status}
                    </span>
                  </div>
                </div>

                {hospital.specialties && hospital.specialties.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {hospital.specialties.map((spec, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {selectedHospital && (
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{selectedHospital.name}</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">{selectedHospital.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">City</p>
                    <p className="font-semibold text-gray-900">{selectedHospital.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{selectedHospital.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rating</p>
                    <p className="font-semibold text-gray-900">{selectedHospital.rating}/5</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">Specialties</p>
                    <div className="space-y-1">
                      {selectedHospital.specialties?.map((spec, idx) => (
                        <p key={idx} className="text-gray-900">
                          • {spec}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

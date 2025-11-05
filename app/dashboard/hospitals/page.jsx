"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const SPECIALTIES = [
  "All Specialties",
  "Cardiology",
  "Neurology",
  "General Surgery",
  "Pediatrics",
  "OB-GYN",
  "Orthopedics",
  "Dentistry",
  "Dermatology",
  "Emergency Medicine",
]

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [maxDistance, setMaxDistance] = useState(50)
  const [ratingDialog, setRatingDialog] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submittingRating, setSubmittingRating] = useState(false)

  useEffect(() => {
    getUserLocation()
  }, [])

  useEffect(() => {
    if (userLocation) {
      loadHospitals()
    }
  }, [userLocation, selectedSpecialty, maxDistance])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setLocationError(null)
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocationError("Unable to get your location. Showing all hospitals.")
          loadHospitals() // Load without location
        }
      )
    } else {
      setLocationError("Geolocation is not supported by your browser")
      loadHospitals()
    }
  }

  const loadHospitals = async () => {
    try {
      let url = '/api/hospitals'
      const params = new URLSearchParams()
      
      if (userLocation) {
        params.append('lat', userLocation.lat)
        params.append('lng', userLocation.lng)
        params.append('maxDistance', maxDistance * 1000) // Convert km to meters
      }
      
      if (selectedSpecialty !== "All Specialties") {
        params.append('specialty', selectedSpecialty)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to load hospitals')
      
      const data = await response.json()
      setHospitals(data.hospitals || [])
    } catch (error) {
      console.error("Error loading hospitals:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDirections = (hospital) => {
    if (!userLocation) {
      alert("Location not available")
      return
    }
    
    const destination = `${hospital.location.coordinates[1]},${hospital.location.coordinates[0]}`
    const origin = `${userLocation.lat},${userLocation.lng}`
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
    window.open(url, '_blank')
  }

  const submitRating = async () => {
    if (!rating || rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5")
      return
    }

    setSubmittingRating(true)
    try {
      const response = await fetch(`/api/hospitals/${selectedHospital._id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit rating')
      }

      const data = await response.json()
      
      // Update the hospital in the list
      setHospitals(prev => prev.map(h => 
        h._id === selectedHospital._id 
          ? { ...h, averageRating: data.averageRating, totalRatings: data.totalRatings }
          : h
      ))

      // Update selected hospital
      setSelectedHospital(prev => ({
        ...prev,
        averageRating: data.averageRating,
        totalRatings: data.totalRatings
      }))

      setRatingDialog(false)
      setRating(0)
      setComment("")
      alert("Rating submitted successfully!")
    } catch (error) {
      console.error('Error submitting rating:', error)
      alert(error.message || "Failed to submit rating. Please try again.")
    } finally {
      setSubmittingRating(false)
    }
  }

  const StarRating = ({ value, onChange, readonly = false }) => {
    const stars = [1, 2, 3, 4, 5]
    return (
      <div className="flex gap-1">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onChange && onChange(star)}
            disabled={readonly}
            className={`text-2xl ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition`}
          >
            {star <= value ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Hospitals</h1>
        <p className="text-gray-600 mt-2">
          {userLocation 
            ? `Showing hospitals near your location (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`
            : locationError 
              ? "Unable to get your location. Please enable location services."
              : "Getting your location..."}
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialty
            </label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                {SPECIALTIES.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Distance: {maxDistance} km
            </label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading hospitals...</p>
        </div>
      ) : hospitals.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 text-lg">No hospitals found within {maxDistance}km</p>
          <p className="text-gray-500 text-sm mt-2">Try increasing the maximum distance</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <Card key={hospital._id} className="p-6 hover:shadow-lg transition flex flex-col">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{hospital.name}</h3>
                  {hospital.distance && (
                    <Badge variant="outline" className="ml-2">
                      {hospital.distance.toFixed(1)} km
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3">
                  {hospital.address}, {hospital.city}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <StarRating value={Math.round(hospital.averageRating || 0)} readonly />
                  <span className="text-sm text-gray-600">
                    ({hospital.totalRatings || 0} {hospital.totalRatings === 1 ? 'rating' : 'ratings'})
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="text-gray-900">{hospital.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <Badge variant={hospital.availability_status === 'Available' ? 'default' : 'secondary'}>
                      {hospital.availability_status}
                    </Badge>
                  </div>
                </div>

                {hospital.specialties && hospital.specialties.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {hospital.specialties.slice(0, 3).map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {hospital.specialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{hospital.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => getDirections(hospital)}
                  className="flex-1"
                  disabled={!userLocation}
                >
                  Get Directions
                </Button>
                <Dialog open={ratingDialog && selectedHospital?._id === hospital._id} onOpenChange={(open) => {
                  setRatingDialog(open)
                  if (open) {
                    setSelectedHospital(hospital)
                    setRating(0)
                    setComment("")
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedHospital(hospital)
                        setRatingDialog(true)
                      }}
                    >
                      Rate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rate {hospital.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Rating
                        </label>
                        <StarRating value={rating} onChange={setRating} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comment (Optional)
                        </label>
                        <Textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your experience..."
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={submitRating}
                          disabled={submittingRating || rating === 0}
                          className="flex-1"
                        >
                          {submittingRating ? 'Submitting...' : 'Submit Rating'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setRatingDialog(false)
                            setRating(0)
                            setComment("")
                          }}
                          disabled={submittingRating}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

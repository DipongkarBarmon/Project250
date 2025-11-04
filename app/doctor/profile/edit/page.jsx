"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

export default function DoctorProfileEdit() {
  const [doctor, setDoctor] = useState(null)
  const [formData, setFormData] = useState({
    specialty: "",
    additionalDegrees: "",
    academicPosition: "",
    isDepartmentHead: false,
    department: "",
    institution: "",
    experience: "",
    consultationFee: "",
    licenseNumber: "",
    qualifications: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/auth/userDoctor')
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
        
        // Populate form with existing data
        setFormData({
          specialty: data.user.specialty || "",
          additionalDegrees: data.user.additionalDegrees?.join(', ') || "",
          academicPosition: data.user.academicPosition || "",
          isDepartmentHead: data.user.departmentHead?.isDepartmentHead || false,
          department: data.user.departmentHead?.department || "",
          institution: data.user.departmentHead?.institution || "",
          experience: data.user.experience || "",
          consultationFee: data.user.consultationFee || "",
          licenseNumber: data.user.licenseNumber || "",
          qualifications: data.user.qualifications || "",
        })
        
        setLoading(false)
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/auth/doctor/login')
      }
    }
    
    loadProfile()
  }, [router])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      const response = await fetch('/api/doctor/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specialty: formData.specialty,
          additionalDegrees: formData.additionalDegrees.split(',').map(d => d.trim()).filter(d => d),
          academicPosition: formData.academicPosition,
          departmentHead: {
            isDepartmentHead: formData.isDepartmentHead,
            department: formData.department,
            institution: formData.institution,
          },
          experience: parseInt(formData.experience) || 0,
          consultationFee: parseInt(formData.consultationFee) || 0,
          licenseNumber: formData.licenseNumber,
          qualifications: formData.qualifications,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setMessage({ type: "success", text: "Profile updated successfully!" })
      
      // Redirect to dashboard after 1 second
      setTimeout(() => {
        router.push('/doctor/dashboard')
      }, 1000)
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update profile" })
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-sm text-gray-600">Update your professional information</p>
          </div>
          <Link href="/doctor/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Basic Info (Read-only) */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Basic Information (Cannot be changed)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-semibold">{doctor?.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-semibold">{doctor?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">MBBS From</p>
              <p className="font-semibold">{doctor?.mbbsFrom}</p>
            </div>
            <div>
              <p className="text-gray-600">Current Workplace</p>
              <p className="font-semibold">{doctor?.currentWorkplace}</p>
            </div>
          </div>
        </Card>

        {/* Editable Profile */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Professional Profile</h2>

          {message.text && (
            <div className={`mb-4 p-3 rounded ${
              message.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Specialty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Specialty *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {SPECIALTIES.map(specialty => (
                  <Button
                    key={specialty}
                    type="button"
                    variant={formData.specialty === specialty ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, specialty })}
                    className={formData.specialty === specialty ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {specialty}
                  </Button>
                ))}
              </div>
              {formData.specialty && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: <span className="font-semibold">{formData.specialty}</span>
                </p>
              )}
            </div>

            {/* Additional Degrees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Degrees (comma-separated)
              </label>
              <Input
                name="additionalDegrees"
                value={formData.additionalDegrees}
                onChange={handleChange}
                placeholder="e.g., MD (Cardiology), Fellowship in Interventional Cardiology"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple degrees with commas</p>
            </div>

            {/* Academic Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Position
              </label>
              <select
                name="academicPosition"
                value={formData.academicPosition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select position (if applicable)</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Clinical Instructor">Clinical Instructor</option>
              </select>
            </div>

            {/* Department Head Section */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  name="isDepartmentHead"
                  checked={formData.isDepartmentHead}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-green-600 rounded"
                />
                <label className="text-sm font-medium text-gray-700">
                  I am a Department Head
                </label>
              </div>

              {formData.isDepartmentHead && (
                <div className="space-y-3 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <Input
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Cardiology Department"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <Input
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      placeholder="e.g., Johns Hopkins Medical College"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Experience & Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <Input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g., 10"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consultation Fee ($)
                </label>
                <Input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  placeholder="e.g., 150"
                  min="0"
                />
              </div>
            </div>

            {/* License & Qualifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <Input
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="e.g., MD-12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualifications Summary
                </label>
                <Input
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  placeholder="e.g., MBBS, MD, FACC"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={saving} 
                className="bg-green-600 hover:bg-green-700"
              >
                {saving ? "Saving..." : "Save Profile"}
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

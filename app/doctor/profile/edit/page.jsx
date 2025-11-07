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
  const [profilePicture, setProfilePicture] = useState(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState(null)
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [showUploadControls, setShowUploadControls] = useState(false)
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

        // Set existing profile picture if available
        if (data.user.profilePicture) {
          setProfilePicturePreview(data.user.profilePicture)
        }
        
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

  const handlePictureChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePicture(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePictureUpload = async () => {
    if (!profilePicture) {
      setMessage({ type: "error", text: "Please select an image first" })
      return
    }

    setUploadingPicture(true)
    setMessage({ type: "", text: "" })

    try {
      const formData = new FormData()
      formData.append('profilePicture', profilePicture)

      const response = await fetch('/api/doctor/profile-picture', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload picture')
      }

      setMessage({ type: "success", text: "Profile picture updated successfully!" })
      setProfilePicture(null)
      setShowUploadControls(false)
      
      // Update doctor state with new picture
      setDoctor(prev => ({ ...prev, profilePicture: data.profilePicture }))
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to upload picture" })
    } finally {
      setUploadingPicture(false)
    }
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Background with Floating Orbs */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Glassmorphic Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Edit Profile</h1>
            <p className="text-sm text-gray-600">Update your professional information</p>
          </div>
          <Link href="/doctor/dashboard">
            <Button className="backdrop-blur-md bg-white/70 hover:bg-white/90 border border-white/30 shadow-lg">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Profile Picture Section */}
        <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white/40 shadow-2xl p-6 mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">Profile Picture</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {profilePicturePreview ? (
                  <img 
                    src={profilePicturePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-400">👤</span>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {!showUploadControls ? (
                <Button
                  type="button"
                  onClick={() => setShowUploadControls(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {profilePicturePreview ? 'Change Picture' : 'Upload Picture'}
                </Button>
              ) : (
                <>
                  <Input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePictureChange}
                    className="max-w-md"
                  />
                  <p className="text-xs text-gray-500">
                    Accepted formats: JPEG, PNG, WebP. Max size: 5MB
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handlePictureUpload}
                      disabled={!profilePicture || uploadingPicture}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {uploadingPicture ? "Uploading..." : "Save Picture"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowUploadControls(false)
                        setProfilePicture(null)
                        setProfilePicturePreview(doctor?.profilePicture || null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Basic Info (Read-only) */}
        <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white/40 shadow-2xl p-6 mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">Basic Information (Cannot be changed)</h2>
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
        </div>

        {/* Editable Profile */}
        <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white/40 shadow-2xl p-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">Professional Profile</h2>

          {message.text && (
            <div className={`mb-4 p-3 rounded-xl backdrop-blur-md ${
              message.type === 'success' 
                ? 'bg-green-100/70 border border-green-400/50 text-green-700' 
                : 'bg-red-100/70 border border-red-400/50 text-red-700'
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
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg"
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>
              <Link href="/doctor/dashboard">
                <Button type="button" className="backdrop-blur-md bg-white/70 hover:bg-white/90 border border-white/30 shadow-lg">
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

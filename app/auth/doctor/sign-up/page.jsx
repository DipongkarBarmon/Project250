"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DoctorSignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    mbbsFrom: "",
    currentWorkplace: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/signupDoctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'doctor'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed')
      }

      // Redirect to OTP verification page with email parameter
      router.push(`/auth/doctor/doctor-verify-otp?email=${encodeURIComponent(formData.email)}`)
    } catch (err) {
      setError(err.message || "Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl my-8">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">👨‍⚕️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Register as Doctor</h1>
            <p className="text-gray-600">Join our healthcare platform</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Dr. John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="doctor@hospital.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Where did you complete MBBS? *</label>
                <Input
                  name="mbbsFrom"
                  value={formData.mbbsFrom}
                  onChange={handleChange}
                  placeholder="e.g., Johns Hopkins University School of Medicine"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Full-Time Workplace *</label>
                <Input
                  name="currentWorkplace"
                  value={formData.currentWorkplace}
                  onChange={handleChange}
                  placeholder="e.g., City General Hospital"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 mt-6">
              {loading ? "Creating account..." : "Register as Doctor"}
            </Button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/doctor/login" className="text-green-600 hover:underline font-semibold">
              Sign in
            </Link>
          </p>
          
          <p className="mt-3 text-center text-gray-600">
            Are you a patient?{" "}
            <Link href="/auth/sign-up" className="text-blue-600 hover:underline font-semibold">
              Patient Sign Up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

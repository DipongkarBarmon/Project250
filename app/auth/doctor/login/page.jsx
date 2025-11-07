"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DoctorLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/loginDoctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'doctor' })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Check if user is actually a doctor
      // if (data.user && data.user.role !== 'doctor') {
      //   throw new Error('This account is not registered as a doctor')
      // }

      router.push("/doctor/dashboard")
    } catch (err) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">👨‍⚕️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Login</h1>
            <p className="text-gray-600">Sign in to your doctor account</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <div className="mt-2 text-right">
                <Link href="/auth/doctor/doctorForget" className="text-sm text-green-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/doctor/sign-up" className="text-green-600 hover:underline font-semibold">
              Register as Doctor
            </Link>
          </p>
          
          <p className="mt-3 text-center text-gray-600">
            Are you a patient?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
              Patient Login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

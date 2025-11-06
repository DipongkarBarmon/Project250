"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendingOTP, setResendingOTP] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const isDoctor = searchParams.get("type") === "doctor"

  useEffect(() => {
    if (!email) {
      router.push(isDoctor ? "/auth/doctor/sign-up" : "/auth/sign-up")
    }
  }, [email])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (!/^\d*$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pastedData)) {
      return
    }

    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length - 1, 5)
    document.getElementById(`otp-${lastIndex}`)?.focus()
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const otpCode = otp.join("")

    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: otpCode,
          isDoctor
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Verification failed")
      }

      // Success - redirect to login
      router.push(isDoctor ? "/auth/doctor/login?verified=true" : "/auth/login?verified=true")
    } catch (err) {
      setError(err.message || "Verification failed")
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""])
      document.getElementById("otp-0")?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResendingOTP(true)
    setError("")

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, isDoctor })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend OTP")
      }

      setCountdown(60)
      alert("OTP sent successfully! Check your email.")
    } catch (err) {
      setError(err.message || "Failed to resend OTP")
    } finally {
      setResendingOTP(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600 mb-2">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-semibold text-gray-900">{email}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold"
                    required
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in <span className="font-semibold">{countdown}s</span>
              </p>
            ) : (
              <Button
                variant="outline"
                onClick={handleResendOTP}
                disabled={resendingOTP}
                className="w-full"
              >
                {resendingOTP ? "Sending..." : "Resend OTP"}
              </Button>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push(isDoctor ? "/auth/doctor/sign-up" : "/auth/sign-up")}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Change email address
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

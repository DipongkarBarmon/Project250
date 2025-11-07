"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
 
export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [countdown, setCountdown] = useState(60)
  const [error, setError] = useState("")
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const router = useRouter()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(0, 1)
    if (!/^\d*$/.test(value)) return

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
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)

    const lastIndex = Math.min(pastedData.length - 1, 5)
    document.getElementById(`otp-${lastIndex}`)?.focus()
  }

  
 

  const handleVarify = async (e) => {
     e.preventDefault();
     setError("") // Clear previous errors
     
  const varifyCode = otp.join('')


    try {
      const response = await fetch("/api/auth/doctor/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({varifyCode, email })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP")
      }

      router.push(`/auth/doctor/doctorPasswordUpdate?email=${encodeURIComponent(email)}`) // need to add new password file
    } catch (err) {
      console.log(err);
      setError(err.message || "Invalid or expired code. Please try again.")
    }
  }

  const handleResendOTP = async () => {
    try {
      setCountdown(60)
      // Attempt to call resend endpoint (make sure it exists on your server)
      await fetch('/api/auth/doctor/forgot-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch (err) {
      console.error('Resend OTP failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600 mb-2">We've sent a 6-digit code to</p>
            <p className="font-semibold text-gray-900">{email}</p>
          </div>

          <form onSubmit={handleVarify} className="space-y-6">
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
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-600 text-sm text-center mt-3 font-medium">
                  {error}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Verify Email
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                Resend in <span className="font-semibold">{countdown}s</span>
              </p>
            ) : (
              <Button variant="outline" onClick={handleResendOTP} className="w-full">
                Resend OTP
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

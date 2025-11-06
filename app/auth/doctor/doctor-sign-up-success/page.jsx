"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function doctorSignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-8 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to HealthCare+</h1>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. Check your email to verify your account.
          </p>
          <Link href="/auth/doctor/login">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Go to Login</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

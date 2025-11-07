"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Home() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('/api/auth/user')
        const data = await response.json()
        setUser(data.user)
        
        if (data.user) {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error('Error checking user:', error)
      }
    }
    checkUser()
  }, [])

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600">HealthCare+</h1>
        <div className="space-x-4">
          <Link href="/auth/login">
            <Button variant="ghost">Patient Login</Button>
          </Link>
          <Link href="/auth/doctor/login">
            <Button variant="ghost">Doctor Login</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              Your Complete Health <span className="text-blue-600">Solution</span>
            </h2>
            <p className="text-xl text-gray-600">
              Book appointments, find hospitals, order medicines, request ambulances, and get AI-powered health advice
              all in one place.
            </p>
            <div className="flex gap-4">
              <Link href="/auth/sign-up">
                <Button className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700">Sign Up as Patient</Button>
              </Link>
              <Link href="/auth/doctor/sign-up">
                <Button variant="outline" className="px-8 py-6 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                  Join as Doctor
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="w-full aspect-video bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center text-6xl">
              <div className="animate-pulse">
                <style jsx>{`
                  @keyframes heartbeat {
                    0%, 100% {
                      transform: scale(1);
                    }
                    25% {
                      transform: scale(1.3);
                    }
                    50% {
                      transform: scale(1);
                    }
                  }
                  .heart-beat {
                    animation: heartbeat 1.5s ease-in-out infinite;
                  }
                `}</style>
                <span className="heart-beat inline-block">💚</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Why Choose HealthCare+</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📅"
              title="Easy Appointments"
              description="Book appointments with doctors at your favorite hospitals in seconds"
            />
            <FeatureCard
              icon="🏥"
              title="Find Hospitals"
              description="Locate nearby hospitals with real-time availability and ratings"
            />
            <FeatureCard
              icon="💊"
              title="Order Medicines"
              description="Browse, order, and get medicines delivered to your doorstep"
            />
            <FeatureCard
              icon="🚑"
              title="Emergency Service"
              description="Request ambulance service with just one click"
            />
            <FeatureCard
              icon="🤖"
              title="AI Health Advisor"
              description="Get instant health advice from our intelligent AI chatbot"
            />
            <FeatureCard
              icon="🔒"
              title="Secure & Private"
              description="Your health data is encrypted and kept completely private"
            />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl font-bold text-white">Ready to Take Control of Your Health?</h2>
          <p className="text-xl text-blue-100">Join thousands of users who trust HealthCare+ for their medical needs</p>
          <Link href="/auth/sign-up">
            <Button className="px-8 py-6 text-lg bg-white text-blue-600 hover:bg-gray-100">Sign Up Now</Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2025 HealthCare+. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

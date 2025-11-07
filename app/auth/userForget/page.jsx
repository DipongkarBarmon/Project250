"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function patientForgotPasswordMinimal() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('idle') // idle | sending | sent | error
    const [error, setError] = useState('')
  const router = useRouter()

    const handleSend = async (e) => {
        e.preventDefault()
        if (!email) return
        setStatus('sending'); setError('')
        try {
            console.log("cc")

            const res = await fetch('/api/auth/forgot-password/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
                
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to send code')
            // Either show success UI or redirect directly to reset page
            // setStatus('sent')
            router.push(`/auth/userReset?email=${encodeURIComponent(email)}`)
        } catch (err) {
            setError(err.message)
            setStatus('error')
            
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-teal-200 flex items-center justify-center p-6">
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_60%)]" />
            <Card className="relative w-full max-w-lg overflow-hidden shadow-2xl border border-green-200">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-green-300 to-teal-400 rounded-full blur-3xl opacity-20" />
                <div className="p-8 md:p-10 space-y-8">
                    <header className="space-y-2 text-center">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-700 to-teal-600 bg-clip-text text-transparent">
                            Patient Password Recovery
                        </h1>
                        <p className="text-sm md:text-base text-green-700/70 max-w-md mx-auto">
                            Enter the email associated with your patient account. If it exists, we'll send a 6‑digit verification code to reset your password.
                        </p>
                    </header>

                    <form onSubmit={handleSend} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-green-800 flex items-center gap-2">
                                <span>Email Address</span>
                            </label>
                            <Input
                                type="email"
                                required
                                placeholder="patient@hospital.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/80 backdrop-blur border-green-300 focus:border-teal-500 focus:ring-teal-500 transition shadow-sm"
                            />
                        </div>

                        {error && (
                            <div className="rounded-md border border-red-300 bg-red-50 text-red-700 px-4 py-2 text-sm flex items-start gap-2">
                                <span className="font-semibold">Error:</span>
                                <span className="flex-1">{error}</span>
                            </div>
                        )}

                        {/* {status === 'sent' && (
                            <div className="rounded-md border border-green-300 bg-green-50 text-green-800 px-4 py-3 text-sm animate-fade-in">
                                If that email exists, a verification code was sent. Proceed to
                                <Link href={`/auth/patient/reset-password?email=${encodeURIComponent(email)}`} className="ml-1 underline font-semibold text-teal-700 hover:text-teal-800">
                                    Reset Password
                                </Link>
                            </div>
                        )} */}

                        <Button
                            type="submit"
                            disabled={status === 'sending'}
                            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-lg shadow-green-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {status === 'sending' ? 'Sending Code…' : 'Send Verification Code'}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-green-900/70">
                        <p>
                            Remembered your password?{' '}
                            <Link href="/auth/patient/login" className="font-medium text-teal-700 hover:text-teal-800 underline underline-offset-4">
                                Back to Login
                            </Link>
                        </p>
                        <p className="mt-2">
                            Need patient account recovery?{' '}
                            <Link href="/auth/forgot-password" className="font-medium text-green-700 hover:text-green-800 underline underline-offset-4">
                                Patient Forgot Password
                            </Link>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

/* Tailwind extras: you can add to globals for animation */
// .animate-fade-in { @apply motion-safe:animate-[fadeIn_0.4s_ease-in]; }

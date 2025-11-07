"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'


// NOTE: This page is deprecated. Use /auth/doctor/doctorPasswordreset instead.
export default function DoctorPasswordUpdatePage() {
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [status, setStatus] = useState('idle') // idle | submitting | done | error
    const router = useRouter()
	
	const searchParams = useSearchParams()

	// Pull email from query string if present (?email=...)
	useEffect(() => {
		const paramEmail = searchParams?.get('email')
		if (paramEmail && !email) {
			setEmail(paramEmail)
		}
	}, [searchParams, email])

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')

		if (!email) {
			setError('Email is required')
			return
		}
		if (password !== confirmPassword) {
			setError('Passwords do not match')
			return
		}
		// if (password.length < 8) {
		// 	setError('Password must be at least 8 characters')
		// 	return
		// }

		setStatus('submitting')
		try {
			const res = await fetch('/api/auth/doctor/update-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			})
			const data = await res.json()
			if (!res.ok) throw new Error(data.error || 'Failed to update password')
			setStatus('done')
            router.push("/auth/doctor/login")
		} catch (err) {
			setError(err.message)
			setStatus('error')
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-100 p-6 relative overflow-hidden">
			{/* Decorative gradient orbs */}
			<div className="absolute -top-32 -left-24 w-80 h-80 bg-gradient-to-br from-teal-300 via-emerald-300 to-green-400 rounded-full blur-3xl opacity-25" />
			<div className="absolute -bottom-40 -right-32 w-96 h-96 bg-gradient-to-tr from-green-300 via-teal-200 to-sky-300 rounded-full blur-3xl opacity-25" />

			<Card className="relative w-full max-w-xl border border-teal-200/60 shadow-2xl backdrop-blur bg-white/80 overflow-hidden">
				{/* Inner glow */}
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(45,212,191,0.25),transparent_70%)]" />
				<div className="p-8 md:p-12 space-y-8 relative">
					<header className="space-y-3 text-center">
						<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-700 via-emerald-700 to-green-600 bg-clip-text text-transparent drop-shadow-sm">
							Update Your Password
						</h1>
						<p className="text-sm md:text-base text-teal-800/70 max-w-md mx-auto leading-relaxed">
							Choose a strong password to keep your doctor account secure. Use at least 8 characters with a mix of letters, numbers, and symbols.
						</p>
					</header>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email comes from previous step (doctorReset) via query param */}
						{email ? (
							<div className="rounded-md border border-teal-200 bg-white/70 px-4 py-2 text-sm text-teal-900 flex items-center justify-between">
								<span className="font-semibold">Account</span>
								<span className="truncate max-w-[60%]" title={email}>{email}</span>
							</div>
						) : (
							<div className="rounded-md border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm text-yellow-900">
								Missing email from link. Please return to the previous step and continue from the verification page.
							</div>
						)}
						<div className="space-y-5">
							<div className="group">
								<label className="block text-sm font-semibold text-teal-900 mb-2 tracking-wide">
									New Password
								</label>
								<div className="relative">
									<Input
										type="password"
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="••••••••"
										className="peer pr-12 bg-white/90 focus:bg-white border-teal-300 focus:border-teal-500 focus:ring-teal-500 shadow-sm transition"
									/>
									<div className="absolute inset-y-0 right-3 flex items-center text-xs text-teal-700/60 font-medium">
										{password.length > 0 && (password.length < 8 ? 'Weak' : 'OK')}
									</div>
								</div>
							</div>

							<div className="group">
								<label className="block text-sm font-semibold text-teal-900 mb-2 tracking-wide">
									Confirm Password
								</label>
								<Input
									type="password"
									required
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Repeat password"
									className="bg-white/90 focus:bg-white border-teal-300 focus:border-teal-500 focus:ring-teal-500 shadow-sm transition"
								/>
								{confirmPassword.length > 0 && (
									<p className={`mt-2 text-xs font-medium ${confirmPassword !== password ? 'text-red-600' : 'text-green-600'}`}>
										{confirmPassword !== password ? 'Passwords do not match' : 'Passwords match'}
									</p>
								)}
							</div>
						</div>

						{error && (
							<div className="rounded-md border border-red-300 bg-red-50 text-red-700 px-4 py-3 text-sm flex items-start gap-2">
								<span className="font-semibold">Error:</span>
								<span className="flex-1">{error}</span>
							</div>
						)}

						{status === 'done' && (
							<div className="rounded-md border border-teal-300 bg-teal-50 text-teal-800 px-4 py-3 text-sm animate-fade-in">
								Password updated successfully. You can now{' '}
								<Link href="/auth/doctor/login" className="underline font-semibold hover:text-teal-900">log in</Link> with your new password.
							</div>
						)}

						<Button
							type="submit"
							disabled={status === 'submitting'}
							className="w-full h-12 text-base font-semibold bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 hover:from-teal-500 hover:via-emerald-500 hover:to-green-500 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-lg shadow-teal-600/30 disabled:opacity-60 disabled:cursor-not-allowed transition"
						>
							{status === 'submitting' ? 'Updating…' : 'Update Password'}
						</Button>
					</form>

					<footer className="pt-4 text-center text-xs text-teal-900/60 space-y-1">
						<p className="leading-relaxed">
							Make sure the new password is unique and not reused across other services.
						</p>
						<p>
							Need help? <Link href="/support" className="underline font-medium">Contact Support</Link>
						</p>
					</footer>
				</div>
			</Card>
		</div>
	)
}

// Optional animation helper (add to globals.css if desired):
// @keyframes fadeIn { from { opacity:0; transform:translateY(4px);} to { opacity:1; transform:translateY(0);} }
// .animate-fade-in { animation: fadeIn .35s ease-out; }

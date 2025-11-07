import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/connection'
import Doctor from '@/lib/mongodb/models/doctor'
import { getAdminUser } from '@/lib/mongodb/auth'

const jsonError = (status, error, extra = {}) => NextResponse.json({ error, ...extra }, { status })

export async function POST(_req, { params }) {
  const admin = await getAdminUser()
  if (!admin || admin.role !== 'admin') {
    return jsonError(401, 'Unauthorized')
  }
  await connectDB()
  const resolvedParams = await params
  let { id } = resolvedParams || {}
  // Fallback: derive id from URL path if params is missing (some Next runtimes edge-cases)
  if (!id) {
    try {
      const url = new URL(_req.url)
      const match = url.pathname.match(/\/api\/admin\/doctors\/([0-9a-fA-F]{24})\/approve/)
      if (match) id = match[1]
    } catch {}
  }
  if (!id) return jsonError(400, 'Missing id')
  if (!/^[0-9a-fA-F]{24}$/.test(id)) return jsonError(400, 'Invalid id format', { id })
  try {
    const existing = await Doctor.findById(id).select('-password')
    if (!existing) return jsonError(404, 'Doctor not found (pre-check)', { id })
    if (existing.isApproved) {
      return NextResponse.json({ success: true, doctor: existing, alreadyApproved: true })
    }
    existing.isApproved = true
    await existing.save()
    return NextResponse.json({ success: true, doctor: existing })
  } catch (e) {
    console.error('Approve doctor error', e)
    return jsonError(500, 'Server error', { message: e.message })
  }
}

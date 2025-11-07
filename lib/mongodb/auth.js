import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production')

export async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')

  if (!token) {
    return null
  }

  const payload = await verifyToken(token.value)
  return payload
}

export async function getUserDoctor() {
  const cookieStore = await cookies()
  const token = cookieStore.get('doctor-auth-token')

  if (!token) {
    return null
  }

  const payload = await verifyToken(token.value)
  return payload
}

export async function setAuthCookie(token) {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function setDoctorAuthCookie(token) {
  const cookieStore = await cookies()
  cookieStore.set('doctor-auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

export async function removeDoctorAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('doctor-auth-token')
}

// Admin helpers
// Admin helpers (removed if not needed)
export async function getAdminUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-auth-token')
  if (!token) return null
  const payload = await verifyToken(token.value)
  return payload
}

export async function setAdminAuthCookie(token) {
  const cookieStore = await cookies()
  cookieStore.set('admin-auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function removeAdminAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-auth-token')
}

// Middleware to verify admin authentication
export async function verifyAdmin(request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-auth-token')
  
  if (!token) {
    return { isValid: false, user: null }
  }
  
  const payload = await verifyToken(token.value)
  
  if (!payload || payload.role !== 'admin') {
    return { isValid: false, user: null }
  }
  
  return { isValid: true, user: payload }
}

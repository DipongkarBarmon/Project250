"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState(null) // doctor id currently being approved
  const [error, setError] = useState('')
  const router = useRouter()

  const fetchAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [dRes, pRes] = await Promise.all([
        fetch('/api/admin/doctors'),
        fetch('/api/admin/patients')
      ])
      const dData = await dRes.json()
      const pData = await pRes.json()
      if (dRes.status === 401 || pRes.status === 401) {
        router.replace('/admin/login')
        return
      }
      if (!dRes.ok) throw new Error(dData.error || 'Failed doctors fetch')
      if (!pRes.ok) throw new Error(pData.error || 'Failed patients fetch')
      setDoctors(dData.doctors || [])
      setPatients(pData.users || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const approveDoctor = async (id) => {
    if (!id) {
      alert('Missing doctor id')
      return
    }
    setLoadingAction(id)
    try {
      const safeId = encodeURIComponent(id)
      const res = await fetch(`/api/admin/doctors/${safeId}/approve`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Approve failed')
      setDoctors(prev => prev.map(d => d._id === id ? data.doctor : d))
    } catch (e) {
      console.error('Approve error', e)
      setError(e.message)
      alert('Approve failed: ' + e.message)
    } finally {
      setLoadingAction(null)
    }
  }

  const deleteDoctor = async (id) => {
    if (!confirm('Delete this doctor?')) return
    try {
      const res = await fetch(`/api/admin/doctors/${id}/delete`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      setDoctors(prev => prev.filter(d => d._id !== id))
    } catch (e) { setError(e.message) }
  }

  const deletePatient = async (id) => {
    if (!confirm('Delete this patient?')) return
    try {
      const res = await fetch(`/api/admin/patients/${id}/delete`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      setPatients(prev => prev.filter(p => p._id !== id))
    } catch (e) { setError(e.message) }
  }

  if (loading) return <div className='p-8'>Loading...</div>

  return (
    <div className='min-h-screen bg-slate-50 p-8 space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
        <div className='flex gap-3'>
          <Button
            onClick={() => router.push('/admin/ambulances')}
            className='bg-blue-600 hover:bg-blue-700 text-white'
          >
            🚑 Manage Ambulances
          </Button>
          <Button
            variant='outline'
            onClick={async () => { await fetch('/api/auth/logoutAdmin', { method: 'POST' }); router.replace('/admin/login') }}
          >Logout</Button>
        </div>
      </div>
      {error && <div className='p-3 bg-red-100 text-red-700 rounded'>{error}</div>}

      <Card className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Doctors</h2>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='text-left border-b'>
                <th>Picture</th>
                <th>Name</th>
                <th>Email</th>
                <th>Specialty</th>
                <th>Experience (yrs)</th>
                <th>Consultation Fee</th>
                <th>License #</th>
                <th>Academic Position</th>
                <th>Degrees</th>
                <th>Approved</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(d => (
                <tr key={d._id} className='border-b'>
                  <td className='py-2'>
                    <div className='w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center'>
                      {d.profilePicture ? (
                        <img src={d.profilePicture} alt={d.name} className='w-full h-full object-cover' />
                      ) : (
                        <span className='text-gray-400'>👤</span>
                      )}
                    </div>
                  </td>
                  <td>{d.name}</td>
                  <td>{d.email}</td>
                  <td>{d.specialty || '-'}</td>
                  <td>{d.experience ?? '-'}</td>
                  <td>{d.consultationFee ?? '-'}</td>
                  <td>{d.licenseNumber || '-'}</td>
                  <td>{d.academicPosition || '-'}</td>
                  <td>{Array.isArray(d.additionalDegrees) ? d.additionalDegrees.join(', ') : (d.additionalDegrees || '-')}</td>
                  <td>{d.isApproved ? 'Yes' : 'No'}</td>
                  <td className='space-x-2 whitespace-nowrap'>
                    {!d.isApproved && <Button size='sm' disabled={loadingAction===d._id} onClick={() => approveDoctor(d._id)}>{loadingAction===d._id ? 'Approving...' : 'Approve'}</Button>}
                    <Button size='sm' variant='destructive' onClick={() => deleteDoctor(d._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Patients</h2>
        <table className='w-full text-sm'>
          <thead>
            <tr className='text-left border-b'>
              <th>Name</th><th>Email</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p._id} className='border-b'>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td className='space-x-2'>
                  <Button size='sm' variant='destructive' onClick={() => deletePatient(p._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

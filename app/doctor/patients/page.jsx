"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ThemeToggle from "@/components/theme-toggle"

export default function DoctorPatientsPage() {
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientHistory, setPatientHistory] = useState([])
  const [editingNotes, setEditingNotes] = useState({})
  const [savingNotes, setSavingNotes] = useState({})
  const router = useRouter()

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, searchQuery, statusFilter])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/doctor/appointments')
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/doctor/login')
          return
        }
        throw new Error('Failed to fetch appointments')
      }
      
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(apt => apt.status === statusFilter)
    }

    // Filter by search query (patient name, date, or reason)
    if (searchQuery) {
      filtered = filtered.filter(apt => 
        apt.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.appointmentDate?.includes(searchQuery) ||
        apt.reason?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredAppointments(filtered)
  }

  const viewPatientHistory = (patient, currentAppointment) => {
    setSelectedPatient(patient)
    
    // Get all appointments for this patient
    const history = appointments
      .filter(apt => apt.user_id === currentAppointment.user_id)
      .sort((a, b) => {
        const dateA = new Date(a.appointmentDate + ' ' + a.appointmentTime)
        const dateB = new Date(b.appointmentDate + ' ' + b.appointmentTime)
        return dateB - dateA
      })
    
    setPatientHistory(history)
  }

  const saveNotes = async (appointmentId, notes) => {
    setSavingNotes(prev => ({ ...prev, [appointmentId]: true }))
    
    try {
      const response = await fetch(`/api/doctor/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorNotes: notes })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Save notes error:', data)
        throw new Error(data.error || 'Failed to save notes')
      }

      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt._id === appointmentId ? { ...apt, doctorNotes: notes } : apt
      ))

      setEditingNotes(prev => {
        const updated = { ...prev }
        delete updated[appointmentId]
        return updated
      })

      alert('Notes saved successfully!')
    } catch (error) {
      console.error('Error saving notes:', error)
      alert('Failed to save notes: ' + error.message)
    } finally {
      setSavingNotes(prev => ({ ...prev, [appointmentId]: false }))
    }
  }

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`/api/doctor/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update status')

      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt._id === appointmentId ? { ...apt, status: newStatus } : apt
      ))

      alert('Status updated successfully!')
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-[#0a0e1f] dark:via-[#0e1529] dark:to-[#121933]">
        <p className="dark:text-blue-200/70">Loading appointments...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-[#0a0e1f] dark:via-[#0e1529] dark:to-[#121933] p-6 relative">
      {/* Ambient Background Effects for Dark Mode */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:bg-gradient-to-r dark:from-emerald-400 dark:to-teal-400 dark:bg-clip-text dark:text-transparent">👥 Patient Appointments</h1>
            <p className="text-gray-600 dark:text-blue-200/70">View and manage your patient appointments</p>
          </div>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
            <Link href="/doctor/dashboard">
              <Button variant="outline" className="dark:bg-slate-800 dark:text-white dark:border-slate-600">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6 dark:bg-gradient-to-br dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 dark:border-emerald-500/30 dark:shadow-emerald-500/10">{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-blue-100 mb-2">
                Search Patients
              </label>
              <Input
                placeholder="Search by name, date, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-blue-100 mb-2">
                Filter by Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Appointments</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <Card className="p-8 text-center dark:bg-gradient-to-br dark:from-slate-900/50 dark:to-slate-800/50 dark:border-slate-700/50">
            <p className="text-gray-500 dark:text-blue-200/70">No appointments found</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <Card key={appointment._id} className="p-6 dark:bg-gradient-to-br dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 dark:border-blue-500/30 dark:shadow-blue-500/10">{" "}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                        👤
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {appointment.patient?.name || 'Unknown Patient'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-blue-200/70">
                          {appointment.patient?.email}
                        </p>
                        {appointment.patient?.phone && (
                          <p className="text-sm text-gray-600 dark:text-blue-200/70">
                            📞 {appointment.patient.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-semibold">{formatDate(appointment.appointmentDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="text-sm font-semibold">{appointment.appointmentTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Reason</p>
                        <p className="text-sm font-semibold">{appointment.reason}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fee</p>
                        <p className="text-sm font-semibold">BDT {appointment.consultationFee}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Notes Section */}
                    <div className="mt-4 border-t dark:border-blue-500/20 pt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-blue-100 mb-2">
                        Doctor's Notes
                      </label>
                      {editingNotes[appointment._id] !== undefined ? (
                        <div>
                          <Textarea
                            value={editingNotes[appointment._id]}
                            onChange={(e) => setEditingNotes(prev => ({ 
                              ...prev, 
                              [appointment._id]: e.target.value 
                            }))}
                            placeholder="Add notes about this appointment..."
                            rows={3}
                            className="mb-2 dark:bg-slate-800/60 dark:border-slate-600/50 dark:text-white dark:placeholder-blue-300/50"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => saveNotes(appointment._id, editingNotes[appointment._id])}
                              disabled={savingNotes[appointment._id]}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              {savingNotes[appointment._id] ? 'Saving...' : 'Save Notes'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingNotes(prev => {
                                const updated = { ...prev }
                                delete updated[appointment._id]
                                return updated
                              })}
                              className="dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {appointment.doctorNotes ? (
                            <div className="bg-gray-50 dark:bg-gradient-to-r dark:from-slate-800/60 dark:to-slate-700/60 p-3 rounded border dark:border-slate-600/50 mb-2">
                              <p className="text-sm whitespace-pre-wrap dark:text-blue-100/80">{appointment.doctorNotes}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400 dark:text-blue-300/50 italic mb-2">No notes added yet</p>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNotes(prev => ({ 
                              ...prev, 
                              [appointment._id]: appointment.doctorNotes || '' 
                            }))}
                            className="dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700"
                          >
                            {appointment.doctorNotes ? 'Edit Notes' : 'Add Notes'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:w-48">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700"
                          onClick={() => viewPatientHistory(appointment.patient, appointment)}
                        >
                          View History
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto dark:bg-gradient-to-br dark:from-slate-900/95 dark:via-slate-800/95 dark:to-slate-900/95 dark:border-slate-700/50">
                        <DialogHeader>
                          <DialogTitle className="dark:text-white">Patient Visit History</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <div className="mb-4 p-4 bg-blue-50 dark:bg-gradient-to-r dark:from-blue-900/40 dark:to-indigo-900/40 rounded-lg border dark:border-blue-500/30">
                            <h3 className="font-bold text-lg dark:text-white">{selectedPatient?.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-blue-200/70">{selectedPatient?.email}</p>
                            {selectedPatient?.phone && (
                              <p className="text-sm text-gray-600 dark:text-blue-200/70">📞 {selectedPatient.phone}</p>
                            )}
                            <p className="text-sm text-gray-600 dark:text-blue-200/70 mt-2">
                              Total Visits: {patientHistory.length}
                            </p>
                          </div>

                          <h4 className="font-semibold mb-3 dark:text-white">Previous Appointments</h4>
                          <div className="space-y-3">
                            {patientHistory.map((visit, idx) => (
                              <div key={visit._id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gradient-to-br dark:from-violet-900/30 dark:via-purple-900/30 dark:to-fuchsia-900/30 dark:border-violet-500/30 dark:shadow-violet-500/10">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-semibold dark:text-white">
                                      {formatDate(visit.appointmentDate)} at {visit.appointmentTime}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-blue-200/70">Reason: {visit.reason}</p>
                                  </div>
                                  <Badge className={getStatusColor(visit.status)}>
                                    {visit.status}
                                  </Badge>
                                </div>
                                {visit.doctorNotes && (
                                  <div className="mt-2 p-2 bg-white dark:bg-gradient-to-r dark:from-slate-800/60 dark:to-slate-700/60 rounded border dark:border-slate-600/50">
                                    <p className="text-xs text-gray-500 dark:text-blue-300/70 mb-1">Notes:</p>
                                    <p className="text-sm whitespace-pre-wrap dark:text-blue-100/80">{visit.doctorNotes}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Select 
                      value={appointment.status} 
                      onValueChange={(value) => updateStatus(appointment._id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

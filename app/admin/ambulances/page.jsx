"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export default function AdminAmbulancesPage() {
  const [serviceProviders, setServiceProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false)
  const [isAddAmbulanceOpen, setIsAddAmbulanceOpen] = useState(false)
  const [editingAmbulance, setEditingAmbulance] = useState(null)
  const [selectedProviderId, setSelectedProviderId] = useState(null)
  const router = useRouter()

  const [providerForm, setProviderForm] = useState({
    name: "",
    location: "",
    phone: ""
  })

  const [ambulanceForm, setAmbulanceForm] = useState({
    ambulanceNumber: "",
    driverName: "",
    contactNumber: ""
  })

  useEffect(() => {
    fetchServiceProviders()
  }, [])

  const fetchServiceProviders = async () => {
    try {
      const response = await fetch('/api/admin/ambulances')
      if (response.ok) {
        const data = await response.json()
        setServiceProviders(data.serviceProviders || [])
      }
    } catch (error) {
      console.error('Error fetching service providers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProvider = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/ambulances/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerForm)
      })

      if (response.ok) {
        alert('Service provider added successfully!')
        setProviderForm({ name: "", location: "", phone: "" })
        setIsAddProviderOpen(false)
        fetchServiceProviders()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to add service provider')
      }
    } catch (error) {
      console.error('Error adding provider:', error)
      alert('Failed to add service provider')
    }
  }

  const handleDeleteProvider = async (providerId) => {
    if (!confirm('Are you sure you want to delete this service provider? All ambulances under this provider will be deleted.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/ambulances/providers?id=${providerId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Service provider deleted successfully!')
        fetchServiceProviders()
      } else {
        alert('Failed to delete service provider')
      }
    } catch (error) {
      console.error('Error deleting provider:', error)
      alert('Failed to delete service provider')
    }
  }

  const handleAddAmbulance = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/ambulances/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ambulanceForm,
          serviceProviderId: selectedProviderId
        })
      })

      if (response.ok) {
        alert('Ambulance added successfully!')
        setAmbulanceForm({ ambulanceNumber: "", driverName: "", contactNumber: "" })
        setIsAddAmbulanceOpen(false)
        setSelectedProviderId(null)
        fetchServiceProviders()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to add ambulance')
      }
    } catch (error) {
      console.error('Error adding ambulance:', error)
      alert('Failed to add ambulance')
    }
  }

  const handleUpdateAmbulance = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/admin/ambulances/vehicles?id=${editingAmbulance._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ambulanceForm)
      })

      if (response.ok) {
        alert('Ambulance updated successfully!')
        setAmbulanceForm({ ambulanceNumber: "", driverName: "", contactNumber: "" })
        setEditingAmbulance(null)
        fetchServiceProviders()
      } else {
        alert('Failed to update ambulance')
      }
    } catch (error) {
      console.error('Error updating ambulance:', error)
      alert('Failed to update ambulance')
    }
  }

  const handleDeleteAmbulance = async (ambulanceId) => {
    if (!confirm('Are you sure you want to delete this ambulance?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/ambulances/vehicles?id=${ambulanceId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Ambulance deleted successfully!')
        fetchServiceProviders()
      } else {
        alert('Failed to delete ambulance')
      }
    } catch (error) {
      console.error('Error deleting ambulance:', error)
      alert('Failed to delete ambulance')
    }
  }

  const openEditDialog = (ambulance) => {
    setEditingAmbulance(ambulance)
    setAmbulanceForm({
      ambulanceNumber: ambulance.ambulanceNumber,
      driverName: ambulance.driverName,
      contactNumber: ambulance.contactNumber
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ambulance Management</h1>
          <p className="text-gray-600 mt-2">Manage service providers and ambulances</p>
        </div>
        <Dialog open={isAddProviderOpen} onOpenChange={setIsAddProviderOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              + Add Service Provider
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Service Provider</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProvider} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Provider Name *</label>
                <Input
                  value={providerForm.name}
                  onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })}
                  placeholder="e.g., City Ambulance Services"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location *</label>
                <Input
                  value={providerForm.location}
                  onChange={(e) => setProviderForm({ ...providerForm, location: e.target.value })}
                  placeholder="e.g., Dhaka, Bangladesh"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <Input
                  value={providerForm.phone}
                  onChange={(e) => setProviderForm({ ...providerForm, phone: e.target.value })}
                  placeholder="e.g., +880 1234567890"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Add Provider
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddProviderOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {serviceProviders.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🚑</div>
          <p className="text-gray-600 text-lg">No service providers yet</p>
          <p className="text-gray-500 text-sm mt-2">Click "Add Service Provider" to get started</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {serviceProviders.map((provider) => (
            <Card key={provider._id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{provider.name}</h2>
                  <p className="text-gray-600">📍 {provider.location}</p>
                  <p className="text-gray-600">📞 {provider.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedProviderId(provider._id)
                      setIsAddAmbulanceOpen(true)
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    + Add Ambulance
                  </Button>
                  <Button
                    onClick={() => handleDeleteProvider(provider._id)}
                    variant="destructive"
                  >
                    Delete Provider
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Ambulances ({provider.ambulances?.length || 0})</h3>
                {!provider.ambulances || provider.ambulances.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No ambulances added yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {provider.ambulances.map((ambulance) => (
                      <Card key={ambulance._id} className="p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-3xl">🚑</div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => openEditDialog(ambulance)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDeleteAmbulance(ambulance._id)}
                              variant="destructive"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-500">Ambulance Number</p>
                            <p className="font-semibold">{ambulance.ambulanceNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Driver Name</p>
                            <p className="font-semibold">{ambulance.driverName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Contact Number</p>
                            <p className="font-semibold">{ambulance.contactNumber}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Ambulance Dialog */}
      <Dialog open={isAddAmbulanceOpen} onOpenChange={setIsAddAmbulanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Ambulance</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAmbulance} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ambulance Number *</label>
              <Input
                value={ambulanceForm.ambulanceNumber}
                onChange={(e) => setAmbulanceForm({ ...ambulanceForm, ambulanceNumber: e.target.value })}
                placeholder="e.g., DH-12-3456"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Driver Name *</label>
              <Input
                value={ambulanceForm.driverName}
                onChange={(e) => setAmbulanceForm({ ...ambulanceForm, driverName: e.target.value })}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number *</label>
              <Input
                value={ambulanceForm.contactNumber}
                onChange={(e) => setAmbulanceForm({ ...ambulanceForm, contactNumber: e.target.value })}
                placeholder="e.g., +880 1234567890"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Add Ambulance
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddAmbulanceOpen(false)
                  setAmbulanceForm({ ambulanceNumber: "", driverName: "", contactNumber: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Ambulance Dialog */}
      <Dialog open={!!editingAmbulance} onOpenChange={(open) => !open && setEditingAmbulance(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ambulance</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateAmbulance} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ambulance Number *</label>
              <Input
                value={ambulanceForm.ambulanceNumber}
                onChange={(e) => setAmbulanceForm({ ...ambulanceForm, ambulanceNumber: e.target.value })}
                placeholder="e.g., DH-12-3456"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Driver Name *</label>
              <Input
                value={ambulanceForm.driverName}
                onChange={(e) => setAmbulanceForm({ ...ambulanceForm, driverName: e.target.value })}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Number *</label>
              <Input
                value={ambulanceForm.contactNumber}
                onChange={(e) => setAmbulanceForm({ ...ambulanceForm, contactNumber: e.target.value })}
                placeholder="e.g., +880 1234567890"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Update Ambulance
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingAmbulance(null)
                  setAmbulanceForm({ ambulanceNumber: "", driverName: "", contactNumber: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

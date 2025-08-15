'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Search, Plus, Mail, MessageSquare, Trash2, Edit } from 'lucide-react'
import type { CustomerInquiry } from '@/lib/types'

export function CustomerInquiries() {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/customer-inquiries')
      if (response.ok) {
        const data = await response.json()
        setInquiries(data)
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error)
      toast({
        title: "Error",
        description: "Failed to fetch inquiries",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateInquiryStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/customer-inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        await fetchInquiries()
        toast({
          title: "Success",
          description: "Inquiry status updated"
        })
      }
    } catch (error) {
      console.error('Error updating inquiry:', error)
      toast({
        title: "Error",
        description: "Failed to update inquiry",
        variant: "destructive"
      })
    }
  }

  const filteredInquiries = inquiries.filter(
    inquiry =>
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'responded': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading inquiries...</div>
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold">{inquiry.name}</h3>
                  <Badge className={getStatusColor(inquiry.status)}>
                    {inquiry.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{inquiry.email}</p>
                {inquiry.phone && (
                  <p className="text-sm text-muted-foreground mb-1">{inquiry.phone}</p>
                )}
                <h4 className="font-medium mb-1">{inquiry.subject}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {inquiry.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value={inquiry.status}
                  onValueChange={(status) => updateInquiryStatus(inquiry.id, status)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="responded">Responded</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredInquiries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No inquiries found
          </div>
        )}
      </div>
    </div>
  )
}
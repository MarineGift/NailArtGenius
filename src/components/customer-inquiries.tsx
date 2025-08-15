'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Phone, Eye, CheckCircle, Clock, X } from 'lucide-react'

interface CustomerInquiry {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: string
  createdAt: string
  respondedAt: string | null
}

export function CustomerInquiries() {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [emailModal, setEmailModal] = useState(false)
  const [smsModal, setSmsModal] = useState(false)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/inquiries', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setInquiries(data)
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        fetchInquiries()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const sendEmail = async (inquiry: CustomerInquiry) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to: inquiry.email,
          subject: `Re: ${inquiry.subject}`,
          body: `Dear ${inquiry.name},\n\nThank you for your inquiry. We have received your message and will respond soon.\n\nBest regards,\nKICT Group Admin Team`,
          inquiryId: inquiry.id
        })
      })
      
      if (response.ok) {
        alert('Email sent successfully!')
        fetchInquiries()
        setEmailModal(false)
      }
    } catch (error) {
      console.error('Failed to send email:', error)
      alert('Failed to send email')
    }
  }

  const sendSMS = async (inquiry: CustomerInquiry) => {
    if (!inquiry.phone) {
      alert('No phone number available')
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to: inquiry.phone,
          message: `Hello ${inquiry.name}, thank you for your inquiry. We will respond to your message about "${inquiry.subject}" soon. - KICT Group`,
          inquiryId: inquiry.id
        })
      })
      
      if (response.ok) {
        alert('SMS sent successfully!')
        fetchInquiries()
        setSmsModal(false)
      }
    } catch (error) {
      console.error('Failed to send SMS:', error)
      alert('Failed to send SMS')
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading inquiries...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer Inquiries</h2>
        <p className="text-gray-600">Manage and respond to customer inquiries</p>
      </div>

      <div className="grid gap-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{inquiry.name}</CardTitle>
                  <CardDescription>{inquiry.subject}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    inquiry.status === 'responded' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {inquiry.status}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedInquiry(inquiry)}
                    data-testid={`button-view-${inquiry.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {inquiry.email}
                </div>
                {inquiry.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {inquiry.phone}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedInquiry(inquiry)
                    setEmailModal(true)
                  }}
                  data-testid={`button-email-${inquiry.id}`}
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>
                {inquiry.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedInquiry(inquiry)
                      setSmsModal(true)
                    }}
                    data-testid={`button-sms-${inquiry.id}`}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    SMS
                  </Button>
                )}
                {inquiry.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatus(inquiry.id, 'responded')}
                    data-testid={`button-mark-responded-${inquiry.id}`}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Mark Responded
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedInquiry && !emailModal && !smsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Inquiry Details</CardTitle>
                  <CardDescription>From {selectedInquiry.name}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedInquiry(null)}
                  data-testid="button-close-modal"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Subject</h4>
                  <p className="text-gray-600">{selectedInquiry.subject}</p>
                </div>
                <div>
                  <h4 className="font-medium">Message</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
                <div>
                  <h4 className="font-medium">Contact Information</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Email: {selectedInquiry.email}</div>
                    {selectedInquiry.phone && <div>Phone: {selectedInquiry.phone}</div>}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Inquiry Date</h4>
                  <p className="text-gray-600">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Email Modal */}
      {emailModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Send Email Response</CardTitle>
              <CardDescription>To: {selectedInquiry.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Send a response email to {selectedInquiry.name}?</p>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => sendEmail(selectedInquiry)}
                    data-testid="button-confirm-email"
                  >
                    Send Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEmailModal(false)}
                    data-testid="button-cancel-email"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SMS Modal */}
      {smsModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Send SMS Response</CardTitle>
              <CardDescription>To: {selectedInquiry.phone}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Send an SMS response to {selectedInquiry.name}?</p>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => sendSMS(selectedInquiry)}
                    data-testid="button-confirm-sms"
                  >
                    Send SMS
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSmsModal(false)}
                    data-testid="button-cancel-sms"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
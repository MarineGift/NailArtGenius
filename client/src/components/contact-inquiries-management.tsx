import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getQueryFn, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Phone, 
  User, 
  Calendar,
  RefreshCw,
  Reply,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

interface ContactInquiry {
  id: number;
  fullName: string;
  phoneNumber: string;
  inquiry: string;
  status: 'new' | 'in_progress' | 'resolved';
  adminResponse: string | null;
  createdAt: string;
  respondedAt: string | null;
}

export function ContactInquiriesManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [responseText, setResponseText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { 
    data: inquiries = [], 
    isLoading, 
    error 
  } = useQuery<ContactInquiry[]>({
    queryKey: ['/api/admin/contact-inquiries'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  const updateInquiryMutation = useMutation({
    mutationFn: async ({ id, status, adminResponse }: { id: number; status?: string; adminResponse?: string }) => {
      const response = await apiRequest('PATCH', `/api/admin/contact-inquiries/${id}`, {
        status,
        adminResponse
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-inquiries'] });
      toast({
        title: "Inquiry Updated",
        description: "Contact inquiry has been updated successfully.",
      });
      setSelectedInquiry(null);
      setResponseText('');
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update inquiry.",
        variant: 'destructive',
      });
    }
  });

  const handleStatusChange = (inquiry: ContactInquiry, newStatus: string) => {
    updateInquiryMutation.mutate({
      id: inquiry.id,
      status: newStatus
    });
  };

  const handleResponse = () => {
    if (!selectedInquiry || !responseText.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a response message.",
        variant: 'destructive',
      });
      return;
    }

    updateInquiryMutation.mutate({
      id: selectedInquiry.id,
      status: 'resolved',
      adminResponse: responseText.trim()
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive">New</Badge>;
      case 'in_progress':
        return <Badge variant="default">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="secondary">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <MessageSquare className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredInquiries = inquiries?.filter(inquiry => {
    if (statusFilter === 'all') return true;
    return inquiry.status === statusFilter;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading contact inquiries...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load contact inquiries. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contact US Management</h2>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-inquiries'] })}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Status Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Filter by status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Inquiries</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline">
              {filteredInquiries.length} inquiries
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInquiries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No contact inquiries found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInquiries.map((inquiry) => (
                <div 
                  key={inquiry.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(inquiry.status)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{inquiry.fullName}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{inquiry.phoneNumber}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(inquiry.status)}
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(inquiry.createdAt), 'MMM dd, yyyy HH:mm')}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-700">{inquiry.inquiry}</p>
                      </div>

                      {inquiry.adminResponse && (
                        <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
                          <div className="text-xs text-blue-600 mb-1">Admin Response:</div>
                          <p className="text-sm text-blue-800">{inquiry.adminResponse}</p>
                          {inquiry.respondedAt && (
                            <div className="text-xs text-blue-600 mt-2">
                              Responded on {format(new Date(inquiry.respondedAt), 'MMM dd, yyyy HH:mm')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center space-x-2">
                      <Select 
                        value={inquiry.status} 
                        onValueChange={(value) => handleStatusChange(inquiry, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setResponseText(inquiry.adminResponse || '');
                        }}
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        {inquiry.adminResponse ? 'Edit Response' : 'Respond'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`tel:${inquiry.phoneNumber}`)}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Respond to {selectedInquiry?.fullName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm font-medium text-gray-700 mb-1">Customer Inquiry:</div>
                <p className="text-sm text-gray-600">{selectedInquiry.inquiry}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Your Response:</label>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Enter your response to the customer..."
                  rows={6}
                  className="resize-none"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSelectedInquiry(null)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleResponse}
              disabled={updateInquiryMutation.isPending || !responseText.trim()}
            >
              {updateInquiryMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Reply className="h-4 w-4 mr-2" />
                  Send Response
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
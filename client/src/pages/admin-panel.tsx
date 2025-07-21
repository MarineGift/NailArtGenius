import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/components/header";
import { Users, Package, Calendar as CalendarIcon, BarChart3, Edit, Trash2, Plus, Search, UserCheck, Clock, DollarSign } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { format, parseISO } from "date-fns";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface Appointment {
  id: number;
  userId: string;
  orderId: number;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  notes?: string;
  createdAt: string;
  user?: User;
  order?: {
    id: number;
    totalAmount: string;
    paymentStatus: string;
  };
}

interface Order {
  id: number;
  userId: string;
  totalAmount: string;
  paymentStatus: string;
  printStatus: string;
  createdAt: string;
  user?: User;
}

interface EditAppointmentData {
  appointmentDate: string;
  timeSlot: string;
  status: string;
  notes?: string;
}

interface EditUserData {
  firstName?: string;
  lastName?: string;
  email: string;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  
  // State for dialogs and forms
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form data
  const [appointmentForm, setAppointmentForm] = useState<EditAppointmentData>({
    appointmentDate: "",
    timeSlot: "",
    status: "confirmed",
    notes: ""
  });
  
  const [userForm, setUserForm] = useState<EditUserData>({
    firstName: "",
    lastName: "",
    email: ""
  });

  // Fetch data with error handling
  const { data: appointments = [], isLoading: appointmentsLoading, refetch: refetchAppointments } = useQuery({
    queryKey: ["/api/admin/appointments"],
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: t('common.unauthorized'),
          description: t('common.loginRequired'),
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    }
  });

  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ["/api/admin/orders"],
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: t('common.unauthorized'),
          description: t('common.loginRequired'),
          variant: "destructive",
        });
      }
    }
  });

  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: t('common.unauthorized'),
          description: t('common.loginRequired'),
          variant: "destructive",
        });
      }
    }
  });

  // Mutations for CRUD operations
  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EditAppointmentData }) => {
      return apiRequest(`/api/admin/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: t('admin.success'),
        description: t('admin.appointmentUpdated'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/appointments"] });
      setShowEditDialog(false);
      setEditingAppointment(null);
    },
    onError: (error: Error) => {
      toast({
        title: t('admin.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/appointments/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: t('admin.success'),
        description: t('admin.appointmentDeleted'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/appointments"] });
    },
    onError: (error: Error) => {
      toast({
        title: t('admin.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EditUserData }) => {
      return apiRequest(`/api/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: t('admin.success'),
        description: t('admin.userUpdated'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setShowUserDialog(false);
      setEditingUser(null);
    },
    onError: (error: Error) => {
      toast({
        title: t('admin.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Helper functions
  const openEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setAppointmentForm({
      appointmentDate: appointment.appointmentDate,
      timeSlot: appointment.timeSlot,
      status: appointment.status,
      notes: appointment.notes || ""
    });
    setShowEditDialog(true);
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email
    });
    setShowUserDialog(true);
  };

  const handleUpdateAppointment = () => {
    if (editingAppointment) {
      updateAppointmentMutation.mutate({
        id: editingAppointment.id,
        data: appointmentForm
      });
    }
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser.id,
        data: userForm
      });
    }
  };

  const handleDeleteAppointment = (id: number) => {
    if (confirm(t('admin.confirmDelete'))) {
      deleteAppointmentMutation.mutate(id);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter((user: User) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAppointments = appointments.filter((appointment: Appointment) =>
    appointment.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (appointment.user?.firstName && appointment.user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    appointment.timeSlot.includes(searchTerm)
  );

  // Statistics
  const stats = {
    totalUsers: users.length,
    totalAppointments: appointments.length,
    totalOrders: orders.length,
    todayAppointments: appointments.filter((apt: Appointment) => 
      apt.appointmentDate === new Date().toISOString().split('T')[0]
    ).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.panelTitle')}</h1>
          <p className="text-gray-600 mt-2">{t('admin.subtitle')}</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('admin.totalUsers')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CalendarIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('admin.totalAppointments')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('admin.totalOrders')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('admin.todayAppointments')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">{t('admin.appointmentsTab')}</TabsTrigger>
            <TabsTrigger value="users">{t('admin.usersTab')}</TabsTrigger>
            <TabsTrigger value="orders">{t('admin.ordersTab')}</TabsTrigger>
          </TabsList>

          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('admin.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => {
              refetchAppointments();
              refetchUsers();
              refetchOrders();
            }}>
              {t('admin.refresh')}
            </Button>
          </div>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.appointmentManagement')}</CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="text-center py-8">{t('common.loading')}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('admin.customer')}</TableHead>
                        <TableHead>{t('appointment.date')}</TableHead>
                        <TableHead>{t('appointment.time')}</TableHead>
                        <TableHead>{t('admin.status')}</TableHead>
                        <TableHead>{t('admin.amount')}</TableHead>
                        <TableHead>{t('admin.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appointment: Appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {appointment.user?.firstName} {appointment.user?.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{appointment.user?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{format(parseISO(appointment.appointmentDate), 'yyyy-MM-dd')}</TableCell>
                          <TableCell>{appointment.timeSlot}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>${appointment.order?.totalAmount}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditAppointment(appointment)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteAppointment(appointment.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.userManagement')}</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">{t('common.loading')}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('admin.name')}</TableHead>
                        <TableHead>{t('admin.email')}</TableHead>
                        <TableHead>{t('admin.joinDate')}</TableHead>
                        <TableHead>{t('admin.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user: User) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {user.profileImageUrl ? (
                                <img
                                  src={user.profileImageUrl}
                                  alt={user.firstName || user.email}
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <div className="h-8 w-8 bg-secondary/10 rounded-full flex items-center justify-center">
                                  <UserCheck className="h-4 w-4 text-secondary" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">
                                  {user.firstName} {user.lastName}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{format(parseISO(user.createdAt), 'yyyy-MM-dd')}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.orderManagement')}</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">{t('common.loading')}</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('admin.orderNumber')}</TableHead>
                        <TableHead>{t('admin.customer')}</TableHead>
                        <TableHead>{t('admin.amount')}</TableHead>
                        <TableHead>{t('admin.paymentStatus')}</TableHead>
                        <TableHead>{t('admin.printStatus')}</TableHead>
                        <TableHead>{t('admin.orderDate')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order: Order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {order.user?.firstName} {order.user?.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{order.user?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>${order.totalAmount}</TableCell>
                          <TableCell>
                            <Badge className={order.paymentStatus === 'completed' ? 
                              'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {order.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={order.printStatus === 'completed' ? 
                              'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                              {order.printStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(parseISO(order.createdAt), 'yyyy-MM-dd HH:mm')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Appointment Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('admin.editAppointment')}</DialogTitle>
            <DialogDescription>
              {t('admin.editAppointmentDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointmentDate" className="text-right">
                {t('appointment.date')}
              </Label>
              <Input
                id="appointmentDate"
                type="date"
                value={appointmentForm.appointmentDate}
                onChange={(e) => setAppointmentForm({
                  ...appointmentForm,
                  appointmentDate: e.target.value
                })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="timeSlot" className="text-right">
                {t('appointment.time')}
              </Label>
              <Input
                id="timeSlot"
                value={appointmentForm.timeSlot}
                onChange={(e) => setAppointmentForm({
                  ...appointmentForm,
                  timeSlot: e.target.value
                })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                {t('admin.status')}
              </Label>
              <Select
                value={appointmentForm.status}
                onValueChange={(value) => setAppointmentForm({
                  ...appointmentForm,
                  status: value
                })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                {t('admin.notes')}
              </Label>
              <Textarea
                id="notes"
                value={appointmentForm.notes}
                onChange={(e) => setAppointmentForm({
                  ...appointmentForm,
                  notes: e.target.value
                })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleUpdateAppointment}
              disabled={updateAppointmentMutation.isPending}
            >
              {updateAppointmentMutation.isPending ? t('common.loading') : t('admin.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('admin.editUser')}</DialogTitle>
            <DialogDescription>
              {t('admin.editUserDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                {t('admin.firstName')}
              </Label>
              <Input
                id="firstName"
                value={userForm.firstName}
                onChange={(e) => setUserForm({
                  ...userForm,
                  firstName: e.target.value
                })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                {t('admin.lastName')}
              </Label>
              <Input
                id="lastName"
                value={userForm.lastName}
                onChange={(e) => setUserForm({
                  ...userForm,
                  lastName: e.target.value
                })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t('admin.email')}
              </Label>
              <Input
                id="email"
                value={userForm.email}
                onChange={(e) => setUserForm({
                  ...userForm,
                  email: e.target.value
                })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleUpdateUser}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? t('common.loading') : t('admin.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
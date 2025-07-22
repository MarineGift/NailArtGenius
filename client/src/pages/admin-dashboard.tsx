import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Filter,
  Download,
  Edit,
  Trash2,
  UserCheck
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useLocation } from "wouter";
import Header from "@/components/header";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [viewType, setViewType] = useState("day");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("appointments");

  // Fetch appointments based on period and filters
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["/api/appointments", viewType, selectedDate, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams({
        period: viewType,
        date: selectedDate,
        view: activeTab,
      });
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }
      const response = await fetch(`/api/appointments?${params}`);
      return response.json();
    },
  });

  // Update appointment status mutation
  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      return await apiRequest(`/api/admin/appointments/${id}`, "PUT", updates);
    },
    onSuccess: () => {
      toast({
        title: "업데이트 완료",
        description: "예약 상태가 업데이트되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: (error: any) => {
      toast({
        title: "업데이트 실패",
        description: error.message || "상태 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  // Delete appointment mutation
  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/appointments/${id}`, "DELETE");
    },
    onSuccess: () => {
      toast({
        title: "삭제 완료",
        description: "예약이 삭제되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: (error: any) => {
      toast({
        title: "삭제 실패",
        description: error.message || "예약 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (appointmentId: number, newStatus: string) => {
    updateAppointmentMutation.mutate({
      id: appointmentId,
      updates: { status: newStatus },
    });
  };

  const handleDeleteAppointment = (appointmentId: number) => {
    if (confirm("이 예약을 삭제하시겠습니까?")) {
      deleteAppointmentMutation.mutate(appointmentId);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "no_show":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "예약됨";
      case "completed":
        return "완료";
      case "cancelled":
        return "취소";
      case "no_show":
        return "노쇼";
      default:
        return status;
    }
  };

  const getVisitTypeText = (visitType: string) => {
    switch (visitType) {
      case "방문예약":
        return "방문예약";
      case "최초방문":
        return "최초방문";
      case "인터넷예약":
        return "인터넷예약";
      default:
        return visitType;
    }
  };

  const exportToCSV = () => {
    if (appointments.length === 0) {
      toast({
        title: "내보내기 실패",
        description: "내보낼 데이터가 없습니다.",
        variant: "destructive",
      });
      return;
    }

    const csvHeader = "날짜,시간,고객명,전화번호,이메일,방문유형,상태\n";
    const csvData = appointments
      .map((apt: any) => {
        const date = format(new Date(apt.appointmentDate), "yyyy-MM-dd", { locale: ko });
        return [
          date,
          apt.timeSlot,
          apt.customerName,
          apt.customerPhone,
          apt.customerEmail || "",
          getVisitTypeText(apt.visitType),
          getStatusText(apt.status),
        ].join(",");
      })
      .join("\n");

    const csvContent = csvHeader + csvData;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `appointments_${selectedDate}_${viewType}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-gray-600">예약 및 방문자 관리</p>
          </div>
          <Button onClick={exportToCSV} variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            CSV 내보내기
          </Button>
        </div>

        {/* Filter Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              필터 및 검색
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">날짜</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="view-type">조회 기간</Label>
                <Select value={viewType} onValueChange={setViewType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">일별</SelectItem>
                    <SelectItem value="week">주별</SelectItem>
                    <SelectItem value="month">월별</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status-filter">상태 필터</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="scheduled">예약됨</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                    <SelectItem value="cancelled">취소</SelectItem>
                    <SelectItem value="no_show">노쇼</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/appointments"] })}>
                  새로고침
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                방문 예약 목록
                {appointments.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    총 {appointments.length}건
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-gray-500">로딩 중...</div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-2">선택한 기간에 예약이 없습니다.</div>
                <Button variant="outline" onClick={() => setLocation("/appointment-booking")}>
                  새 예약 생성
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Date and Time */}
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">
                              {format(new Date(appointment.appointmentDate), "M월 d일 (eee)", { locale: ko })}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.timeSlot}
                            </div>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{appointment.customerName}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{appointment.customerPhone}</span>
                          </div>
                          {appointment.customerEmail && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              <span>{appointment.customerEmail}</span>
                            </div>
                          )}
                        </div>

                        {/* Visit Type */}
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 text-gray-400 mr-2" />
                          <Badge variant="outline">
                            {getVisitTypeText(appointment.visitType)}
                          </Badge>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between">
                          <Badge variant={getStatusBadgeVariant(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {appointment.status === "scheduled" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(appointment.id, "completed")}
                            >
                              완료
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(appointment.id, "no_show")}
                            >
                              노쇼
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-3 pt-3 border-t text-sm text-gray-600">
                        <strong>메모:</strong> {appointment.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
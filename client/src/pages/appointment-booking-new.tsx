import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Calendar as CalendarIcon, Clock, User, Phone, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { format, isAfter, startOfToday } from "date-fns";
import { ko } from "date-fns/locale";
import Header from "@/components/header";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form validation schema
const appointmentFormSchema = z.object({
  firstName: z.string().min(1, "성을 입력해 주세요"),
  lastName: z.string().min(1, "이름을 입력해 주세요"),
  phoneNumber: z.string().min(10, "전화번호를 입력해 주세요"),
  email: z.string().email("올바른 이메일을 입력해 주세요").optional().or(z.literal("")),
  visitType: z.enum(["방문예약", "최초방문", "인터넷예약"]),
  visitReason: z.string().min(1, "방문 사유를 입력해 주세요"),
  mailingList: z.boolean().default(false),
});

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

export default function AppointmentBooking() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Customer Info, 3: Confirmation

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      visitType: "방문예약",
      visitReason: "",
      mailingList: false,
    },
  });

  // Auto-fill form when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      form.setValue("firstName", user.firstName || "");
      form.setValue("lastName", user.lastName || "");
      form.setValue("phoneNumber", user.phoneNumber || "");
      form.setValue("email", user.email || "");
    }
  }, [isAuthenticated, user, form]);

  // Available time slots
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  // Fetch booked slots for selected date
  const { data: bookedSlots = [] } = useQuery({
    queryKey: ["/api/appointments/booked-slots", selectedDate?.toISOString().split('T')[0]],
    enabled: !!selectedDate,
  });

  // Check if phone number exists
  const checkPhoneMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      const response = await fetch(`/api/customers/check-phone?phone=${encodeURIComponent(phoneNumber)}`);
      return response.json();
    },
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      return await apiRequest("/api/appointments", "POST", appointmentData);
    },
    onSuccess: () => {
      toast({
        title: "예약 완료",
        description: "방문 예약이 성공적으로 완료되었습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "예약 실패",
        description: error.message || "예약 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handlePhoneNumberBlur = (phoneNumber: string) => {
    if (phoneNumber.length >= 10) {
      checkPhoneMutation.mutate(phoneNumber);
    }
  };

  const handleDateTimeNext = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "선택 오류",
        description: "날짜와 시간을 모두 선택해주세요.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleCustomerInfoNext = (data: AppointmentFormData) => {
    // Allow existing customers to proceed - we'll upsert them in the backend
    setStep(3);
  };

  const handleConfirmBooking = () => {
    const formData = form.getValues();
    const appointmentData = {
      appointmentDate: selectedDate,
      timeSlot: selectedTime,
      visitReason: formData.visitReason,
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        visitType: formData.visitType,
      },
      mailingList: formData.mailingList,
    };

    createAppointmentMutation.mutate(appointmentData);
  };

  const availableSlots = timeSlots.filter(slot => !(bookedSlots as string[]).includes(slot));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => step === 1 ? setLocation("/") : setStep(step - 1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">방문 예약</h1>
          <p className="text-gray-600">네일아트 서비스 방문 일정을 예약하세요</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <div className={`w-12 h-1 ${step >= 3 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Date and Time Selection */}
        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  날짜 선택
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => !isAfter(date, startOfToday())}
                  locale={ko}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  시간 선택
                  {selectedDate && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      {format(selectedDate, "M월 d일 (eee)", { locale: ko })}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedDate ? (
                  <p className="text-gray-500">먼저 날짜를 선택해주세요</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(slot)}
                        className="text-sm"
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                )}
                {selectedDate && availableSlots.length === 0 && (
                  <p className="text-red-500 text-sm">선택한 날짜에 예약 가능한 시간이 없습니다.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Customer Information */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                고객 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCustomerInfoNext)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>성 (First Name) *</FormLabel>
                          <FormControl>
                            <Input placeholder="성을 입력해주세요" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이름 (Last Name) *</FormLabel>
                          <FormControl>
                            <Input placeholder="이름을 입력해주세요" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>전화번호 *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="01012345678" 
                            {...field}
                            onBlur={(e) => handlePhoneNumberBlur(e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                        {checkPhoneMutation.data?.exists && (
                          <p className="text-red-500 text-sm">이미 등록된 고객입니다</p>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이메일</FormLabel>
                        <FormControl>
                          <Input placeholder="example@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="visitType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>방문 유형 *</FormLabel>
                        <FormControl>
                          <RadioGroup value={field.value} onValueChange={field.onChange}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="방문예약" id="visit-booking" />
                              <label htmlFor="visit-booking">방문예약</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="최초방문" id="first-visit" />
                              <label htmlFor="first-visit">최초방문</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="인터넷예약" id="online-booking" />
                              <label htmlFor="online-booking">인터넷예약</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="visitReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>방문 사유 *</FormLabel>
                        <FormControl>
                          <Input placeholder="네일아트, 네일케어, 상담 등" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mailingList"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>메일링 리스트 가입</FormLabel>
                          <p className="text-sm text-gray-600">
                            새로운 디자인과 프로모션 정보를 이메일로 받아보세요
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    다음 단계
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>예약 확인</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="font-semibold text-pink-800 mb-3">예약 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>날짜:</span>
                    <span>{selectedDate && format(selectedDate, "yyyy년 M월 d일 (eee)", { locale: ko })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>시간:</span>
                    <span>{selectedTime}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">고객 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>성명:</span>
                    <span>{form.getValues("firstName")} {form.getValues("lastName")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>전화번호:</span>
                    <span>{form.getValues("phoneNumber")}</span>
                  </div>
                  {form.getValues("email") && (
                    <div className="flex justify-between">
                      <span>이메일:</span>
                      <span>{form.getValues("email")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>방문 유형:</span>
                    <span>{form.getValues("visitType")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>방문 사유:</span>
                    <span>{form.getValues("visitReason")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>메일링 리스트:</span>
                    <span>{form.getValues("mailingList") ? "가입" : "가입 안함"}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  수정하기
                </Button>
                <Button 
                  onClick={handleConfirmBooking} 
                  className="flex-1"
                  disabled={createAppointmentMutation.isPending}
                >
                  {createAppointmentMutation.isPending ? "예약 중..." : "예약 확정"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          {step === 1 && (
            <div></div>
          )}
          {step === 1 && (
            <Button onClick={handleDateTimeNext}>
              다음 단계
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
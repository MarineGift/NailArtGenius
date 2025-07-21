import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/header";
import { Brain, CheckCircle, Clock } from "lucide-react";

export default function AiProcessing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "사진 업로드 완료", icon: CheckCircle, status: "completed" },
    { label: "손가락 형태 분석 중...", icon: Brain, status: "processing" },
    { label: "네일 모양 생성 대기", icon: Clock, status: "waiting" }
  ];

  const analysisMutation = useMutation({
    mutationFn: async ({ photoIds, sessionId }: { photoIds: number[], sessionId: string }) => {
      const response = await apiRequest("POST", "/api/ai/analyze", { photoIds, sessionId });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "AI 분석 완료!",
        description: "네일 모양이 성공적으로 생성되었습니다.",
      });
      setLocation(`/designs?sessionId=${data.sessionId}`);
    },
    onError: (error) => {
      toast({
        title: "분석 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Simulate processing steps
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    // Start AI analysis
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sessionId');
    
    if (sessionId) {
      // In a real app, we would get photo IDs from the upload response
      // For now, we'll simulate with empty array and let the backend handle it
      setTimeout(() => {
        analysisMutation.mutate({ photoIds: [], sessionId });
      }, 6000);
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
              <Brain className="text-secondary text-2xl animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI 분석 진행중</h2>
            <p className="text-gray-600">업로드된 사진을 분석하여 최적의 네일 모양을 생성하고 있습니다</p>
          </div>

          {/* Progress Steps */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  let status = "waiting";
                  
                  if (index <= currentStep) {
                    status = index === currentStep ? "processing" : "completed";
                  }

                  return (
                    <div key={index} className="flex items-center justify-center">
                      <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${
                        status === "completed" ? "bg-success" :
                        status === "processing" ? "bg-secondary animate-pulse" :
                        "bg-gray-300"
                      }`}>
                        {status === "completed" && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`${
                        status === "completed" ? "text-success" :
                        status === "processing" ? "text-secondary" :
                        "text-gray-500"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Loading Animation */}
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600">
              예상 소요시간: 2-3분 • 진행률: {Math.round(progress)}%
            </p>
          </div>

          {analysisMutation.isPending && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                AI가 손가락 모양을 정밀 분석하고 있습니다. 잠시만 기다려주세요...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

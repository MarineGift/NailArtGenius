// SMS 시스템을 위한 타입 정의
export interface SMSMessage {
  to: string; // 전화번호
  message: string; // 메시지 내용
  type: 'reminder' | 'promotion' | 'welcome' | 'followup'; // 메시지 유형
}

export interface SMSTemplate {
  id: string;
  type: SMSMessage['type'];
  name: string;
  template: string; // 템플릿 문자열 ({{name}}, {{date}} 등의 변수 포함)
  variables: string[]; // 사용 가능한 변수들
}

export interface SMSCampaign {
  id: string;
  name: string;
  templateId: string;
  recipients: number[]; // customer ID 배열
  scheduledDate?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  createdAt: Date;
}

// SMS 자동화 규칙
export interface SMSAutomationRule {
  id: string;
  name: string;
  trigger: 'appointment_reminder' | 'visit_followup' | 'loyalty_reward' | 'birthday';
  daysAfterVisit?: number; // 방문 후 며칠 뒤에 발송할지
  daysBefore?: number; // 예약 며칠 전에 발송할지
  templateId: string;
  isActive: boolean;
  createdAt: Date;
}
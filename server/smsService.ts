import { db } from './db';
import { customers, smsTemplates, smsHistory, smsAutomationRules, appointments, customerPurchases } from '@shared/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

// SMS 서비스 인터페이스 (실제 SMS 제공업체 연결 필요)
interface SMSProvider {
  sendSMS(phoneNumber: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

// 실제 SMS 제공업체 구현 예시 (Twilio, 네이버 클라우드, KT 등)
class MockSMSProvider implements SMSProvider {
  async sendSMS(phoneNumber: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // 실제 환경에서는 여기에 SMS API 호출 코드를 구현
    console.log(`SMS 발송: ${phoneNumber} -> ${message}`);
    return { success: true, messageId: `msg_${Date.now()}` };
  }
}

export class SMSService {
  private smsProvider: SMSProvider;

  constructor() {
    this.smsProvider = new MockSMSProvider();
  }

  // SMS 템플릿에서 변수를 실제 값으로 치환
  private replaceVariables(template: string, variables: Record<string, string>): string {
    let message = template;
    Object.entries(variables).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return message;
  }

  // 개별 SMS 발송
  async sendSMS(customerId: number, templateId: number, variables: Record<string, string> = {}): Promise<boolean> {
    try {
      // 고객 정보 조회
      const [customer] = await db.select().from(customers).where(eq(customers.id, customerId));
      if (!customer) {
        console.error(`고객을 찾을 수 없습니다: ${customerId}`);
        return false;
      }

      // 템플릿 조회
      const [template] = await db.select().from(smsTemplates).where(eq(smsTemplates.id, templateId));
      if (!template) {
        console.error(`SMS 템플릿을 찾을 수 없습니다: ${templateId}`);
        return false;
      }

      // 기본 변수 설정
      const defaultVariables = {
        name: customer.name,
        phone: customer.phoneNumber,
        ...variables
      };

      // 메시지 생성
      const message = this.replaceVariables(template.template, defaultVariables);

      // SMS 발송
      const result = await this.smsProvider.sendSMS(customer.phoneNumber, message);

      // 발송 기록 저장
      await db.insert(smsHistory).values({
        customerId,
        phoneNumber: customer.phoneNumber,
        message,
        type: template.type as any,
        status: result.success ? 'sent' : 'failed',
        templateId,
        deliveryStatus: result.success ? 'delivered' : 'failed',
        errorMessage: result.error
      });

      return result.success;
    } catch (error) {
      console.error('SMS 발송 중 오류:', error);
      return false;
    }
  }

  // 예약 리마인더 자동 발송
  async sendAppointmentReminders(): Promise<void> {
    try {
      // 내일 예약된 고객들 조회
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      const upcomingAppointments = await db.select({
        customerId: appointments.customerId,
        customerName: customers.name,
        customerPhone: customers.phoneNumber,
        appointmentDate: appointments.appointmentDate,
        timeSlot: appointments.timeSlot
      })
      .from(appointments)
      .innerJoin(customers, eq(customers.id, appointments.customerId))
      .where(
        and(
          gte(appointments.appointmentDate, tomorrow),
          lte(appointments.appointmentDate, dayAfterTomorrow),
          eq(appointments.status, 'scheduled'),
          eq(appointments.reminderSent, false)
        )
      );

      // 리마인더 템플릿 조회
      const [reminderTemplate] = await db.select().from(smsTemplates)
        .where(and(eq(smsTemplates.type, 'reminder'), eq(smsTemplates.isActive, true)));

      if (!reminderTemplate) {
        console.log('리마인더 템플릿이 없습니다.');
        return;
      }

      // 각 예약에 대해 리마인더 발송
      for (const appointment of upcomingAppointments) {
        const variables = {
          name: appointment.customerName,
          date: appointment.appointmentDate.toLocaleDateString('ko-KR'),
          time: appointment.timeSlot
        };

        const success = await this.sendSMS(appointment.customerId, reminderTemplate.id, variables);
        
        if (success) {
          // 리마인더 발송 상태 업데이트
          await db.update(appointments)
            .set({ reminderSent: true })
            .where(eq(appointments.customerId, appointment.customerId));
        }
      }

      console.log(`${upcomingAppointments.length}명에게 예약 리마인더를 발송했습니다.`);
    } catch (error) {
      console.error('예약 리마인더 발송 중 오류:', error);
    }
  }

  // 방문 후 팔로업 메시지 자동 발송
  async sendFollowupMessages(): Promise<void> {
    try {
      // 3일 전에 방문한 고객들 조회
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      threeDaysAgo.setHours(0, 0, 0, 0);
      
      const fourDaysAgo = new Date(threeDaysAgo);
      fourDaysAgo.setDate(fourDaysAgo.getDate() - 1);

      // 최근 방문한 고객 중 팔로업 메시지를 받지 않은 고객들
      const recentCustomers = await db.select({
        id: customers.id,
        name: customers.name,
        phoneNumber: customers.phoneNumber,
        lastVisit: customers.lastVisit
      })
      .from(customers)
      .where(
        and(
          gte(customers.lastVisit, fourDaysAgo),
          lte(customers.lastVisit, threeDaysAgo)
        )
      );

      // 팔로업 템플릿 조회
      const [followupTemplate] = await db.select().from(smsTemplates)
        .where(and(eq(smsTemplates.type, 'followup'), eq(smsTemplates.isActive, true)));

      if (!followupTemplate) {
        console.log('팔로업 템플릿이 없습니다.');
        return;
      }

      // 각 고객에게 팔로업 메시지 발송
      for (const customer of recentCustomers) {
        const variables = {
          name: customer.name
        };

        await this.sendSMS(customer.id, followupTemplate.id, variables);
      }

      console.log(`${recentCustomers.length}명에게 팔로업 메시지를 발송했습니다.`);
    } catch (error) {
      console.error('팔로업 메시지 발송 중 오류:', error);
    }
  }

  // 기본 SMS 템플릿 생성
  async createDefaultTemplates(): Promise<void> {
    try {
      const defaultTemplates = [
        {
          name: '예약 리마인더',
          type: 'reminder',
          template: '안녕하세요 {{name}}님, 내일 {{date}} {{time}}에 예약이 있습니다. Connie\'s Nail에서 뵙겠습니다!',
          variables: ['name', 'date', 'time']
        },
        {
          name: '방문 감사 메시지',
          type: 'followup',
          template: '{{name}}님, Connie\'s Nail 방문해주셔서 감사합니다! 네일케어는 어떠셨나요? 다음에도 찾아주세요 💅',
          variables: ['name']
        },
        {
          name: '신규 고객 환영',
          type: 'welcome',
          template: '{{name}}님, Connie\'s Nail에 오신 것을 환영합니다! 첫 방문 고객 할인 혜택을 준비했어요 ✨',
          variables: ['name']
        },
        {
          name: '프로모션 안내',
          type: 'promotion',
          template: '{{name}}님께 특별한 할인 혜택! 이번 주 젤네일 20% 할인! 예약 문의: 02-1234-5678',
          variables: ['name']
        }
      ];

      for (const template of defaultTemplates) {
        // 중복 체크
        const existing = await db.select().from(smsTemplates)
          .where(and(eq(smsTemplates.name, template.name)));

        if (existing.length === 0) {
          await db.insert(smsTemplates).values(template);
        }
      }

      console.log('기본 SMS 템플릿이 생성되었습니다.');
    } catch (error) {
      console.error('SMS 템플릿 생성 중 오류:', error);
    }
  }

  // SMS 발송 통계 조회
  async getSMSStats(customerId?: number): Promise<any> {
    try {
      let query = db.select().from(smsHistory);
      
      if (customerId) {
        query = query.where(eq(smsHistory.customerId, customerId));
      }

      const history = await query;

      const stats = {
        totalSent: history.length,
        successRate: history.filter(h => h.status === 'sent').length / history.length * 100,
        byType: history.reduce((acc, h) => {
          acc[h.type] = (acc[h.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        recentHistory: history.slice(0, 10)
      };

      return stats;
    } catch (error) {
      console.error('SMS 통계 조회 중 오류:', error);
      return { totalSent: 0, successRate: 0, byType: {}, recentHistory: [] };
    }
  }
}

export const smsService = new SMSService();
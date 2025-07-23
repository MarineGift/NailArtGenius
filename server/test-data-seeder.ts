import { db } from './db';
import { customers, customerReservations, customerNailImages } from '@shared/schema';

export async function seedTestCustomersAndReservations() {
  try {
    console.log('🌱 Seeding test customers and reservations...');

    // Test customers data
    const testCustomers = [
      {
        name: '김미나',
        email: 'kim.mina@example.com',
        phoneNumber: '010-1234-5678',
        category: 'booking',
        mailingConsent: true,
        totalVisits: 3,
        totalSpent: '180.00',
        notes: 'AI 네일아트 선호, 플로럴 디자인 좋아함'
      },
      {
        name: '박소영',
        email: 'park.soyoung@example.com', 
        phoneNumber: '010-2345-6789',
        category: 'general',
        mailingConsent: false,
        totalVisits: 1,
        totalSpent: '65.00',
        notes: '미니멀한 디자인 선호'
      },
      {
        name: '이지현',
        email: 'lee.jihyun@example.com',
        phoneNumber: '010-3456-7890',
        category: 'booking',
        mailingConsent: true,
        totalVisits: 5,
        totalSpent: '320.00',
        notes: '정기 고객, 웨딩 스페셜 예약 이력'
      },
      {
        name: '최윤아',
        email: 'choi.yuna@example.com',
        phoneNumber: '010-4567-8901',
        category: 'mailing',
        mailingConsent: true,
        totalVisits: 0,
        totalSpent: '0.00',
        notes: '뉴스레터 구독자, 첫 방문 예정'
      },
      {
        name: '정수현',
        email: 'jung.suhyun@example.com',
        phoneNumber: '010-5678-9012',
        category: 'booking',
        mailingConsent: false,
        totalVisits: 2,
        totalSpent: '140.00',
        notes: '글리터 디자인 좋아함'
      },
      {
        name: '한예린',
        email: 'han.yerin@example.com',
        phoneNumber: '010-6789-0123',
        category: 'general',
        mailingConsent: true,
        totalVisits: 1,
        totalSpent: '80.00',
        notes: '3D 아트 문의 이력'
      },
      {
        name: '강민지',
        email: 'kang.minji@example.com',
        phoneNumber: '010-7890-1234',
        category: 'booking',
        mailingConsent: true,
        totalVisits: 4,
        totalSpent: '260.00',
        notes: '시즌 디자인 단골, 봄/가을 예약'
      },
      {
        name: '오나영',
        email: 'oh.nayoung@example.com',
        phoneNumber: '010-8901-2345',
        category: 'general',
        mailingConsent: false,
        totalVisits: 1,
        totalSpent: '45.00',
        notes: '클래식 프렌치 선호'
      },
      {
        name: '임지은',
        email: 'lim.jieun@example.com',
        phoneNumber: '010-9012-3456',
        category: 'booking',
        mailingConsent: true,
        totalVisits: 6,
        totalSpent: '420.00',
        notes: 'VIP 고객, 지오메트릭 패턴 전문'
      },
      {
        name: '윤채원',
        email: 'yoon.chaewon@example.com',
        phoneNumber: '010-0123-4567',
        category: 'mailing',
        mailingConsent: true,
        totalVisits: 0,
        totalSpent: '0.00',
        notes: '옴브레 이펙트 관심, 첫 예약 대기 중'
      }
    ];

    // Insert customers
    const insertedCustomers = await db.insert(customers).values(testCustomers).returning();
    console.log(`✅ ${insertedCustomers.length} test customers created`);

    // Test reservations data
    const testReservations = [
      {
        userId: 'test-user-1',
        customerPhone: '010-1234-5678',
        selectedDesignName: '플로럴 디자인',
        appointmentDate: new Date('2025-07-25 14:00:00'),
        timeSlot: '14:00',
        visitDate: new Date('2025-07-25'),
        paymentStatus: 'paid',
        paymentAmount: '65.00',
        reservationStatus: 'confirmed',
        notes: 'AI 분석 완료, 핑크 톤 요청'
      },
      {
        userId: 'test-user-2',
        customerPhone: '010-2345-6789',
        selectedDesignName: '미니멀리스트 스타일',
        appointmentDate: new Date('2025-07-26 10:30:00'),
        timeSlot: '10:30',
        visitDate: new Date('2025-07-26'),
        paymentStatus: 'pending',
        paymentAmount: '40.00',
        reservationStatus: 'confirmed',
        notes: '심플한 색상 선호'
      },
      {
        userId: 'test-user-3',
        customerPhone: '010-3456-7890',
        selectedDesignName: '웨딩 스페셜',
        appointmentDate: new Date('2025-07-28 15:30:00'),
        timeSlot: '15:30',
        visitDate: new Date('2025-07-28'),
        paymentStatus: 'paid',
        paymentAmount: '80.00',
        reservationStatus: 'confirmed',
        notes: '결혼식 예정일: 8월 3일'
      },
      {
        userId: 'test-user-4',
        customerPhone: '010-5678-9012',
        selectedDesignName: '글리터 & 스파클',
        appointmentDate: new Date('2025-07-30 16:00:00'),
        timeSlot: '16:00',
        visitDate: new Date('2025-07-30'),
        paymentStatus: 'paid',
        paymentAmount: '70.00',
        reservationStatus: 'confirmed',
        notes: '골드 글리터 요청'
      },
      {
        userId: 'test-user-5',
        customerPhone: '010-7890-1234',
        selectedDesignName: '시즌 디자인',
        appointmentDate: new Date('2025-08-01 11:00:00'),
        timeSlot: '11:00',
        visitDate: new Date('2025-08-01'),
        paymentStatus: 'pending',
        paymentAmount: '60.00',
        reservationStatus: 'confirmed',
        notes: '여름 테마, 바다색 톤'
      },
      {
        userId: 'test-user-6',
        customerPhone: '010-8901-2345',
        selectedDesignName: '클래식 프렌치 매니큐어',
        appointmentDate: new Date('2025-08-02 13:30:00'),
        timeSlot: '13:30',
        visitDate: new Date('2025-08-02'),
        paymentStatus: 'paid',
        paymentAmount: '45.00',
        reservationStatus: 'confirmed',
        notes: '전통적인 화이트 팁'
      },
      {
        userId: 'test-user-7',
        customerPhone: '010-9012-3456',
        selectedDesignName: '지오메트릭 패턴',
        appointmentDate: new Date('2025-08-03 14:30:00'),
        timeSlot: '14:30',
        visitDate: new Date('2025-08-03'),
        paymentStatus: 'paid',
        paymentAmount: '55.00',
        reservationStatus: 'confirmed',
        notes: '모던 블랙 & 화이트'
      },
      {
        userId: 'test-user-8',
        customerPhone: '010-6789-0123',
        selectedDesignName: '3D 아트 디자인',
        appointmentDate: new Date('2025-08-05 10:00:00'),
        timeSlot: '10:00',
        visitDate: new Date('2025-08-05'),
        paymentStatus: 'pending',
        paymentAmount: '90.00',
        reservationStatus: 'confirmed',
        notes: '꽃 모티브 3D 아트'
      }
    ];

    // Insert reservations
    const insertedReservations = await db.insert(customerReservations).values(testReservations).returning();
    console.log(`✅ ${insertedReservations.length} test reservations created`);

    // Sample nail images for first few customers
    const testNailImages = [];
    const fingerTypes = ['thumb', 'index', 'middle', 'ring', 'pinky'];
    const handTypes = ['left', 'right'];

    // Create 12 images for first 3 customers (6 images each for 2 customers)
    for (let customerIndex = 0; customerIndex < 3; customerIndex++) {
      for (let handIndex = 0; handIndex < handTypes.length; handIndex++) {
        for (let fingerIndex = 0; fingerIndex < fingerTypes.length; fingerIndex++) {
          if (testNailImages.length < 36) { // 12 images per customer for 3 customers
            testNailImages.push({
              userId: `test-user-${customerIndex + 1}`,
              imageIndex: (handIndex * 5) + fingerIndex + 1,
              fileName: `nail_${customerIndex + 1}_${handTypes[handIndex]}_${fingerTypes[fingerIndex]}.jpg`,
              filePath: `/uploads/customer-nails/test-user-${customerIndex + 1}/`,
              fingerType: fingerTypes[fingerIndex],
              handType: handTypes[handIndex],
              imageUrl: `/images/sample-nail-${fingerTypes[fingerIndex]}.jpg`,
              notes: `${handTypes[handIndex] === 'left' ? '왼손' : '오른손'} ${fingerTypes[fingerIndex] === 'thumb' ? '엄지' : fingerTypes[fingerIndex] === 'index' ? '검지' : fingerTypes[fingerIndex] === 'middle' ? '중지' : fingerTypes[fingerIndex] === 'ring' ? '약지' : '새끼'} 손가락`
            });
          }
        }
      }
    }

    // Insert nail images
    if (testNailImages.length > 0) {
      const insertedImages = await db.insert(customerNailImages).values(testNailImages).returning();
      console.log(`✅ ${insertedImages.length} test nail images created`);
    }

    console.log('🌱 Test data seeding completed successfully!');
    return {
      customersCreated: insertedCustomers.length,
      reservationsCreated: insertedReservations.length,
      imagesCreated: testNailImages.length
    };

  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    throw error;
  }
}
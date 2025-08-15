import { db } from './db';
import { services, operatingHours } from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function seedBookingData() {
  try {
    console.log('Seeding booking system data...');

    // Check if services already exist
    const existingServices = await db.select().from(services).limit(1);
    
    if (existingServices.length === 0) {
      // Seed services
      const servicesToInsert = [
        // Spa Treatments
        {
          name: 'Spa Manicure',
          description: 'Spa Manicure - Nail care and moisturizing treatment',
          category: 'spa',
          duration: 60,
          price: "45.00",
          displayOrder: 1
        },
        {
          name: 'Spa Pedicure',
          description: 'Spa Pedicure - Toenail care and moisturizing treatment',
          category: 'spa',
          duration: 75,
          price: "55.00",
          displayOrder: 2
        },
        
        // Nail Treatments
        {
          name: 'Regular Manicure',
          description: 'Regular Manicure - Basic nail care and polish',
          category: 'treatments',
          duration: 45,
          price: "25.00",
          displayOrder: 3
        },
        {
          name: 'French Manicure',
          description: '프렌치 매니큐어 - 클래식한 프렌치 스타일',
          category: 'treatments',
          duration: 60,
          price: "35.00",
          displayOrder: 4
        },
        {
          name: 'Gel Manicure',
          description: '컬러 젤 매니큐어 - 오래 지속되는 젤 폴리시',
          category: 'treatments',
          duration: 75,
          price: "40.00",
          displayOrder: 5
        },
        {
          name: 'Regular Pedicure',
          description: 'Regular Pedicure - Basic toenail care',
          category: 'treatments',
          duration: 60,
          price: "35.00",
          displayOrder: 6
        },
        {
          name: 'Gel Pedicure',
          description: '젤 페디큐어 - 오래 지속되는 젤 페디큐어',
          category: 'treatments',
          duration: 90,
          price: "50.00",
          displayOrder: 7
        },
        
        // Nail Design
        {
          name: 'Custom Nail Art',
          description: 'AI 맞춤 네일아트 디자인',
          category: 'design',
          duration: 120,
          price: "80.00",
          displayOrder: 8,
          requiresConsultation: true
        },
        {
          name: 'Simple Nail Design',
          description: '간단한 네일 디자인',
          category: 'design',
          duration: 90,
          price: "60.00",
          displayOrder: 9
        },
        
        // Waxing
        {
          name: 'Eyebrow Waxing',
          description: '눈썹 왁싱',
          category: 'waxing',
          duration: 20,
          price: "15.00",
          displayOrder: 10
        },
        {
          name: 'Lip Waxing',
          description: '입술 왁싱',
          category: 'waxing',
          duration: 15,
          price: "12.00",
          displayOrder: 11
        },
        
        // Massage
        {
          name: 'Hand & Arm Massage',
          description: 'Hand and arm massage',
          category: 'massage',
          duration: 30,
          price: "25.00",
          displayOrder: 12
        },
        {
          name: 'Foot & Leg Massage',
          description: 'Foot and leg massage',
          category: 'massage',
          duration: 45,
          price: "35.00",
          displayOrder: 13
        }
      ];

      await db.insert(services).values(servicesToInsert);
      console.log('✓ Services seeded successfully');
    }

    // Check if operating hours exist
    const existingHours = await db.select().from(operatingHours).limit(1);
    
    if (existingHours.length === 0) {
      // Seed operating hours (Monday-Friday 10:00-19:00)
      const hoursToInsert = [
        // Sunday - Closed
        {
          dayOfWeek: 0,
          openTime: '10:00',
          closeTime: '19:00',
          isOpen: false,
          maxConcurrentBookings: 0,
          specialNotes: 'Closed on Sundays'
        },
        // Monday to Friday - Open
        {
          dayOfWeek: 1,
          openTime: '10:00',
          closeTime: '19:00',
          isOpen: true,
          maxConcurrentBookings: 3,
          breakStartTime: '12:30',
          breakEndTime: '13:30',
          specialNotes: 'Regular business hours'
        },
        {
          dayOfWeek: 2,
          openTime: '10:00',
          closeTime: '19:00',
          isOpen: true,
          maxConcurrentBookings: 3,
          breakStartTime: '12:30',
          breakEndTime: '13:30',
          specialNotes: 'Regular business hours'
        },
        {
          dayOfWeek: 3,
          openTime: '10:00',
          closeTime: '19:00',
          isOpen: true,
          maxConcurrentBookings: 3,
          breakStartTime: '12:30',
          breakEndTime: '13:30',
          specialNotes: 'Regular business hours'
        },
        {
          dayOfWeek: 4,
          openTime: '10:00',
          closeTime: '19:00',
          isOpen: true,
          maxConcurrentBookings: 3,
          breakStartTime: '12:30',
          breakEndTime: '13:30',
          specialNotes: 'Regular business hours'
        },
        {
          dayOfWeek: 5,
          openTime: '10:00',
          closeTime: '19:00',
          isOpen: true,
          maxConcurrentBookings: 3,
          breakStartTime: '12:30',
          breakEndTime: '13:30',
          specialNotes: 'Regular business hours'
        },
        // Saturday - Closed
        {
          dayOfWeek: 6,
          openTime: '10:00',
          closeTime: '19:00',
          isOpen: false,
          maxConcurrentBookings: 0,
          specialNotes: 'Closed on Saturdays'
        }
      ];

      await db.insert(operatingHours).values(hoursToInsert);
      console.log('✓ Operating hours seeded successfully');
    }

    console.log('✓ Booking system data seeding completed');
    return true;
  } catch (error) {
    console.error('Error seeding booking data:', error);
    return false;
  }
}
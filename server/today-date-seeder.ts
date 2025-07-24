import { db } from './db';
import { customers, bookings, orders, siteVisits } from '@shared/schema';

export async function seedTodayDateData() {
  console.log('📅 Starting today date sample data seeding...');
  
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  try {
    // Add customers with today's date
    console.log('👥 Creating customers with today\'s date...');
    
    const todayCustomers = [
      {
        name: 'Emma Johnson',
        email: 'emma.johnson@email.com',
        phoneNumber: '010-1111-2024',
        visitType: 'first_visit',
        category: 'general',
        mailingConsent: true,
        totalVisits: 1,
        totalSpent: '65.00',
        lastVisit: todayStart,
        notes: 'New customer - interested in floral designs',
        GetDate: todayStart
      },
      {
        name: 'Sarah Kim',
        email: 'sarah.kim@email.com',
        phoneNumber: '010-2222-2024',
        visitType: 'appointment_visit',
        category: 'VIP',
        mailingConsent: true,
        totalVisits: 5,
        totalSpent: '320.00',
        lastVisit: todayStart,
        notes: 'VIP customer - prefers geometric patterns',
        GetDate: todayStart
      },
      {
        name: 'Lisa Chen',
        email: 'lisa.chen@email.com',
        phoneNumber: '010-3333-2024',
        visitType: 'online_booking',
        category: 'general',
        mailingConsent: false,
        totalVisits: 2,
        totalSpent: '130.00',
        lastVisit: todayStart,
        notes: 'Regular customer - likes minimalist style',
        GetDate: todayStart
      }
    ];
    
    for (const customer of todayCustomers) {
      await db.insert(customers).values(customer).onConflictDoNothing();
    }
    
    // Add bookings for today
    console.log('📅 Creating today\'s bookings...');
    
    const todayBookings = [
      {
        customerId: 1, // Will be mapped to actual customer ID
        bookingDate: todayStart,
        timeSlot: '10:00',
        duration: 60,
        status: 'confirmed',
        visitReason: 'nail_art_service',
        serviceDetails: 'Classic French Manicure',
        price: '45.00',
        reminderSent: true,
        notes: 'Customer requested white tips',
        GetDate: todayStart
      },
      {
        customerId: 2,
        bookingDate: todayStart,
        timeSlot: '14:30',
        duration: 90,
        status: 'confirmed',
        visitReason: 'premium_service',
        serviceDetails: 'Geometric Pattern Design',
        price: '55.00',
        reminderSent: true,
        notes: 'VIP customer - use premium products',
        GetDate: todayStart
      },
      {
        customerId: 3,
        bookingDate: todayStart,
        timeSlot: '16:00',
        duration: 45,
        status: 'scheduled',
        visitReason: 'regular_service',
        serviceDetails: 'Minimalist Style',
        price: '40.00',
        reminderSent: false,
        notes: 'Online booking - confirm 1 hour before',
        GetDate: todayStart
      }
    ];
    
    for (const booking of todayBookings) {
      await db.insert(bookings).values(booking).onConflictDoNothing();
    }
    
    // Add orders for today
    console.log('💰 Creating today\'s orders...');
    
    const todayOrders = [
      {
        userId: 'user_today_001',
        designId: 1,
        sessionId: 'session_today_001',
        totalAmount: '45.00',
        paypalOrderId: 'PAYPAL_TODAY_001',
        paymentStatus: 'paid',
        printStatus: 'completed',
        GetDate: todayStart
      },
      {
        userId: 'user_today_002',
        designId: 2,
        sessionId: 'session_today_002',
        totalAmount: '55.00',
        paypalOrderId: 'PAYPAL_TODAY_002',
        paymentStatus: 'paid',
        printStatus: 'printing',
        GetDate: todayStart
      }
    ];
    
    for (const order of todayOrders) {
      await db.insert(orders).values(order).onConflictDoNothing();
    }
    
    // Add site visits for today
    console.log('🌐 Creating today\'s site visits...');
    
    const todayVisits = [
      {
        visitorId: 'visitor_001',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        referrer: 'https://google.com',
        page: '/',
        sessionId: 'session_visit_001',
        visitDuration: 180,
        visitedAt: todayStart,
        GetDate: todayStart
      },
      {
        visitorId: 'visitor_002',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        referrer: 'https://instagram.com',
        page: '/services',
        sessionId: 'session_visit_002',
        visitDuration: 240,
        visitedAt: todayStart,
        GetDate: todayStart
      },
      {
        visitorId: 'visitor_003',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        referrer: 'direct',
        page: '/booking',
        sessionId: 'session_visit_003',
        visitDuration: 320,
        visitedAt: todayStart,
        GetDate: todayStart
      },
      {
        visitorId: 'visitor_004',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Android 14; Mobile; rv:121.0)',
        referrer: 'https://facebook.com',
        page: '/gallery',
        sessionId: 'session_visit_004',
        visitDuration: 150,
        visitedAt: todayStart,
        GetDate: todayStart
      },
      {
        visitorId: 'visitor_005',
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0)',
        referrer: 'https://naver.com',
        page: '/contact',
        sessionId: 'session_visit_005',
        visitDuration: 90,
        visitedAt: todayStart,
        GetDate: todayStart
      }
    ];
    
    for (const visit of todayVisits) {
      await db.insert(siteVisits).values(visit).onConflictDoNothing();
    }
    
    console.log('✅ Today date sample data seeding completed successfully!');
    console.log(`📊 Added data for: ${today.toLocaleDateString()}`);
    console.log('🎯 Dashboard metrics should now show today\'s data');
    
  } catch (error) {
    console.error('❌ Error seeding today date sample data:', error);
    throw error;
  }
}
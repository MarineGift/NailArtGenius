import { db } from './db';
import { customers, appointments, customerNailInfo, aiGeneratedNails, customerVisits } from '@shared/schema';

// Sample data for comprehensive testing with 20 entries each
// All connected via Customer phone numbers as foreign keys

export async function seedComprehensiveSampleData() {
  console.log('🌱 Starting comprehensive sample data seeding...');
  
  try {
    // First, get existing customer phone numbers to ensure foreign key integrity
    const existingCustomers = await db.select({ phoneNumber: customers.phoneNumber }).from(customers);
    const phoneNumbers = existingCustomers.map(c => c.phoneNumber);
    
    if (phoneNumbers.length === 0) {
      console.log('❌ No customers found. Creating sample customers first...');
      // Create sample customers
      const sampleCustomers = [
        { phoneNumber: '010-1234-5678', name: 'Kim Min-jun', email: 'minjun@example.com', category: 'VIP' },
        { phoneNumber: '010-2345-6789', name: 'Lee Seo-yun', email: 'seoyun@example.com', category: 'General' },
        { phoneNumber: '010-3456-7890', name: 'Park Ji-hoon', email: 'jihoon@example.com', category: 'VIP' },
        { phoneNumber: '010-4567-8901', name: 'Choi Yu-jin', email: 'yujin@example.com', category: 'General' },
        { phoneNumber: '010-5678-9012', name: 'Jung Hae-rin', email: 'haerin@example.com', category: 'Mailing List' },
        { phoneNumber: '010-6789-0123', name: 'Song Tae-hyung', email: 'taehyung@example.com', category: 'VIP' },
        { phoneNumber: '010-7890-1234', name: 'Han So-young', email: 'soyoung@example.com', category: 'General' },
        { phoneNumber: '010-8901-2345', name: 'Yoon Jae-min', email: 'jaemin@example.com', category: 'VIP' },
        { phoneNumber: '010-9012-3456', name: 'Lim Eun-ji', email: 'eunji@example.com', category: 'General' },
        { phoneNumber: '010-0123-4567', name: 'Kang Min-ho', email: 'minho@example.com', category: 'Mailing List' },
      ];
      
      for (const customer of sampleCustomers) {
        await db.insert(customers).values(customer);
      }
      phoneNumbers.push(...sampleCustomers.map(c => c.phoneNumber));
    }
    
    console.log(`📱 Using ${phoneNumbers.length} customer phone numbers for foreign key relationships`);
    
    // 1. Seed Finger data (customerNailInfo) - 20 entries
    console.log('💅 Creating customer nail info entries...');
    const fingerPositions = [
      'left_thumb', 'left_index', 'left_middle', 'left_ring', 'left_pinky',
      'right_thumb', 'right_index', 'right_middle', 'right_ring', 'right_pinky'
    ];
    const nailShapes = ['oval', 'square', 'round', 'almond', 'stiletto'];
    const nailLengths = ['short', 'medium', 'long'];
    const designStyles = ['french', 'artistic', 'geometric', 'floral', 'minimalist', 'glitter'];
    const colors = ['pink', 'red', 'blue', 'purple', 'gold', 'silver', 'white', 'black'];
    
    const nailInfoEntries = [];
    for (let i = 0; i < 20; i++) {
      const customerPhone = phoneNumbers[i % phoneNumbers.length];
      const sessionId = `session_${Date.now()}_${i}`;
      
      nailInfoEntries.push({
        customerPhone,
        fingerPosition: fingerPositions[i % fingerPositions.length],
        originalImagePath: `/uploads/nails/original_${customerPhone.replace(/-/g, '')}_${i}.jpg`,
        aiGeneratedImagePath: `/uploads/nails/ai_generated_${customerPhone.replace(/-/g, '')}_${i}.jpg`,
        designPrompt: `Beautiful ${designStyles[i % designStyles.length]} nail design with ${colors[i % colors.length]} and ${colors[(i + 1) % colors.length]} colors`,
        nailShape: nailShapes[i % nailShapes.length],
        nailLength: nailLengths[i % nailLengths.length],
        nailCondition: i % 3 === 0 ? 'healthy' : (i % 3 === 1 ? 'damaged' : 'brittle'),
        designStyle: designStyles[i % designStyles.length],
        colorPreferences: [colors[i % colors.length], colors[(i + 1) % colors.length]],
        sessionId
      });
    }
    
    for (const entry of nailInfoEntries) {
      await db.insert(customerNailInfo).values(entry);
    }
    console.log('✅ Customer nail info entries created');
    
    // 2. Seed AI Generated Nails - 20 entries
    console.log('🤖 Creating AI generated nail entries...');
    const aiNailEntries = [];
    for (let i = 0; i < 20; i++) {
      const customerPhone = phoneNumbers[i % phoneNumbers.length];
      
      aiNailEntries.push({
        userId: (i + 1).toString(),
        sessionId: `ai_session_${Date.now()}_${i}`,
        fingerType: fingerPositions[i % fingerPositions.length].replace('_', ' '),
        nailWidth: (Math.random() * 20 + 8).toFixed(1), // 8-28mm
        nailLength: (Math.random() * 30 + 10).toFixed(1), // 10-40mm
        nailCurvature: (Math.random() * 0.5 + 0.1).toFixed(2), // 0.1-0.6
        fingerWidth: (Math.random() * 20 + 15).toFixed(1), // 15-35mm
        fingerLength: (Math.random() * 30 + 25).toFixed(1), // 25-55mm
        shapeCategory: nailShapes[i % nailShapes.length],
        measurementConfidence: (Math.random() * 30 + 70).toFixed(2), // 70-100%
        imageUrl: `/uploads/ai-nails/generated_${customerPhone.replace(/-/g, '')}_${i}.jpg`
      });
    }
    
    for (const entry of aiNailEntries) {
      await db.insert(aiGeneratedNails).values(entry);
    }
    console.log('✅ AI generated nail entries created');
    
    // 3. Seed Booking/Appointments - 20 entries
    console.log('📅 Creating appointment/booking entries...');
    const services = [
      'Classic French Manicure',
      'Floral Design Nail Art',
      'Geometric Pattern',
      'Glitter & Sparkle',
      'Minimalist Style',
      'Seasonal Design',
      'Wedding Special',
      'Ombre Effect',
      '3D Art Design'
    ];
    const visitReasons = ['First Visit', 'Regular Maintenance', 'Special Event', 'Touch-up', 'New Design'];
    const statuses = ['confirmed', 'pending', 'completed', 'cancelled'];
    
    const appointmentEntries = [];
    for (let i = 0; i < 20; i++) {
      const customerPhone = phoneNumbers[i % phoneNumbers.length];
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + (i - 10)); // Mix of past and future dates
      
      appointmentEntries.push({
        customerId: i + 1,
        customerPhone,
        appointmentDate: baseDate,
        timeSlot: `${(9 + (i % 9)).toString().padStart(2, '0')}:${(i % 2) * 30 === 0 ? '00' : '30'}`,
        serviceDetails: services[i % services.length],
        visitReason: visitReasons[i % visitReasons.length],
        price: (Math.random() * 150 + 40).toFixed(2), // $40-190
        status: statuses[i % statuses.length],
        notes: i % 3 === 0 ? `Special request: ${designStyles[i % designStyles.length]} style preferred` : null,
        paymentStatus: i % 4 === 0 ? 'paid' : 'pending',
        reminderSent: i % 2 === 0
      });
    }
    
    for (const entry of appointmentEntries) {
      await db.insert(appointments).values(entry);
    }
    console.log('✅ Appointment/booking entries created');
    
    // 4. Seed Visit History - 20 entries
    console.log('👁️ Creating visit history entries...');
    const visitTypes = ['Regular Visit', 'Consultation', 'Treatment', 'Follow-up', 'Emergency'];
    const paymentMethods = ['Cash', 'Card', 'Online Payment', 'Bank Transfer'];
    
    const visitEntries = [];
    for (let i = 0; i < 20; i++) {
      const customerPhone = phoneNumbers[i % phoneNumbers.length];
      const visitDate = new Date();
      visitDate.setDate(visitDate.getDate() - (i * 7)); // Weekly visits going back
      
      visitEntries.push({
        customerPhone,
        visitDate: visitDate,
        visitType: visitTypes[i % visitTypes.length],
        servicesReceived: [services[i % services.length], services[(i + 1) % services.length]],
        totalAmount: (Math.random() * 200 + 50).toFixed(2), // $50-250
        paymentMethod: paymentMethods[i % paymentMethods.length],
        satisfaction: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        visitNotes: i % 3 === 0 ? `Customer preferred ${colors[i % colors.length]} colors. Excellent service experience.` : null,
        nextAppointment: i % 4 === 0 ? new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) : null // Next week
      });
    }
    
    for (const entry of visitEntries) {
      await db.insert(customerVisits).values(entry);
    }
    console.log('✅ Visit history entries created');
    
    console.log('🎉 Comprehensive sample data seeding completed successfully!');
    console.log(`📊 Created 20 entries each for:`);
    console.log(`   - Customer Nail Info (Finger data)`);
    console.log(`   - AI Generated Nails`);
    console.log(`   - Appointments/Bookings`);
    console.log(`   - Visit History`);
    console.log(`🔗 All entries connected via Customer phone numbers as foreign keys`);
    
  } catch (error) {
    console.error('❌ Error seeding comprehensive sample data:', error);
    throw error;
  }
}
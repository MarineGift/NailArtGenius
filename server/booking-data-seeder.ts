import { db } from './db';
import { bookings, customers } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Create comprehensive booking data for all registered customers
export async function seedBookingData() {
  console.log('🗓️ Creating booking entries for all registered customers...');
  
  try {
    // Get all customers
    const allCustomers = await db.select().from(customers);
    console.log(`📱 Found ${allCustomers.length} customers for booking creation`);
    
    if (allCustomers.length === 0) {
      console.log('❌ No customers found, skipping booking creation');
      return;
    }

    // Service options for booking
    const services = [
      { name: 'Classic French Manicure', price: '45.00', duration: 60 },
      { name: 'Floral Design', price: '65.00', duration: 90 },
      { name: 'Geometric Pattern', price: '55.00', duration: 75 },
      { name: 'Glitter & Sparkle', price: '70.00', duration: 90 },
      { name: 'Minimalist Style', price: '40.00', duration: 45 },
      { name: 'Seasonal Design', price: '60.00', duration: 80 },
      { name: 'Wedding Special', price: '80.00', duration: 120 },
      { name: 'Ombre Effect', price: '65.00', duration: 85 },
      { name: '3D Art Design', price: '90.00', duration: 150 }
    ];

    const statuses = ['scheduled', 'confirmed', 'completed', 'in_progress'];
    const visitReasons = ['Regular Visit', 'Special Event', 'Wedding Preparation', 'First Visit', 'Follow-up'];
    const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

    let totalBookingsCreated = 0;

    // Create 1-5 bookings for each customer
    for (const customer of allCustomers) {
      const bookingCount = Math.floor(Math.random() * 5) + 1; // 1-5 bookings per customer
      console.log(`👤 Creating ${bookingCount} bookings for customer: ${customer.phoneNumber}`);

      for (let i = 0; i < bookingCount; i++) {
        const service = services[Math.floor(Math.random() * services.length)];
        const baseDate = new Date();
        
        // Mix of past, present, and future dates
        const dayOffset = (Math.random() - 0.5) * 60; // -30 to +30 days
        baseDate.setDate(baseDate.getDate() + dayOffset);
        
        const bookingEntry = {
          customerId: customer.id,
          bookingDate: baseDate,
          timeSlot: timeSlots[Math.floor(Math.random() * timeSlots.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          visitReason: visitReasons[Math.floor(Math.random() * visitReasons.length)],
          serviceDetails: service.name,
          price: service.price,
          duration: service.duration,
          reminderSent: Math.random() > 0.5,
          notes: i === 0 ? `Customer prefers ${service.name} style. Regular booking.` : null
        };

        await db.insert(bookings).values(bookingEntry);
        totalBookingsCreated++;
      }
    }

    console.log(`✅ Successfully created ${totalBookingsCreated} booking entries`);
    console.log(`📊 Average ${(totalBookingsCreated / allCustomers.length).toFixed(1)} bookings per customer`);
    
    return { success: true, totalBookings: totalBookingsCreated, customers: allCustomers.length };
    
  } catch (error) {
    console.error('❌ Error creating booking data:', error);
    throw error;
  }
}

// Create booking history display function
export async function getCustomerBookingHistory(customerPhone: string) {
  try {
    const customer = await db.select().from(customers).where(eq(customers.phoneNumber, customerPhone)).limit(1);
    
    if (customer.length === 0) {
      return { error: 'Customer not found' };
    }

    const customerBookings = await db
      .select({
        id: bookings.id,
        bookingDate: bookings.bookingDate,
        timeSlot: bookings.timeSlot,
        status: bookings.status,
        visitReason: bookings.visitReason,
        serviceDetails: bookings.serviceDetails,
        price: bookings.price,
        duration: bookings.duration,
        notes: bookings.notes,
        createdAt: bookings.createdAt
      })
      .from(bookings)
      .where(eq(bookings.customerId, customer[0].id))
      .orderBy(bookings.bookingDate);

    return {
      customer: customer[0],
      bookings: customerBookings,
      totalBookings: customerBookings.length
    };
  } catch (error) {
    console.error('Error fetching customer booking history:', error);
    throw error;
  }
}
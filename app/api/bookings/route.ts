import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')

    let query = supabase
      .from('bookings')
      .select(`
        *,
        customers!bookings_customer_id_fkey (
          id, phone, first_name, last_name, email
        ),
        services!bookings_service_id_fkey (
          id, name, description, duration, price
        )
      `)

    if (date) {
      query = query.eq('appointment_date', date)
    }

    const { data: bookings, error } = await query
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    // Transform to match frontend interface
    const formattedBookings = bookings.map((booking: any) => ({
      id: booking.id,
      customerId: booking.customer_id,
      serviceId: booking.service_id,
      technicianName: booking.technician_name,
      appointmentDate: booking.appointment_date,
      appointmentTime: booking.appointment_time,
      duration: booking.duration,
      status: booking.status,
      price: booking.price,
      notes: booking.notes,
      createdByAdminId: booking.created_by_admin_id,
      createdAt: booking.created_at,
      updatedByAdminId: booking.updated_by_admin_id,
      updatedAt: booking.updated_at,
      customer: booking.customers ? {
        id: booking.customers.id,
        phone: booking.customers.phone,
        firstName: booking.customers.first_name,
        lastName: booking.customers.last_name,
        email: booking.customers.email
      } : undefined,
      service: booking.services ? {
        id: booking.services.id,
        name: booking.services.name,
        description: booking.services.description,
        duration: booking.services.duration,
        price: booking.services.price
      } : undefined
    }))

    return NextResponse.json(formattedBookings)
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customerId, serviceId, technicianName, appointmentDate, appointmentTime, notes } = await request.json()

    if (!customerId || !serviceId || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'Customer, service, date, and time are required' },
        { status: 400 }
      )
    }

    // For now, we'll use a mock admin ID. In a real app, this would come from the authenticated user
    const mockAdminId = 'mock-admin-id'

    // Insert new booking
    const { data: newBooking, error } = await supabase
      .from('bookings')
      .insert([{
        customer_id: customerId,
        service_id: serviceId,
        technician_name: technicianName,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        notes,
        created_by_admin_id: mockAdminId,
        updated_by_admin_id: mockAdminId,
        status: 'scheduled'
      }])
      .select(`
        *,
        customers!bookings_customer_id_fkey (
          id, phone, first_name, last_name, email
        ),
        services!bookings_service_id_fkey (
          id, name, description, duration, price
        )
      `)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    // Transform to match frontend interface
    const formattedBooking = {
      id: newBooking.id,
      customerId: newBooking.customer_id,
      serviceId: newBooking.service_id,
      technicianName: newBooking.technician_name,
      appointmentDate: newBooking.appointment_date,
      appointmentTime: newBooking.appointment_time,
      duration: newBooking.duration,
      status: newBooking.status,
      price: newBooking.price,
      notes: newBooking.notes,
      createdByAdminId: newBooking.created_by_admin_id,
      createdAt: newBooking.created_at,
      updatedByAdminId: newBooking.updated_by_admin_id,
      updatedAt: newBooking.updated_at,
      customer: newBooking.customers ? {
        id: newBooking.customers.id,
        phone: newBooking.customers.phone,
        firstName: newBooking.customers.first_name,
        lastName: newBooking.customers.last_name,
        email: newBooking.customers.email
      } : undefined,
      service: newBooking.services ? {
        id: newBooking.services.id,
        name: newBooking.services.name,
        description: newBooking.services.description,
        duration: newBooking.services.duration,
        price: newBooking.services.price
      } : undefined
    }

    return NextResponse.json(formattedBooking, { status: 201 })
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
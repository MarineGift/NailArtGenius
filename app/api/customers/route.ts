import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch customers' },
        { status: 500 }
      )
    }

    // Transform to match frontend interface
    const formattedCustomers = customers.map((customer: any) => ({
      id: customer.id,
      phone: customer.phone,
      firstName: customer.first_name,
      lastName: customer.last_name,
      email: customer.email,
      dateOfBirth: customer.date_of_birth,
      address: customer.address,
      notes: customer.notes,
      preferredTechnician: customer.preferred_technician,
      createdAt: customer.created_at,
      updatedAt: customer.updated_at
    }))

    return NextResponse.json(formattedCustomers)
  } catch (error) {
    console.error('Get customers error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { phone, firstName, lastName, email, dateOfBirth, address, notes, preferredTechnician } = await request.json()

    if (!phone || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Phone, first name, and last name are required' },
        { status: 400 }
      )
    }

    // Insert new customer
    const { data: newCustomer, error } = await supabase
      .from('customers')
      .insert([{
        phone,
        first_name: firstName,
        last_name: lastName,
        email,
        date_of_birth: dateOfBirth,
        address,
        notes,
        preferred_technician: preferredTechnician
      }])
      .select('*')
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'Phone number already exists' },
          { status: 400 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      )
    }

    // Transform to match frontend interface
    const formattedCustomer = {
      id: newCustomer.id,
      phone: newCustomer.phone,
      firstName: newCustomer.first_name,
      lastName: newCustomer.last_name,
      email: newCustomer.email,
      dateOfBirth: newCustomer.date_of_birth,
      address: newCustomer.address,
      notes: newCustomer.notes,
      preferredTechnician: newCustomer.preferred_technician,
      createdAt: newCustomer.created_at,
      updatedAt: newCustomer.updated_at
    }

    return NextResponse.json(formattedCustomer, { status: 201 })
  } catch (error) {
    console.error('Create customer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
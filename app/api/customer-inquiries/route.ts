import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('customer_inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching customer inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer inquiries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('customer_inquiries')
      .insert([{
        name: body.name,
        email: body.email,
        phone: body.phone,
        subject: body.subject,
        message: body.message,
        status: body.status || 'pending'
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating customer inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to create customer inquiry' },
      { status: 500 }
    )
  }
}
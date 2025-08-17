import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const id = params.id

    const { data, error } = await supabase
      .from('customer_inquiries')
      .update({
        status: body.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating customer inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to update customer inquiry' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const { error } = await supabase
      .from('customer_inquiries')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting customer inquiry:', error)
    return NextResponse.json(
      { error: 'Failed to delete customer inquiry' },
      { status: 500 }
    )
  }
}
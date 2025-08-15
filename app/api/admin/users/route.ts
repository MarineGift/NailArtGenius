import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select('id, email, first_name, last_name, phone, role, permissions, is_active, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch admin users' },
        { status: 500 }
      )
    }

    // Transform to match frontend interface
    const formattedUsers = adminUsers.map((user: any) => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      permissions: user.permissions || [],
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error('Get admin users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, role, permissions } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      )
    }

    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Insert new admin user
    const { data: newUser, error } = await supabase
      .from('admin_users')
      .insert([{
        email,
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        phone,
        role: role || 'editor',
        permissions: permissions || [],
        is_active: true
      }])
      .select('id, email, first_name, last_name, phone, role, permissions, is_active, created_at, updated_at')
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create admin user' },
        { status: 500 }
      )
    }

    // Transform to match frontend interface
    const formattedUser = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      phone: newUser.phone,
      role: newUser.role,
      permissions: newUser.permissions || [],
      isActive: newUser.is_active,
      createdAt: newUser.created_at,
      updatedAt: newUser.updated_at
    }

    return NextResponse.json(formattedUser, { status: 201 })
  } catch (error) {
    console.error('Create admin user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
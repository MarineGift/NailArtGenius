import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Try to get user profile from admin_users table
    const { data: profile } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single()

    // Return user data with profile if available, otherwise use defaults
    const userData = {
      id: user.id,
      email: user.email!,
      firstName: profile?.first_name || 'Admin',
      lastName: profile?.last_name || 'User',
      role: profile?.role || 'super_admin',
      department: profile?.department || 'Management',
      permissions: profile?.permissions || ['all']
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }

    if (data.user) {
      // Get user profile
      const { data: profile } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single()

      const user = {
        id: data.user.id,
        email: data.user.email!,
        firstName: profile?.first_name || 'Admin',
        lastName: profile?.last_name || 'User',
        role: profile?.role || 'super_admin',
        department: profile?.department || 'Management',
        permissions: profile?.permissions || ['all']
      }
      
      return NextResponse.json({ success: true, user })
    }
    
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, error: 'Authentication error' }, { status: 500 })
  }
}
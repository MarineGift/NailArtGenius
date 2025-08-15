import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

export interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: string
  department?: string
  permissions?: string[]
}

// Client-side authentication
export async function signIn(email: string, password: string): Promise<AuthUser | null> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    if (data.user) {
      // Fetch user profile from admin_users table
      const { data: profile, error: profileError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single()

      if (profileError) {
        // If no profile found, create a mock admin user for demo
        return {
          id: data.user.id,
          email: data.user.email!,
          firstName: 'Admin',
          lastName: 'User',
          role: 'super_admin',
          department: 'Management',
          permissions: ['all']
        }
      }

      return {
        id: data.user.id,
        email: data.user.email!,
        firstName: profile.first_name,
        lastName: profile.last_name,
        role: profile.role,
        department: profile.department,
        permissions: profile.permissions || []
      }
    }

    return null
  } catch (error) {
    console.error('Sign in error:', error)
    return null
  }
}

export async function signOut(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) return null

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single()

    if (profileError) {
      // Return mock admin user for demo
      return {
        id: user.id,
        email: user.email!,
        firstName: 'Admin',
        lastName: 'User',
        role: 'super_admin',
        department: 'Management',
        permissions: ['all']
      }
    }

    return {
      id: user.id,
      email: user.email!,
      firstName: profile.first_name,
      lastName: profile.last_name,
      role: profile.role,
      department: profile.department,
      permissions: profile.permissions || []
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// Server-side authentication
export async function getServerUser(): Promise<AuthUser | null> {
  const supabase = createServerClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) return null

    const { data: profile, error: profileError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single()

    if (profileError) {
      return {
        id: user.id,
        email: user.email!,
        firstName: 'Admin',
        lastName: 'User',
        role: 'super_admin',
        department: 'Management',
        permissions: ['all']
      }
    }

    return {
      id: user.id,
      email: user.email!,
      firstName: profile.first_name,
      lastName: profile.last_name,
      role: profile.role,
      department: profile.department,
      permissions: profile.permissions || []
    }
  } catch (error) {
    console.error('Get server user error:', error)
    return null
  }
}

// Permission helper functions
export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user) return false
  return user.permissions?.includes('all') || user.permissions?.includes(permission) || false
}

export function canManageAdmins(user: AuthUser | null): boolean {
  return hasPermission(user, 'manage_admins') || user?.role === 'super_admin'
}

export function canManageBookings(user: AuthUser | null): boolean {
  return hasPermission(user, 'manage_bookings') || ['super_admin', 'admin'].includes(user?.role || '')
}

// Mock admin management functions for demo
export async function getAdminUsers(): Promise<any[]> {
  return [
    {
      id: '1',
      email: 'admin@connienail.com',
      first_name: 'ConnieNail',
      last_name: 'Admin',
      role: 'super_admin',
      department: 'Management',
      created_at: '2024-08-15'
    }
  ]
}

export async function createAdmin(adminData: any): Promise<any> {
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...adminData,
    created_at: new Date().toISOString()
  }
}
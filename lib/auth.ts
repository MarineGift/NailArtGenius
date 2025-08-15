// ConnieNail Admin Authentication System
import { AdminUser } from './types'
import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

export interface AuthUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  permissions: string[]
  isActive: boolean
}

// Convert AdminUser to AuthUser format
function formatAuthUser(adminUser: AdminUser): AuthUser {
  return {
    id: adminUser.id,
    email: adminUser.email,
    firstName: adminUser.firstName,
    lastName: adminUser.lastName,
    role: adminUser.role,
    permissions: adminUser.permissions,
    isActive: adminUser.isActive
  }
}

export async function signIn(email: string, password: string): Promise<AuthUser | null> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    if (data.user) {
      // Store session in localStorage
      localStorage.setItem('admin_session', JSON.stringify(data.user))
      return data.user
    }
    
    return null
  } catch (error) {
    console.error('Sign in error:', error)
    return null
  }
}

export async function signOut(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST'
    })
  } catch (error) {
    console.error('Sign out error:', error)
  } finally {
    localStorage.removeItem('admin_session')
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // First check localStorage
    const session = localStorage.getItem('admin_session')
    if (session) {
      const user = JSON.parse(session)
      // Verify session is still valid
      const response = await fetch('/api/auth/verify')
      if (response.ok) {
        return user
      } else {
        localStorage.removeItem('admin_session')
      }
    }
    return null
  } catch (error) {
    console.error('Get current user error:', error)
    localStorage.removeItem('admin_session')
    return null
  }
}

// Admin management functions
export async function createAdmin(adminData: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  role: AdminUser['role']
  permissions: string[]
}): Promise<AdminUser | null> {
  try {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData)
    })

    if (!response.ok) {
      throw new Error('Failed to create admin')
    }

    return await response.json()
  } catch (error) {
    console.error('Create admin error:', error)
    return null
  }
}

export async function updateAdmin(id: string, updates: Partial<AdminUser>): Promise<AdminUser | null> {
  try {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    })

    if (!response.ok) {
      throw new Error('Failed to update admin')
    }

    return await response.json()
  } catch (error) {
    console.error('Update admin error:', error)
    return null
  }
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const response = await fetch('/api/admin/users')
    if (!response.ok) {
      throw new Error('Failed to fetch admin users')
    }
    return await response.json()
  } catch (error) {
    console.error('Get admin users error:', error)
    return []
  }
}

// Permission checking helpers
export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user || !user.isActive) return false
  
  if (user.role === 'super_admin') return true
  
  return user.permissions.includes(permission) || user.permissions.includes('all')
}

export function canManageAdmins(user: AuthUser | null): boolean {
  return hasPermission(user, 'manage_admins') || user?.role === 'super_admin'
}

export function canManageBookings(user: AuthUser | null): boolean {
  return hasPermission(user, 'manage_bookings') || ['super_admin', 'admin'].includes(user?.role || '')
}

export function canViewReports(user: AuthUser | null): boolean {
  return hasPermission(user, 'view_reports') || ['super_admin', 'admin'].includes(user?.role || '')
}
// Simple admin authentication for demo purposes
// In production, you would integrate with Supabase Auth properly

export interface AuthUser {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'editor'
}

// Mock authentication for demo - replace with real Supabase auth
const DEMO_ADMIN = {
  email: 'admin@kictgroup.com',
  password: 'admin123',
  user: {
    id: '1',
    email: 'admin@kictgroup.com',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as const
  }
}

export async function signIn(email: string, password: string): Promise<AuthUser | null> {
  try {
    // Demo authentication - replace with real Supabase auth
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      // Store in localStorage for demo
      localStorage.setItem('admin_session', JSON.stringify(DEMO_ADMIN.user))
      return DEMO_ADMIN.user
    }
    return null
  } catch (error) {
    console.error('Sign in error:', error)
    return null
  }
}

export async function signOut(): Promise<void> {
  localStorage.removeItem('admin_session')
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const session = localStorage.getItem('admin_session')
    if (session) {
      return JSON.parse(session)
    }
    return null
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}
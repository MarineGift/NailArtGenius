import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Mock authentication response for ConnieNail system
  const mockUser = {
    id: '1',
    email: 'admin@connienail.com',
    firstName: 'ConnieNail',
    lastName: 'Admin',
    role: 'super_admin',
    department: 'Management',
    permissions: ['all']
  }

  return NextResponse.json(mockUser)
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    // Mock authentication logic
    if (email === 'admin@connienail.com' && password === 'admin123') {
      const user = {
        id: '1',
        email: 'admin@connienail.com',
        firstName: 'ConnieNail',
        lastName: 'Admin',
        role: 'super_admin',
        department: 'Management',
        permissions: ['all']
      }
      
      return NextResponse.json({ success: true, user })
    }
    
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Authentication error' }, { status: 500 })
  }
}
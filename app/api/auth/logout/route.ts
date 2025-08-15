import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // In a real application, you would invalidate the session on the server
    // For now, we just return success and let the client handle localStorage removal
    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
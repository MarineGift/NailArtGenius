import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // In a real application, you would verify the JWT token here
    // For now, we just return success to indicate the session is valid
    return NextResponse.json({ message: 'Session valid' })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    )
  }
}
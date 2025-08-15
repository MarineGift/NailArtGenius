import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Mock services data for ConnieNail with 2024 nail trends
  const mockServices = [
    {
      id: '1',
      name: 'Chrome Glass Nails',
      category: 'premium',
      price: 85000,
      duration: 120,
      description: '2024년 트렌드 크롬 글래스 네일 - 미러 효과',
      image: null
    },
    {
      id: '2', 
      name: '3D Nail Art',
      category: 'luxury',
      price: 120000,
      duration: 180,
      description: '3차원 네일 아트 - 럭셔리 디자인',
      image: null
    },
    {
      id: '3',
      name: 'Aura Gradient Nails',
      category: 'premium',
      price: 75000,
      duration: 90,
      description: '오라 그라데이션 - 몽환적 색감',
      image: null
    },
    {
      id: '4',
      name: 'Classic French',
      category: 'basic',
      price: 45000,
      duration: 60,
      description: '클래식 프렌치 매니큐어',
      image: null
    }
  ]

  return NextResponse.json(mockServices)
}

export async function POST(request: NextRequest) {
  try {
    const serviceData = await request.json()
    
    // Mock service creation
    const newService = {
      id: Math.random().toString(36).substr(2, 9),
      ...serviceData,
      created_at: new Date().toISOString()
    }
    
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Service creation failed' }, { status: 500 })
  }
}
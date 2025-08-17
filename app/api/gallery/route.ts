import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '12')

  // Mock gallery data for ConnieNail with 2024 nail trends
  const mockGallery = [
    {
      id: '1',
      title: 'Chrome Glass Nails Collection',
      description: '미러 효과 크롬 글래스 네일 - 2024 트렌드',
      image_url: '/api/placeholder/nail-chrome-glass.jpg',
      category: 'premium',
      tags: ['chrome', 'glass', 'mirror', '2024'],
      created_at: '2024-08-15'
    },
    {
      id: '2',
      title: '3D Butterfly Nail Art',
      description: '3차원 나비 네일 아트 - 럭셔리 디자인',
      image_url: '/api/placeholder/nail-3d-butterfly.jpg', 
      category: 'luxury',
      tags: ['3d', 'butterfly', 'luxury', 'art'],
      created_at: '2024-08-14'
    },
    {
      id: '3',
      title: 'Aura Gradient Dreams',
      description: '몽환적 오라 그라데이션 네일',
      image_url: '/api/placeholder/nail-aura-gradient.jpg',
      category: 'premium', 
      tags: ['aura', 'gradient', 'dreamy', 'pastel'],
      created_at: '2024-08-13'
    },
    {
      id: '4',
      title: 'Minimalist Gel Polish',
      description: '미니멀 젤 폴리시 - 클린 룩',
      image_url: '/api/placeholder/nail-minimalist.jpg',
      category: 'basic',
      tags: ['minimalist', 'gel', 'clean', 'simple'],
      created_at: '2024-08-12'
    }
  ]

  // Simulate pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = mockGallery.slice(startIndex, endIndex)

  return NextResponse.json({
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: mockGallery.length,
      totalPages: Math.ceil(mockGallery.length / limit)
    }
  })
}
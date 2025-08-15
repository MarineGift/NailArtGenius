export interface CustomerInquiry {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: 'pending' | 'responded' | 'resolved'
  createdAt: string
  updatedAt: string
}

export interface GalleryItem {
  id: number
  title: string
  description: string | null
  imageUrl: string
  category: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface NewsItem {
  id: number
  title: string
  summary: string | null
  content: string
  author: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminUser {
  id: number
  username: string
  email: string
  firstName: string | null
  lastName: string | null
  role: 'admin' | 'editor'
  createdAt: string
  updatedAt: string
}

export interface EmailTemplate {
  id: number
  name: string
  subject: string
  body: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface SmsTemplate {
  id: number
  name: string
  message: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}
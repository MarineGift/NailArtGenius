export const apiEndpoints = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    user: '/api/auth/user'
  },
  contact: {
    send: '/api/contact/send'
  },
  booking: {
    create: '/api/booking/create',
    list: '/api/booking/list',
    update: '/api/booking/update',
    delete: '/api/booking/delete'
  },
  services: {
    list: '/api/services/list',
    detail: '/api/services/detail'
  },
  gallery: {
    list: '/api/gallery/list'
  },
  ai: {
    generate: '/api/ai/generate',
    analyze: '/api/ai/analyze'
  }
}

export const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
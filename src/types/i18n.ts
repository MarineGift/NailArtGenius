export type Locale = 'ko' | 'en' | 'ja' | 'es'

export interface Dictionary {
  site: {
    title: string
    description: string
  }
  navigation: {
    home: string
    services: string
    about: string
    contact: string
    booking: string
  }
  hero: {
    title: string
    subtitle: string
    cta: string
  }
  services: {
    title: string
    subtitle: string
    manicure: {
      title: string
      description: string
    }
    pedicure: {
      title: string
      description: string
    }
    gelPolish: {
      title: string
      description: string
    }
    nailArt: {
      title: string
      description: string
    }
  }
  ai: {
    title: string
    subtitle: string
    feature1: {
      title: string
      description: string
    }
    feature2: {
      title: string
      description: string
    }
    feature3: {
      title: string
      description: string
    }
  }
  booking: {
    title: string
    subtitle: string
    cta: string
  }
  footer: {
    description: string
    contact: {
      title: string
      phone: string
      email: string
      address: string
    }
    social: {
      title: string
    }
    copyright: string
  }
}
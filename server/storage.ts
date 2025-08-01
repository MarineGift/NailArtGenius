// Storage interface and implementation for the nail salon application
import type {
  User,
  Service,
  Booking,
  ContactMessage,
  InsertUser,
  InsertService,
  InsertBooking,
  InsertContactMessage,
} from '../shared/schema.js';

// Storage interface
export interface IStorage {
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;

  // Services
  createService(service: InsertService): Promise<Service>;
  getServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  getServiceById(id: string): Promise<Service | null>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;

  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByUserId(userId: string): Promise<Booking[]>;
  getBookingById(id: string): Promise<Booking | null>;
  updateBookingStatus(id: string, status: string): Promise<Booking>;

  // Contact messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  markMessageAsRead(id: string): Promise<ContactMessage>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: User[] = [];
  private services: Service[] = [];
  private bookings: Booking[] = [];
  private contactMessages: ContactMessage[] = [];

  constructor() {
    // Initialize with sample services
    this.services = [
      {
        id: 'service-1',
        name: 'Classic Manicure',
        description: 'Traditional nail care with polish',
        duration: 45,
        price: 3000, // 30.00 in cents
        category: 'manicure',
        isActive: true,
      },
      {
        id: 'service-2',
        name: 'Gel Manicure',
        description: 'Long-lasting gel polish application',
        duration: 60,
        price: 5000, // 50.00 in cents
        category: 'manicure',
        isActive: true,
      },
      {
        id: 'service-3',
        name: 'Nail Art Design',
        description: 'Custom nail art with AI suggestions',
        duration: 90,
        price: 8000, // 80.00 in cents
        category: 'nail-art',
        isActive: true,
      },
    ];
  }

  // Users
  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: `user-${Date.now()}`,
      ...userData,
      phone: userData.phone ?? null,
      preferredLanguage: userData.preferredLanguage ?? null,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  // Services
  async createService(serviceData: InsertService): Promise<Service> {
    const service: Service = {
      id: `service-${Date.now()}`,
      ...serviceData,
      description: serviceData.description ?? null,
      isActive: serviceData.isActive ?? null,
    };
    this.services.push(service);
    return service;
  }

  async getServices(): Promise<Service[]> {
    return this.services;
  }

  async getActiveServices(): Promise<Service[]> {
    return this.services.filter(service => service.isActive);
  }

  async getServiceById(id: string): Promise<Service | null> {
    return this.services.find(service => service.id === id) || null;
  }

  async updateService(id: string, serviceData: Partial<InsertService>): Promise<Service> {
    const index = this.services.findIndex(service => service.id === id);
    if (index === -1) {
      throw new Error('Service not found');
    }
    
    this.services[index] = { ...this.services[index], ...serviceData };
    return this.services[index];
  }

  // Bookings
  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const booking: Booking = {
      id: `booking-${Date.now()}`,
      ...bookingData,
      userId: bookingData.userId ?? null,
      serviceId: bookingData.serviceId ?? null,
      status: bookingData.status ?? null,
      notes: bookingData.notes ?? null,
      createdAt: new Date(),
    };
    this.bookings.push(booking);
    return booking;
  }

  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    return this.bookings.filter(booking => booking.userId === userId);
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return this.bookings.find(booking => booking.id === id) || null;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const index = this.bookings.findIndex(booking => booking.id === id);
    if (index === -1) {
      throw new Error('Booking not found');
    }
    
    this.bookings[index].status = status;
    return this.bookings[index];
  }

  // Contact messages
  async createContactMessage(messageData: InsertContactMessage): Promise<ContactMessage> {
    const message: ContactMessage = {
      id: `message-${Date.now()}`,
      ...messageData,
      phone: messageData.phone ?? null,
      isRead: false,
      createdAt: new Date(),
    };
    this.contactMessages.push(message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return this.contactMessages.sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async markMessageAsRead(id: string): Promise<ContactMessage> {
    const index = this.contactMessages.findIndex(message => message.id === id);
    if (index === -1) {
      throw new Error('Message not found');
    }
    
    this.contactMessages[index].isRead = true;
    return this.contactMessages[index];
  }
}

// Export storage instance
export const storage = new MemStorage();
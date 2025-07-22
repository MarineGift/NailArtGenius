import {
  users,
  customers,
  customerPhotos,
  aiGeneratedNails,
  nailDesigns,
  orders,
  appointments,
  services,
  operatingHours,
  timeSlotAvailability,
  adminUsers,
  userStylePreferences,
  customNailDesigns,
  userActivities,
  designInteractions,
  userBehaviorAnalytics,
  type User,
  type UpsertUser,
  type Customer,
  type InsertCustomer,
  type CustomerPhoto,
  type InsertCustomerPhoto,
  type AiGeneratedNail,
  type InsertAiGeneratedNail,
  type NailDesign,
  type InsertNailDesign,
  type Order,
  type InsertOrder,
  type Appointment,
  type InsertAppointment,
  type Service,
  type InsertService,
  type OperatingHours,
  type InsertOperatingHours,
  type TimeSlotAvailability,
  type InsertTimeSlotAvailability,
  type AdminUser,
  type InsertAdminUser,
  type UserStylePreferences,
  type InsertUserStylePreferences,
  type CustomNailDesign,
  type InsertCustomNailDesign,
  type UserActivity,
  type InsertUserActivity,
  type DesignInteraction,
  type InsertDesignInteraction,
  type UserBehaviorAnalytics,
  type InsertUserBehaviorAnalytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Customer photos operations
  saveCustomerPhoto(photo: InsertCustomerPhoto): Promise<CustomerPhoto>;
  getCustomerPhotos(userId: string, sessionId?: string): Promise<CustomerPhoto[]>;
  
  // AI generated nails operations
  saveAiGeneratedNail(nail: InsertAiGeneratedNail): Promise<AiGeneratedNail>;
  getAiGeneratedNails(userId: string, sessionId: string): Promise<AiGeneratedNail[]>;
  
  // Nail designs operations
  getNailDesigns(category?: string): Promise<NailDesign[]>;
  getNailDesign(id: number): Promise<NailDesign | undefined>;
  createNailDesign(design: InsertNailDesign): Promise<NailDesign>;
  
  // Orders operations
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<Order>): Promise<Order>;
  getUserOrders(userId: string): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  
  // Customer operations
  upsertCustomer(customer: InsertCustomer): Promise<Customer>;
  getCustomerByPhone(phoneNumber: string): Promise<Customer | undefined>;
  
  // Appointments operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  getBookedSlotsByDate(date: Date): Promise<string[]>;
  getAppointmentByDateAndTime(date: string, timeSlot: string): Promise<Appointment | undefined>;
  getAppointmentsByPeriod(period: string, date: string, view: string): Promise<any[]>;
  getUserAppointments(userId: string): Promise<Appointment[]>;
  
  // Services operations
  getAllServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  
  // Availability operations
  getAvailableTimeSlots(date: Date, serviceId?: number): Promise<string[]>;
  isTimeSlotAvailable(date: Date, timeSlot: string): Promise<boolean>;
  getOperatingHours(dayOfWeek: number): Promise<OperatingHours | undefined>;
  
  // Admin operations
  createAdminUser(admin: InsertAdminUser): Promise<AdminUser>;
  isUserAdmin(userId: string): Promise<boolean>;
  getAllAppointments(date?: Date): Promise<Appointment[]>;
  getAllOrders(): Promise<Order[]>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  deleteAppointment(id: number): Promise<void>;

  // Style preferences operations
  upsertUserStylePreferences(preferences: InsertUserStylePreferences): Promise<UserStylePreferences>;
  getUserStylePreferences(userId: string): Promise<UserStylePreferences | undefined>;
  
  // Custom nail designs operations
  createCustomNailDesign(design: InsertCustomNailDesign): Promise<CustomNailDesign>;
  getUserCustomNailDesigns(userId: string): Promise<CustomNailDesign[]>;
  getCustomNailDesign(id: number): Promise<CustomNailDesign | undefined>;
  updateCustomNailDesign(id: number, updates: Partial<CustomNailDesign>): Promise<CustomNailDesign>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Customer photos operations
  async saveCustomerPhoto(photo: InsertCustomerPhoto): Promise<CustomerPhoto> {
    const [savedPhoto] = await db
      .insert(customerPhotos)
      .values(photo)
      .returning();
    return savedPhoto;
  }

  async getCustomerPhotos(userId: string, sessionId?: string): Promise<CustomerPhoto[]> {
    let query = db.select().from(customerPhotos).where(eq(customerPhotos.userId, userId));
    return await query.orderBy(desc(customerPhotos.uploadedAt));
  }

  // AI generated nails operations
  async saveAiGeneratedNail(nail: InsertAiGeneratedNail): Promise<AiGeneratedNail> {
    const [savedNail] = await db
      .insert(aiGeneratedNails)
      .values(nail)
      .returning();
    return savedNail;
  }

  async getAiGeneratedNails(userId: string, sessionId: string): Promise<AiGeneratedNail[]> {
    return await db
      .select()
      .from(aiGeneratedNails)
      .where(eq(aiGeneratedNails.userId, userId))
      .orderBy(desc(aiGeneratedNails.createdAt));
  }

  // Nail designs operations
  async getNailDesigns(category?: string): Promise<NailDesign[]> {
    if (category && category !== 'all') {
      return await db
        .select()
        .from(nailDesigns)
        .where(eq(nailDesigns.category, category))
        .orderBy(desc(nailDesigns.createdAt));
    }
    return await db
      .select()
      .from(nailDesigns)
      .orderBy(desc(nailDesigns.createdAt));
  }

  async getNailDesign(id: number): Promise<NailDesign | undefined> {
    const [design] = await db.select().from(nailDesigns).where(eq(nailDesigns.id, id));
    return design;
  }

  async createNailDesign(design: InsertNailDesign): Promise<NailDesign> {
    const [savedDesign] = await db
      .insert(nailDesigns)
      .values(design)
      .returning();
    return savedDesign;
  }

  // Orders operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [savedOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return savedOrder;
  }

  async updateOrder(id: number, updates: Partial<Order>): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  // Customer operations
  async upsertCustomer(customer: InsertCustomer): Promise<Customer> {
    const [upsertedCustomer] = await db
      .insert(customers)
      .values(customer)
      .onConflictDoUpdate({
        target: customers.phoneNumber,
        set: {
          name: customer.name,
          email: customer.email,
          visitType: customer.visitType,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedCustomer;
  }

  async getCustomerByPhone(phoneNumber: string): Promise<Customer | undefined> {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.phoneNumber, phoneNumber));
    return customer;
  }

  async getBookedSlotsByDate(date: Date): Promise<string[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await db
      .select({ timeSlot: appointments.timeSlot })
      .from(appointments)
      .where(
        and(
          gte(appointments.appointmentDate, startOfDay),
          lte(appointments.appointmentDate, endOfDay),
          eq(appointments.status, "scheduled")
        )
      );

    return bookedAppointments.map(apt => apt.timeSlot);
  }

  async getAppointmentByDateAndTime(date: string, timeSlot: string): Promise<Appointment | undefined> {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const [appointment] = await db
      .select()
      .from(appointments)
      .where(
        and(
          gte(appointments.appointmentDate, startOfDay),
          lte(appointments.appointmentDate, endOfDay),
          eq(appointments.timeSlot, timeSlot)
        )
      );
    return appointment;
  }

  async getAppointmentsByPeriod(period: string, date: string, view: string): Promise<any[]> {
    const targetDate = new Date(date);
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case 'month':
        startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
        break;
      case 'week':
        startDate = new Date(targetDate);
        startDate.setDate(targetDate.getDate() - targetDate.getDay());
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case 'day':
      default:
        startDate = new Date(targetDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(targetDate);
        endDate.setHours(23, 59, 59, 999);
        break;
    }

    const appointmentsWithCustomers = await db
      .select({
        id: appointments.id,
        appointmentDate: appointments.appointmentDate,
        timeSlot: appointments.timeSlot,
        status: appointments.status,
        visitReason: appointments.visitReason,
        notes: appointments.notes,
        customerName: customers.name,
        customerPhone: customers.phoneNumber,
        customerEmail: customers.email,
        visitType: customers.visitType,
      })
      .from(appointments)
      .innerJoin(customers, eq(appointments.customerId, customers.id))
      .where(
        and(
          gte(appointments.appointmentDate, startDate),
          lte(appointments.appointmentDate, endDate)
        )
      )
      .orderBy(appointments.appointmentDate, appointments.timeSlot);

    return appointmentsWithCustomers;
  }

  // Appointments operations
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [savedAppointment] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return savedAppointment;
  }

  async updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }

  async getUserAppointments(customerId: number): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.customerId, customerId))
      .orderBy(desc(appointments.appointmentDate));
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await db
      .select()
      .from(appointments)
      .where(and(
        gte(appointments.appointmentDate, startOfDay),
        lte(appointments.appointmentDate, endOfDay)
      ));
  }

  async getAvailableTimeSlots(date: Date): Promise<string[]> {
    const existingAppointments = await this.getAppointmentsByDate(date);
    const bookedSlots = existingAppointments.map(apt => apt.timeSlot);
    
    // Generate all possible 30-minute slots from 9:00 AM to 6:00 PM
    const allSlots: string[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (hour < 17 || (hour === 17 && minute === 0)) { // Don't include 17:30
          allSlots.push(timeSlot);
        }
      }
    }
    
    return allSlots.filter(slot => !bookedSlots.includes(slot));
  }

  // Admin operations
  async createAdminUser(admin: InsertAdminUser): Promise<AdminUser> {
    const [savedAdmin] = await db
      .insert(adminUsers)
      .values(admin)
      .returning();
    return savedAdmin;
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.userId, userId));
    return !!admin;
  }

  async getAllAppointments(date?: Date): Promise<Appointment[]> {
    if (date) {
      return this.getAppointmentsByDate(date);
    }
    
    return await db
      .select()
      .from(appointments)
      .orderBy(desc(appointments.appointmentDate));
  }

  async getAllOrders(): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
  }

  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteAppointment(id: number): Promise<void> {
    await db
      .delete(appointments)
      .where(eq(appointments.id, id));
  }

  // Style preferences operations
  async upsertUserStylePreferences(preferences: InsertUserStylePreferences): Promise<UserStylePreferences> {
    const [upsertedPreferences] = await db
      .insert(userStylePreferences)
      .values(preferences)
      .onConflictDoUpdate({
        target: userStylePreferences.userId,
        set: {
          ...preferences,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedPreferences;
  }

  async getUserStylePreferences(userId: string): Promise<UserStylePreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userStylePreferences)
      .where(eq(userStylePreferences.userId, userId));
    return preferences;
  }

  // Custom nail designs operations
  async createCustomNailDesign(design: InsertCustomNailDesign): Promise<CustomNailDesign> {
    const [savedDesign] = await db
      .insert(customNailDesigns)
      .values(design)
      .returning();
    return savedDesign;
  }

  async getUserCustomNailDesigns(userId: string): Promise<CustomNailDesign[]> {
    return await db
      .select()
      .from(customNailDesigns)
      .where(eq(customNailDesigns.userId, userId))
      .orderBy(desc(customNailDesigns.createdAt));
  }

  async getCustomNailDesign(id: number): Promise<CustomNailDesign | undefined> {
    const [design] = await db
      .select()
      .from(customNailDesigns)
      .where(eq(customNailDesigns.id, id));
    return design;
  }

  async updateCustomNailDesign(id: number, updates: Partial<CustomNailDesign>): Promise<CustomNailDesign> {
    const [updatedDesign] = await db
      .update(customNailDesigns)
      .set(updates)
      .where(eq(customNailDesigns.id, id))
      .returning();
    return updatedDesign;
  }

  // Analytics operations
  async trackUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    const [result] = await db
      .insert(userActivities)
      .values(activity)
      .returning();
    return result;
  }

  async trackDesignInteraction(interaction: InsertDesignInteraction): Promise<DesignInteraction> {
    const [result] = await db
      .insert(designInteractions)
      .values(interaction)
      .returning();
    return result;
  }

  async getUserBehaviorAnalytics(userId: string): Promise<UserBehaviorAnalytics | undefined> {
    const [result] = await db
      .select()
      .from(userBehaviorAnalytics)
      .where(eq(userBehaviorAnalytics.userId, userId));
    return result;
  }

  async getUserActivities(userId: string, limit: number = 50): Promise<UserActivity[]> {
    return await db
      .select()
      .from(userActivities)
      .where(eq(userActivities.userId, userId))
      .orderBy(desc(userActivities.createdAt))
      .limit(limit);
  }

  async getDesignInteractions(userId: string, designId?: number, customDesignId?: number): Promise<DesignInteraction[]> {
    let whereClause = eq(designInteractions.userId, userId);
    
    if (designId) {
      whereClause = and(whereClause, eq(designInteractions.designId, designId));
    }
    if (customDesignId) {
      whereClause = and(whereClause, eq(designInteractions.customDesignId, customDesignId));
    }

    return await db
      .select()
      .from(designInteractions)
      .where(whereClause)
      .orderBy(desc(designInteractions.createdAt));
  }

  async getUserEngagementMetrics(userId: string) {
    const activities = await this.getUserActivities(userId, 100);
    const behaviorAnalytics = await this.getUserBehaviorAnalytics(userId);
    
    return {
      totalActivities: activities.length,
      behaviorAnalytics,
      recentActivities: activities.slice(0, 10),
    };
  }

  // Services operations
  async getAllServices(): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(services.displayOrder);
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(and(eq(services.category, category), eq(services.isActive, true)))
      .orderBy(services.displayOrder);
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id));
    return service;
  }

  // Availability operations
  async getAvailableTimeSlots(date: Date, serviceId?: number): Promise<string[]> {
    const dayOfWeek = date.getDay();
    
    // Get operating hours for the day
    const [operatingHour] = await db
      .select()
      .from(operatingHours)
      .where(and(eq(operatingHours.dayOfWeek, dayOfWeek), eq(operatingHours.isOpen, true)));

    if (!operatingHour) {
      return []; // Salon is closed
    }

    // Generate time slots (30-minute intervals)
    const timeSlots: string[] = [];
    const openTime = operatingHour.openTime;
    const closeTime = operatingHour.closeTime;
    
    // Convert time strings to minutes
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    // Generate 30-minute slots
    for (let minutes = openMinutes; minutes < closeMinutes; minutes += 30) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const timeSlot = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      
      // Skip lunch break if exists
      if (operatingHour.breakStartTime && operatingHour.breakEndTime) {
        const [breakStartHour, breakStartMin] = operatingHour.breakStartTime.split(':').map(Number);
        const [breakEndHour, breakEndMin] = operatingHour.breakEndTime.split(':').map(Number);
        const breakStartMinutes = breakStartHour * 60 + breakStartMin;
        const breakEndMinutes = breakEndHour * 60 + breakEndMin;
        
        if (minutes >= breakStartMinutes && minutes < breakEndMinutes) {
          continue;
        }
      }
      
      timeSlots.push(timeSlot);
    }

    // Get booked slots for this date
    const bookedSlots = await this.getBookedSlotsByDate(date);
    
    // Filter out booked slots
    return timeSlots.filter(slot => !bookedSlots.includes(slot));
  }

  async isTimeSlotAvailable(date: Date, timeSlot: string): Promise<boolean> {
    const bookedSlots = await this.getBookedSlotsByDate(date);
    return !bookedSlots.includes(timeSlot);
  }

  async getOperatingHours(dayOfWeek: number): Promise<OperatingHours | undefined> {
    const [hours] = await db
      .select()
      .from(operatingHours)
      .where(eq(operatingHours.dayOfWeek, dayOfWeek));
    return hours;
  }

  async getUserAppointments(userId: string): Promise<Appointment[]> {
    // First get user's customer records
    const user = await this.getUser(userId);
    if (!user) return [];

    // Find customer by phone number if available
    let customer;
    if (user.phoneNumber) {
      customer = await this.getCustomerByPhone(user.phoneNumber);
    }

    if (!customer) return [];

    // Get appointments for this customer
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.customerId, customer.id))
      .orderBy(desc(appointments.appointmentDate));
  }
}

export const storage = new DatabaseStorage();

// Additional Customer Methods for Enhanced Admin Panel
export class EnhancedDatabaseStorage extends DatabaseStorage {
  async getAllCustomers(): Promise<Customer[]> {
    return db.select().from(customers).orderBy(customers.createdAt);
  }

  async updateCustomerCategory(customerId: number, category: string): Promise<void> {
    await db
      .update(customers)
      .set({ category, updatedAt: new Date() })
      .where(eq(customers.id, customerId));
  }

  async getCustomersByIds(customerIds: number[]): Promise<Customer[]> {
    return db.select().from(customers).where(inArray(customers.id, customerIds));
  }
}

// Use enhanced storage
export const enhancedStorage = new EnhancedDatabaseStorage();

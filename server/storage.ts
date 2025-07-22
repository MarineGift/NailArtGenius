import {
  users,
  customers,
  customerPhotos,
  aiGeneratedNails,
  nailDesigns,
  orders,
  appointments,
  adminUsers,
  userStylePreferences,
  customNailDesigns,
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
  type AdminUser,
  type InsertAdminUser,
  type UserStylePreferences,
  type InsertUserStylePreferences,
  type CustomNailDesign,
  type InsertCustomNailDesign,
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
}

export const storage = new DatabaseStorage();

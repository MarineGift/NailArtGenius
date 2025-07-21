import {
  users,
  customerPhotos,
  aiGeneratedNails,
  nailDesigns,
  orders,
  appointments,
  adminUsers,
  type User,
  type UpsertUser,
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
  
  // Appointments operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment>;
  getUserAppointments(userId: string): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  getAvailableTimeSlots(date: Date): Promise<string[]>;
  
  // Admin operations
  createAdminUser(admin: InsertAdminUser): Promise<AdminUser>;
  isUserAdmin(userId: string): Promise<boolean>;
  getAllAppointments(date?: Date): Promise<Appointment[]>;
  getAllOrders(): Promise<Order[]>;
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
    let query = db.select().from(nailDesigns).where(eq(nailDesigns.isActive, true));
    if (category && category !== 'all') {
      query = query.where(eq(nailDesigns.category, category));
    }
    return await query.orderBy(desc(nailDesigns.createdAt));
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

  async getUserAppointments(userId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
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
}

export const storage = new DatabaseStorage();

// Data model schemas for the nail salon application
import { pgTable, text, integer, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table for customer information
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  preferredLanguage: text('preferred_language').default('ko'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Services table for nail salon services
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  duration: integer('duration').notNull(), // in minutes
  price: integer('price').notNull(), // in cents
  category: text('category').notNull(),
  isActive: boolean('is_active').default(true),
});

// Bookings table for appointments
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  serviceId: uuid('service_id').references(() => services.id),
  appointmentDate: timestamp('appointment_date').notNull(),
  status: text('status').default('pending'), // pending, confirmed, cancelled, completed
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type User = typeof users.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
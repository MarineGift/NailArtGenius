import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Customer Inquiries Table
export const customerInquiries = pgTable('customer_inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('pending'), // pending, responded, closed
  createdAt: timestamp('created_at').defaultNow(),
  respondedAt: timestamp('responded_at'),
});

// Gallery Table
export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  category: text('category').notNull(), // nail-art, spa, treatment
  isPublished: boolean('is_published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// News Table
export const news = pgTable('news', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  summary: text('summary'),
  imageUrl: text('image_url'),
  author: text('author').notNull(),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  publishedAt: timestamp('published_at'),
});

// Admin Users Table
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role').notNull().default('admin'), // admin, manager
  createdAt: timestamp('created_at').defaultNow(),
});

// Email Templates Table
export const emailTemplates = pgTable('email_templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// SMS Templates Table
export const smsTemplates = pgTable('sms_templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  message: text('message').notNull(),
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Schema exports for types
export const insertCustomerInquirySchema = createInsertSchema(customerInquiries).omit({
  id: true,
  createdAt: true,
  respondedAt: true,
});

export const insertGallerySchema = createInsertSchema(gallery).omit({
  id: true,
  createdAt: true,
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
  publishedAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertSmsTemplateSchema = createInsertSchema(smsTemplates).omit({
  id: true,
  createdAt: true,
});

// Types
export type CustomerInquiry = typeof customerInquiries.$inferSelect;
export type InsertCustomerInquiry = z.infer<typeof insertCustomerInquirySchema>;

export type Gallery = typeof gallery.$inferSelect;
export type InsertGallery = z.infer<typeof insertGallerySchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;

export type SmsTemplate = typeof smsTemplates.$inferSelect;
export type InsertSmsTemplate = z.infer<typeof insertSmsTemplateSchema>;
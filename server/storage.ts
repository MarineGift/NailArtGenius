import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';
import { eq, desc, ilike, and, or } from 'drizzle-orm';
import type { 
  CustomerInquiry, 
  InsertCustomerInquiry,
  Gallery,
  InsertGallery,
  News,
  InsertNews,
  AdminUser,
  InsertAdminUser,
  EmailTemplate,
  InsertEmailTemplate,
  SmsTemplate,
  InsertSmsTemplate
} from '@shared/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export interface IStorage {
  // Customer Inquiries
  getCustomerInquiries(): Promise<CustomerInquiry[]>;
  getCustomerInquiryById(id: number): Promise<CustomerInquiry | null>;
  createCustomerInquiry(inquiry: InsertCustomerInquiry): Promise<CustomerInquiry>;
  updateCustomerInquiryStatus(id: number, status: string): Promise<CustomerInquiry | null>;
  deleteCustomerInquiry(id: number): Promise<boolean>;

  // Gallery
  getGalleryItems(): Promise<Gallery[]>;
  getGalleryItemById(id: number): Promise<Gallery | null>;
  createGalleryItem(item: InsertGallery): Promise<Gallery>;
  updateGalleryItem(id: number, item: Partial<InsertGallery>): Promise<Gallery | null>;
  deleteGalleryItem(id: number): Promise<boolean>;

  // News
  getNews(): Promise<News[]>;
  getPublishedNews(): Promise<News[]>;
  getNewsById(id: number): Promise<News | null>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, news: Partial<InsertNews>): Promise<News | null>;
  deleteNews(id: number): Promise<boolean>;
  publishNews(id: number): Promise<News | null>;

  // Admin Users
  getAdminUsers(): Promise<AdminUser[]>;
  getAdminUserById(id: number): Promise<AdminUser | null>;
  getAdminUserByUsername(username: string): Promise<AdminUser | null>;
  getAdminUserByEmail(email: string): Promise<AdminUser | null>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: number, user: Partial<InsertAdminUser>): Promise<AdminUser | null>;
  deleteAdminUser(id: number): Promise<boolean>;

  // Email Templates
  getEmailTemplates(): Promise<EmailTemplate[]>;
  getDefaultEmailTemplate(): Promise<EmailTemplate | null>;
  createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate>;
  updateEmailTemplate(id: number, template: Partial<InsertEmailTemplate>): Promise<EmailTemplate | null>;
  deleteEmailTemplate(id: number): Promise<boolean>;

  // SMS Templates
  getSmsTemplates(): Promise<SmsTemplate[]>;
  getDefaultSmsTemplate(): Promise<SmsTemplate | null>;
  createSmsTemplate(template: InsertSmsTemplate): Promise<SmsTemplate>;
  updateSmsTemplate(id: number, template: Partial<InsertSmsTemplate>): Promise<SmsTemplate | null>;
  deleteSmsTemplate(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Customer Inquiries
  async getCustomerInquiries(): Promise<CustomerInquiry[]> {
    return await db.select().from(schema.customerInquiries).orderBy(desc(schema.customerInquiries.createdAt));
  }

  async getCustomerInquiryById(id: number): Promise<CustomerInquiry | null> {
    const result = await db.select().from(schema.customerInquiries).where(eq(schema.customerInquiries.id, id));
    return result[0] || null;
  }

  async createCustomerInquiry(inquiry: InsertCustomerInquiry): Promise<CustomerInquiry> {
    const result = await db.insert(schema.customerInquiries).values(inquiry).returning();
    return result[0];
  }

  async updateCustomerInquiryStatus(id: number, status: string): Promise<CustomerInquiry | null> {
    const result = await db.update(schema.customerInquiries)
      .set({ status, respondedAt: status === 'responded' ? new Date() : null })
      .where(eq(schema.customerInquiries.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteCustomerInquiry(id: number): Promise<boolean> {
    const result = await db.delete(schema.customerInquiries).where(eq(schema.customerInquiries.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Gallery
  async getGalleryItems(): Promise<Gallery[]> {
    return await db.select().from(schema.gallery).orderBy(desc(schema.gallery.createdAt));
  }

  async getGalleryItemById(id: number): Promise<Gallery | null> {
    const result = await db.select().from(schema.gallery).where(eq(schema.gallery.id, id));
    return result[0] || null;
  }

  async createGalleryItem(item: InsertGallery): Promise<Gallery> {
    const result = await db.insert(schema.gallery).values(item).returning();
    return result[0];
  }

  async updateGalleryItem(id: number, item: Partial<InsertGallery>): Promise<Gallery | null> {
    const result = await db.update(schema.gallery)
      .set(item)
      .where(eq(schema.gallery.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteGalleryItem(id: number): Promise<boolean> {
    const result = await db.delete(schema.gallery).where(eq(schema.gallery.id, id));
    return (result.rowCount || 0) > 0;
  }

  // News
  async getNews(): Promise<News[]> {
    return await db.select().from(schema.news).orderBy(desc(schema.news.createdAt));
  }

  async getPublishedNews(): Promise<News[]> {
    return await db.select().from(schema.news)
      .where(eq(schema.news.isPublished, true))
      .orderBy(desc(schema.news.publishedAt));
  }

  async getNewsById(id: number): Promise<News | null> {
    const result = await db.select().from(schema.news).where(eq(schema.news.id, id));
    return result[0] || null;
  }

  async createNews(news: InsertNews): Promise<News> {
    const result = await db.insert(schema.news).values(news).returning();
    return result[0];
  }

  async updateNews(id: number, news: Partial<InsertNews>): Promise<News | null> {
    const result = await db.update(schema.news)
      .set(news)
      .where(eq(schema.news.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteNews(id: number): Promise<boolean> {
    const result = await db.delete(schema.news).where(eq(schema.news.id, id));
    return (result.rowCount || 0) > 0;
  }

  async publishNews(id: number): Promise<News | null> {
    const result = await db.update(schema.news)
      .set({ isPublished: true, publishedAt: new Date() })
      .where(eq(schema.news.id, id))
      .returning();
    return result[0] || null;
  }

  // Admin Users
  async getAdminUsers(): Promise<AdminUser[]> {
    return await db.select().from(schema.adminUsers).orderBy(desc(schema.adminUsers.createdAt));
  }

  async getAdminUserById(id: number): Promise<AdminUser | null> {
    const result = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, id));
    return result[0] || null;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | null> {
    const result = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.username, username));
    return result[0] || null;
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | null> {
    const result = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email));
    return result[0] || null;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const result = await db.insert(schema.adminUsers).values(user).returning();
    return result[0];
  }

  async updateAdminUser(id: number, user: Partial<InsertAdminUser>): Promise<AdminUser | null> {
    const result = await db.update(schema.adminUsers)
      .set(user)
      .where(eq(schema.adminUsers.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteAdminUser(id: number): Promise<boolean> {
    const result = await db.delete(schema.adminUsers).where(eq(schema.adminUsers.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Email Templates
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return await db.select().from(schema.emailTemplates).orderBy(desc(schema.emailTemplates.createdAt));
  }

  async getDefaultEmailTemplate(): Promise<EmailTemplate | null> {
    const result = await db.select().from(schema.emailTemplates).where(eq(schema.emailTemplates.isDefault, true));
    return result[0] || null;
  }

  async createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate> {
    const result = await db.insert(schema.emailTemplates).values(template).returning();
    return result[0];
  }

  async updateEmailTemplate(id: number, template: Partial<InsertEmailTemplate>): Promise<EmailTemplate | null> {
    const result = await db.update(schema.emailTemplates)
      .set(template)
      .where(eq(schema.emailTemplates.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteEmailTemplate(id: number): Promise<boolean> {
    const result = await db.delete(schema.emailTemplates).where(eq(schema.emailTemplates.id, id));
    return (result.rowCount || 0) > 0;
  }

  // SMS Templates
  async getSmsTemplates(): Promise<SmsTemplate[]> {
    return await db.select().from(schema.smsTemplates).orderBy(desc(schema.smsTemplates.createdAt));
  }

  async getDefaultSmsTemplate(): Promise<SmsTemplate | null> {
    const result = await db.select().from(schema.smsTemplates).where(eq(schema.smsTemplates.isDefault, true));
    return result[0] || null;
  }

  async createSmsTemplate(template: InsertSmsTemplate): Promise<SmsTemplate> {
    const result = await db.insert(schema.smsTemplates).values(template).returning();
    return result[0];
  }

  async updateSmsTemplate(id: number, template: Partial<InsertSmsTemplate>): Promise<SmsTemplate | null> {
    const result = await db.update(schema.smsTemplates)
      .set(template)
      .where(eq(schema.smsTemplates.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteSmsTemplate(id: number): Promise<boolean> {
    const result = await db.delete(schema.smsTemplates).where(eq(schema.smsTemplates.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
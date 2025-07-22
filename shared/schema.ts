import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phoneNumber: varchar("phone_number").unique(),
  password: varchar("password"),
  workplace: varchar("workplace"),
  region: varchar("region"),
  postalCode: varchar("postal_code"),
  mailingList: boolean("mailing_list").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer photos for nail analysis
export const customerPhotos = pgTable("customer_photos", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  fileName: varchar("file_name").notNull(),
  filePath: varchar("file_path").notNull(),
  photoType: varchar("photo_type").notNull(), // 'finger_position' or 'finger_curvature'
  fingerType: varchar("finger_type"), // 'thumb', 'index', 'middle', 'ring', 'pinky'
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// AI generated nail shapes
export const aiGeneratedNails = pgTable("ai_generated_nails", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").notNull(),
  fingerType: varchar("finger_type").notNull(),
  shapeData: jsonb("shape_data"), // AI analysis results
  imageUrl: varchar("image_url"), // Generated nail shape image
  createdAt: timestamp("created_at").defaultNow(),
});

// Nail designs table - catalog of available designs
export const nailDesigns = pgTable("nail_designs", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url").notNull(),
  category: varchar("category").notNull(), // "minimalist", "floral", "geometric", "seasonal", etc.
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  difficulty: varchar("difficulty").default("medium"), // easy, medium, hard
  timeRequired: integer("time_required").default(30), // minutes
  colors: text("colors").array(), // Array of color names/codes
  tags: text("tags").array(), // Array of style tags
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User style preferences for AI customization
export const userStylePreferences = pgTable("user_style_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  preferredColors: text("preferred_colors").array(), // Array of preferred colors
  preferredStyles: text("preferred_styles").array(), // Array of style preferences
  occasions: text("occasions").array(), // daily, party, wedding, business, etc.
  complexity: varchar("complexity").default("medium"), // simple, medium, complex
  budget: varchar("budget").default("medium"), // low, medium, high
  skinTone: varchar("skin_tone"), // fair, medium, tan, deep
  lifestyle: varchar("lifestyle"), // active, professional, artistic, etc.
  inspirationImages: text("inspiration_images").array(), // URLs to inspiration images
  notes: text("notes"), // Additional preference notes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI-generated custom designs
export const customNailDesigns = pgTable("custom_nail_designs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").notNull(), // Links to photo analysis session
  designPrompt: text("design_prompt").notNull(), // The AI prompt used
  generatedImageUrl: varchar("generated_image_url"), // AI-generated design image
  stylePreferencesId: integer("style_preferences_id").references(() => userStylePreferences.id),
  baseDesignId: integer("base_design_id").references(() => nailDesigns.id), // If based on existing design
  customization: jsonb("customization"), // Detailed customization data
  aiModel: varchar("ai_model").default("dalle-3"), // Which AI model was used
  generationParams: jsonb("generation_params"), // Generation parameters used
  status: varchar("status").default("generated"), // generated, approved, rejected
  price: decimal("price", { precision: 10, scale: 2 }), // Custom pricing
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  designId: integer("design_id").references(() => nailDesigns.id),
  sessionId: varchar("session_id"), // Links to AI analysis session
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paypalOrderId: varchar("paypal_order_id"),
  paymentStatus: varchar("payment_status").default("pending"), // pending, paid, failed
  printStatus: varchar("print_status").default("waiting"), // waiting, printing, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer information for visits
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  phoneNumber: varchar("phone_number").notNull().unique(),
  email: varchar("email"),
  visitType: varchar("visit_type").notNull(), // "방문예약", "최초방문", "인터넷예약"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Appointments for nail salon visits
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  appointmentDate: timestamp("appointment_date").notNull(),
  timeSlot: varchar("time_slot").notNull(), // "09:00", "09:30", "10:00", etc.
  status: varchar("status").default("scheduled"), // scheduled, completed, cancelled, no_show
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role").default("admin"), // admin, super_admin
  permissions: jsonb("permissions"), // Array of permission strings
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertCustomerPhotoSchema = createInsertSchema(customerPhotos).omit({ id: true, uploadedAt: true });
export type InsertCustomerPhoto = z.infer<typeof insertCustomerPhotoSchema>;
export type CustomerPhoto = typeof customerPhotos.$inferSelect;

export const insertAiGeneratedNailSchema = createInsertSchema(aiGeneratedNails).omit({ id: true, createdAt: true });
export type InsertAiGeneratedNail = z.infer<typeof insertAiGeneratedNailSchema>;
export type AiGeneratedNail = typeof aiGeneratedNails.$inferSelect;

export const insertNailDesignSchema = createInsertSchema(nailDesigns).omit({ id: true, createdAt: true });
export type InsertNailDesign = z.infer<typeof insertNailDesignSchema>;
export type NailDesign = typeof nailDesigns.$inferSelect;

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true, createdAt: true });
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

export const insertUserStylePreferencesSchema = createInsertSchema(userStylePreferences).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUserStylePreferences = z.infer<typeof insertUserStylePreferencesSchema>;
export type UserStylePreferences = typeof userStylePreferences.$inferSelect;

export const insertCustomNailDesignSchema = createInsertSchema(customNailDesigns).omit({ id: true, createdAt: true });
export type InsertCustomNailDesign = z.infer<typeof insertCustomNailDesignSchema>;
export type CustomNailDesign = typeof customNailDesigns.$inferSelect;

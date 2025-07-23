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
  level: varchar("level").default("Customer"), // "admin" or "Customer"
  username: varchar("username").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer photos for nail analysis with card-based measurement
export const customerPhotos = pgTable("customer_photos", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").notNull(), // Groups photos from same session
  fileName: varchar("file_name").notNull(),
  filePath: varchar("file_path").notNull(),
  photoType: varchar("photo_type").notNull(), // 'finger_with_card', 'finger_curvature', 'card_reference'
  fingerType: varchar("finger_type"), // 'thumb', 'index', 'middle', 'ring', 'pinky', 'reference_card'
  cardDetected: boolean("card_detected").default(false), // Whether card was detected for scale
  cardPixelWidth: integer("card_pixel_width"), // Card width in pixels for scale calculation
  cardPixelHeight: integer("card_pixel_height"), // Card height in pixels for scale calculation
  scaleFactor: decimal("scale_factor", { precision: 10, scale: 6 }), // mm per pixel ratio
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Customer nail images (12 images per customer)
export const customerNailImages = pgTable("customer_nail_images", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  imageIndex: integer("image_index").notNull(), // 1-12 for the 12 nail images
  fileName: varchar("file_name").notNull(),
  filePath: varchar("file_path").notNull(),
  fingerType: varchar("finger_type"), // 'thumb', 'index', 'middle', 'ring', 'pinky'
  handType: varchar("hand_type"), // 'left', 'right'
  imageUrl: varchar("image_url"),
  notes: text("notes"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Customer reservations for AI nail art
export const customerReservations = pgTable("customer_reservations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  customerPhone: varchar("customer_phone").notNull(),
  designId: integer("design_id").references(() => nailDesigns.id),
  selectedDesignName: varchar("selected_design_name"),
  appointmentDate: timestamp("appointment_date").notNull(),
  timeSlot: varchar("time_slot").notNull(),
  visitDate: timestamp("visit_date"),
  paymentStatus: varchar("payment_status").default("pending"), // pending, paid, cancelled
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }),
  reservationStatus: varchar("reservation_status").default("confirmed"), // confirmed, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI generated nail analysis with precise measurements
export const aiGeneratedNails = pgTable("ai_generated_nails", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").notNull(),
  fingerType: varchar("finger_type").notNull(),
  nailWidth: decimal("nail_width", { precision: 8, scale: 3 }), // Width in mm
  nailLength: decimal("nail_length", { precision: 8, scale: 3 }), // Length in mm
  nailCurvature: decimal("nail_curvature", { precision: 8, scale: 3 }), // Curvature radius in mm
  fingerWidth: decimal("finger_width", { precision: 8, scale: 3 }), // Finger width in mm
  fingerLength: decimal("finger_length", { precision: 8, scale: 3 }), // Finger length in mm
  shapeCategory: varchar("shape_category"), // oval, square, round, almond, coffin
  shapeData: jsonb("shape_data"), // Detailed AI analysis results
  measurementConfidence: decimal("measurement_confidence", { precision: 5, scale: 2 }), // 0-100 confidence score
  imageUrl: varchar("image_url"), // Generated nail shape visualization
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

// Customer management table 
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  visitType: varchar("visit_type").default("general_visit"), // "appointment_visit", "first_visit", "online_booking"
  category: varchar("category", { length: 20 }).default("general").notNull(), // mailing, general, booking
  mailingConsent: boolean("mailing_consent").default(false),
  totalVisits: integer("total_visits").default(0),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0"),
  lastVisit: timestamp("last_visit"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer purchase history
export const customerPurchases = pgTable("customer_purchases", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  orderId: integer("order_id").references(() => orders.id),
  serviceId: integer("service_id").references(() => services.id),
  serviceName: varchar("service_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method").default("cash"), // cash, card, paypal
  paymentStatus: varchar("payment_status").default("completed"), // pending, completed, refunded
  purchaseDate: timestamp("purchase_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// SMS templates for customer communication
export const smsTemplates = pgTable("sms_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // reminder, promotion, welcome, followup
  template: text("template").notNull(), // Message template with variables like {{name}}, {{date}}
  variables: text("variables").array(), // Available variables for template
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



// Carousel Images table for managing images displayed on the website
export const carouselImages = pgTable("carousel_images", {
  id: serial("id").primaryKey(),
  page: varchar("page").notNull(), // Which page/section this image belongs to ("main", "service")
  imagePath: varchar("image_path").notNull(), // Path to the image file
  headerText: varchar("header_text").notNull(), // Header/title text for the image
  detailedDescription: text("detailed_description"), // Detailed description of the image
  displayOrder: integer("display_order").default(0), // Order in which to display images
  isActive: boolean("is_active").default(true), // Whether the image is currently active
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gallery table for managing gallery data and images
export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(), // Gallery item title
  description: text("description"), // Gallery item description
  imagePath: varchar("image_path").notNull(), // Path to the gallery image
  category: varchar("category").notNull(), // Category: "nail_art", "spa", "treatment", "before_after"
  tags: text("tags").array(), // Array of tags for filtering
  displayOrder: integer("display_order").default(0), // Order in gallery display
  isActive: boolean("is_active").default(true), // Whether item is active
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Gallery detailed descriptions table for modal views
export const galleryDesc = pgTable("gallery_desc", {
  id: serial("id").primaryKey(),
  galleryId: integer("gallery_id").notNull().references(() => gallery.id),
  detailTitle: varchar("detail_title").notNull(), // Detailed title for modal
  detailDescription: text("detail_description").notNull(), // Full description
  technicalDetails: text("technical_details"), // Technical specifications
  duration: varchar("duration"), // Service duration if applicable
  price: varchar("price"), // Price information
  beforeAfterImages: text("before_after_images").array(), // Before/after image paths
  additionalImages: text("additional_images").array(), // Additional detail images
  tips: text("tips"), // Care tips or recommendations
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Nail Art images table - stores customer nail images and AI generated designs
export const aiNailArtImages = pgTable("ai_nail_art_images", {
  id: serial("id").primaryKey(),
  customerPhone: varchar("customer_phone").notNull(), // Customer phone number as key
  nailPosition: varchar("nail_position").notNull(), // "left_thumb", "left_index", "left_middle", "left_ring", "left_pinky", "right_thumb", "right_index", "right_middle", "right_ring", "right_pinky"
  direction: varchar("direction").notNull(), // "front", "side", "top" - nail direction/angle
  originalImagePath: varchar("original_image_path"), // Path to original nail photo
  aiGeneratedImagePath: varchar("ai_generated_image_path"), // Path to AI generated design
  designPrompt: text("design_prompt"), // AI prompt used for generation
  nailName: varchar("nail_name"), // Custom name for this nail (e.g., "Elegant Rose Design")
  sessionId: varchar("session_id"), // Groups related nail art session
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SMS automation rules
export const smsAutomationRules = pgTable("sms_automation_rules", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  trigger: varchar("trigger").notNull(), // appointment_reminder, visit_followup, loyalty_reward, birthday
  daysAfterVisit: integer("days_after_visit"),
  daysBefore: integer("days_before"),
  templateId: integer("template_id").notNull().references(() => smsTemplates.id),
  isActive: boolean("is_active").default(true),
  lastTriggered: timestamp("last_triggered"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SMS history tracking
export const smsHistory = pgTable("sms_history", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  phoneNumber: varchar("phone_number").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // reminder, promotion, welcome, followup
  status: varchar("status").default("sent"), // sent, failed, pending
  ruleId: integer("rule_id").references(() => smsAutomationRules.id),
  templateId: integer("template_id").references(() => smsTemplates.id),
  sentAt: timestamp("sent_at").defaultNow(),
  deliveryStatus: varchar("delivery_status"), // delivered, failed, unknown
  errorMessage: text("error_message"),
});

// Appointments for nail salon visits (Enhanced for real-time booking)
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  serviceId: integer("service_id").references(() => services.id),
  appointmentDate: timestamp("appointment_date").notNull(),
  timeSlot: varchar("time_slot").notNull(), // "09:00", "09:30", "10:00", etc.
  duration: integer("duration").default(60), // minutes
  status: varchar("status").default("scheduled"), // scheduled, confirmed, in_progress, completed, cancelled, no_show
  visitReason: varchar("visit_reason").default("general_visit"), // Visit reason with default
  serviceDetails: text("service_details"), // Specific service requirements
  price: decimal("price", { precision: 10, scale: 2 }),
  reminderSent: boolean("reminder_sent").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Service types and pricing
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // spa, treatments, waxing, design, massage, kids
  duration: integer("duration").notNull(), // minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  requiresConsultation: boolean("requires_consultation").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Salon operating hours and availability
export const operatingHours = pgTable("operating_hours", {
  id: serial("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(), // 0=Sunday, 1=Monday, etc.
  openTime: varchar("open_time").notNull(), // "10:00"
  closeTime: varchar("close_time").notNull(), // "19:00"
  isOpen: boolean("is_open").default(true),
  maxConcurrentBookings: integer("max_concurrent_bookings").default(3),
  breakStartTime: varchar("break_start_time"), // Optional lunch break
  breakEndTime: varchar("break_end_time"),
  specialNotes: text("special_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Time slot availability tracking
export const timeSlotAvailability = pgTable("time_slot_availability", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  timeSlot: varchar("time_slot").notNull(), // "10:00", "10:30", etc.
  isAvailable: boolean("is_available").default(true),
  totalSlots: integer("total_slots").default(3), // How many concurrent appointments
  bookedSlots: integer("booked_slots").default(0),
  blockedReason: varchar("blocked_reason"), // holiday, maintenance, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact inquiries from customers
export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name").notNull(),
  phoneNumber: varchar("phone_number").notNull(),
  inquiry: text("inquiry").notNull(),
  status: varchar("status").default("new"), // new, responded, resolved
  adminResponse: text("admin_response"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact inquiry insert schema
export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
  status: true,
  adminResponse: true,
  respondedAt: true,
}).extend({
  customerName: z.string().optional(),
});
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;

// Admin users table for authentication
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).unique(),
  role: varchar("role", { length: 20 }).default("admin").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email campaigns table
export const emailCampaigns = pgTable("email_campaigns", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  content: text("content").notNull(),
  recipientCategory: varchar("recipient_category", { length: 20 }).notNull(),
  recipientCount: integer("recipient_count").default(0),
  sentCount: integer("sent_count").default(0),
  status: varchar("status", { length: 20 }).default("draft").notNull(), // draft, sending, sent, failed
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  createdBy: integer("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// User activity tracking for analytics
export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id"), // Browser session ID
  activityType: varchar("activity_type").notNull(), // login, photo_upload, design_view, design_select, payment, etc.
  activityData: jsonb("activity_data"), // Additional data about the activity
  pagePath: varchar("page_path"), // URL path where activity occurred
  deviceInfo: jsonb("device_info"), // Browser, OS, device type
  ipAddress: varchar("ip_address"),
  duration: integer("duration"), // Time spent on activity (seconds)
  createdAt: timestamp("created_at").defaultNow(),
});

// Design interaction tracking
export const designInteractions = pgTable("design_interactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  designId: integer("design_id").references(() => nailDesigns.id),
  customDesignId: integer("custom_design_id").references(() => customNailDesigns.id),
  interactionType: varchar("interaction_type").notNull(), // view, like, save, share, purchase, rate
  rating: integer("rating"), // 1-5 stars for rating interactions
  timeSpent: integer("time_spent"), // Seconds spent viewing/interacting
  interactionData: jsonb("interaction_data"), // Additional interaction details
  createdAt: timestamp("created_at").defaultNow(),
});

// User preferences learning and analytics
export const userBehaviorAnalytics = pgTable("user_behavior_analytics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  preferredCategories: text("preferred_categories").array(), // Most viewed design categories
  preferredColors: text("preferred_colors").array(), // Most selected colors
  preferredStyles: text("preferred_styles").array(), // Most liked styles
  avgSessionDuration: integer("avg_session_duration"), // Average session length
  totalPhotosUploaded: integer("total_photos_uploaded").default(0),
  totalDesignsViewed: integer("total_designs_viewed").default(0),
  totalDesignsPurchased: integer("total_designs_purchased").default(0),
  averageOrderValue: decimal("average_order_value", { precision: 10, scale: 2 }),
  lastActive: timestamp("last_active"),
  devicePreference: varchar("device_preference"), // mobile, desktop, tablet
  peakUsageHours: integer("peak_usage_hours").array(), // Hours when user is most active
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }), // Views to purchase ratio
  loyaltyScore: integer("loyalty_score").default(0), // Calculated loyalty metric
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Design performance analytics
export const designAnalytics = pgTable("design_analytics", {
  id: serial("id").primaryKey(),
  designId: integer("design_id").references(() => nailDesigns.id),
  customDesignId: integer("custom_design_id").references(() => customNailDesigns.id),
  totalViews: integer("total_views").default(0),
  totalLikes: integer("total_likes").default(0),
  totalShares: integer("total_shares").default(0),
  totalPurchases: integer("total_purchases").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }),
  averageViewTime: integer("average_view_time"), // Seconds
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }),
  popularityScore: integer("popularity_score").default(0), // Calculated popularity metric
  seasonalTrends: jsonb("seasonal_trends"), // Performance by season/month
  demographicPerformance: jsonb("demographic_performance"), // Performance by user segments
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User journey tracking
export const userJourneys = pgTable("user_journeys", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").notNull(),
  journeySteps: jsonb("journey_steps").notNull(), // Array of journey steps with timestamps
  startPage: varchar("start_page"),
  endPage: varchar("end_page"),
  goalAchieved: boolean("goal_achieved").default(false), // Did user complete desired action
  goalType: varchar("goal_type"), // photo_upload, design_purchase, appointment_book
  totalDuration: integer("total_duration"), // Total session duration
  pageViews: integer("page_views").default(1),
  exitPoint: varchar("exit_point"), // Where user left the journey
  dropoffReason: varchar("dropoff_reason"), // technical_issue, price_concern, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Analytics types
export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = typeof userActivities.$inferInsert;
export type DesignInteraction = typeof designInteractions.$inferSelect;
export type InsertDesignInteraction = typeof designInteractions.$inferInsert;
export type UserBehaviorAnalytics = typeof userBehaviorAnalytics.$inferSelect;
export type InsertUserBehaviorAnalytics = typeof userBehaviorAnalytics.$inferInsert;
export type DesignAnalytics = typeof designAnalytics.$inferSelect;
export type InsertDesignAnalytics = typeof designAnalytics.$inferInsert;
export type UserJourney = typeof userJourneys.$inferSelect;
export type InsertUserJourney = typeof userJourneys.$inferInsert;

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

export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export const insertOperatingHoursSchema = createInsertSchema(operatingHours).omit({ id: true, createdAt: true });
export type InsertOperatingHours = z.infer<typeof insertOperatingHoursSchema>;
export type OperatingHours = typeof operatingHours.$inferSelect;

export const insertCustomerNailImageSchema = createInsertSchema(customerNailImages).omit({ id: true, uploadedAt: true });
export type InsertCustomerNailImage = z.infer<typeof insertCustomerNailImageSchema>;
export type CustomerNailImage = typeof customerNailImages.$inferSelect;

export const insertCustomerReservationSchema = createInsertSchema(customerReservations).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCustomerReservation = z.infer<typeof insertCustomerReservationSchema>;
export type CustomerReservation = typeof customerReservations.$inferSelect;

export const insertTimeSlotAvailabilitySchema = createInsertSchema(timeSlotAvailability).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTimeSlotAvailability = z.infer<typeof insertTimeSlotAvailabilitySchema>;
export type TimeSlotAvailability = typeof timeSlotAvailability.$inferSelect;

// Admin user type definitions
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Email campaign type definitions
export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns).omit({ id: true, createdAt: true });
export type InsertEmailCampaign = z.infer<typeof insertEmailCampaignSchema>;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;

// Carousel images type definitions
export const insertCarouselImageSchema = createInsertSchema(carouselImages).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCarouselImage = z.infer<typeof insertCarouselImageSchema>;

// Gallery schema and types
export const insertGallerySchema = createInsertSchema(gallery).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Gallery = typeof gallery.$inferSelect;

// AI Nail Art Images schema and types
export const insertAiNailArtImageSchema = createInsertSchema(aiNailArtImages).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAiNailArtImage = z.infer<typeof insertAiNailArtImageSchema>;
export type AiNailArtImage = typeof aiNailArtImages.$inferSelect;
export type CarouselImage = typeof carouselImages.$inferSelect;



export const insertUserStylePreferencesSchema = createInsertSchema(userStylePreferences).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUserStylePreferences = z.infer<typeof insertUserStylePreferencesSchema>;
export type UserStylePreferences = typeof userStylePreferences.$inferSelect;

export const insertCustomNailDesignSchema = createInsertSchema(customNailDesigns).omit({ id: true, createdAt: true });
export type InsertCustomNailDesign = z.infer<typeof insertCustomNailDesignSchema>;
export type CustomNailDesign = typeof customNailDesigns.$inferSelect;

import accessDb from './access-db';
import type { Database } from 'better-sqlite3';

// Microsoft Access-style storage interface
export class AccessStorage {
  private db: Database;

  constructor() {
    this.db = accessDb;
  }

  // Users operations (Access-style)
  async createUser(user: any) {
    const stmt = this.db.prepare(`
      INSERT INTO Users (
        UserID, EmailAddress, FirstName, LastName, PhoneNumber, 
        UserLevel, Username, Password, Workplace, Region, PostalCode, MailingList
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      user.id, user.email, user.firstName, user.lastName, user.phoneNumber,
      user.level || 'Customer', user.username, user.password, user.workplace,
      user.region, user.postalCode, user.mailingList ? 1 : 0
    );
  }

  async getUserById(userId: string) {
    const stmt = this.db.prepare('SELECT * FROM Users WHERE UserID = ?');
    return stmt.get(userId);
  }

  async getAllUsers() {
    const stmt = this.db.prepare('SELECT * FROM Users ORDER BY CreatedDate DESC');
    return stmt.all();
  }

  // Customers operations (Access-style)
  async createCustomer(customer: any) {
    const stmt = this.db.prepare(`
      INSERT INTO Customers (
        CustomerName, EmailAddress, PhoneNumber, VisitType, Category, 
        MailingConsent, TotalVisits, TotalSpent, LastVisit, Notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      customer.name, customer.email, customer.phoneNumber, customer.visitType,
      customer.category, customer.mailingConsent ? 1 : 0, customer.totalVisits || 0,
      customer.totalSpent || '0.00', customer.lastVisit, customer.notes
    );
  }

  async getAllCustomers() {
    const stmt = this.db.prepare('SELECT * FROM Customers ORDER BY EntryDate DESC');
    return stmt.all();
  }

  async getCustomersByCategory(category: string) {
    const stmt = this.db.prepare('SELECT * FROM Customers WHERE Category = ? ORDER BY EntryDate DESC');
    return stmt.all(category);
  }

  async getTodayCustomers() {
    const today = new Date().toISOString().split('T')[0] + '%';
    const stmt = this.db.prepare('SELECT * FROM Customers WHERE EntryDate LIKE ?');
    return stmt.all(today);
  }

  // Bookings operations (Access-style)
  async createBooking(booking: any) {
    const stmt = this.db.prepare(`
      INSERT INTO Bookings (
        CustomerID, BookingDate, TimeSlot, Duration, Status, 
        VisitReason, ServiceDetails, Price, ReminderSent, Notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      booking.customerId, booking.bookingDate, booking.timeSlot, booking.duration,
      booking.status || 'scheduled', booking.visitReason, booking.serviceDetails,
      booking.price, booking.reminderSent ? 1 : 0, booking.notes
    );
  }

  async getAllBookings() {
    const stmt = this.db.prepare(`
      SELECT b.*, c.CustomerName, c.PhoneNumber 
      FROM Bookings b 
      LEFT JOIN Customers c ON b.CustomerID = c.CustomerID 
      ORDER BY b.BookingDate DESC
    `);
    return stmt.all();
  }

  async getTodayBookings() {
    const today = new Date().toISOString().split('T')[0] + '%';
    const stmt = this.db.prepare(`
      SELECT b.*, c.CustomerName, c.PhoneNumber 
      FROM Bookings b 
      LEFT JOIN Customers c ON b.CustomerID = c.CustomerID 
      WHERE b.EntryDate LIKE ?
    `);
    return stmt.all(today);
  }

  // Orders operations (Access-style)
  async createOrder(order: any) {
    const stmt = this.db.prepare(`
      INSERT INTO Orders (
        UserID, DesignID, SessionID, TotalAmount, PayPalOrderID, PaymentStatus, PrintStatus
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      order.userId, order.designId, order.sessionId, order.totalAmount,
      order.paypalOrderId, order.paymentStatus || 'pending', order.printStatus || 'pending'
    );
  }

  async getAllOrders() {
    const stmt = this.db.prepare('SELECT * FROM Orders ORDER BY EntryDate DESC');
    return stmt.all();
  }

  async getTodayOrders() {
    const today = new Date().toISOString().split('T')[0] + '%';
    const stmt = this.db.prepare('SELECT * FROM Orders WHERE EntryDate LIKE ?');
    return stmt.all(today);
  }

  // Gallery operations (Access-style)
  async createGalleryItem(gallery: any) {
    const stmt = this.db.prepare(`
      INSERT INTO Gallery (
        GalleryNumber, Title, Description, ImagePath, ThumbnailPath, 
        Category, Tags, DisplayOrder, IsActive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      gallery.galleryNo, gallery.title, gallery.description, gallery.imagePath,
      gallery.thumbnailPath, gallery.category, JSON.stringify(gallery.tags || []),
      gallery.displayOrder || 0, gallery.isActive ? 1 : 0
    );
  }

  async getAllGallery() {
    const stmt = this.db.prepare('SELECT * FROM Gallery WHERE IsActive = 1 ORDER BY DisplayOrder');
    const results = stmt.all() as any[];
    return results.map((item: any) => ({
      ...item,
      tags: JSON.parse(item.Tags || '[]')
    }));
  }

  async createGalleryDescription(desc: any) {
    const stmt = this.db.prepare(`
      INSERT INTO Gallery_Desc (
        GalleryID, TechniquesUsed, TimeRequired, DifficultyLevel, 
        PriceRange, MaintenanceGuide, SuitableFor, Materials
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      desc.galleryId, desc.techniquesUsed, desc.timeRequired, desc.difficultyLevel,
      desc.priceRange, desc.maintenanceGuide, desc.suitableFor, 
      JSON.stringify(desc.materials || [])
    );
  }

  // Site Visits operations (Access-style)
  async createSiteVisit(visit: any) {
    const stmt = this.db.prepare(`
      INSERT INTO SiteVisits (
        VisitorID, IPAddress, UserAgent, Referrer, PagePath, SessionID, VisitDuration
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      visit.visitorId, visit.ipAddress, visit.userAgent, visit.referrer,
      visit.page, visit.sessionId, visit.visitDuration
    );
  }

  async getTodayVisits() {
    const today = new Date().toISOString().split('T')[0] + '%';
    const stmt = this.db.prepare('SELECT * FROM SiteVisits WHERE EntryDate LIKE ?');
    return stmt.all(today);
  }

  // Admin Users operations (Access-style)
  createAdminUser(admin: any) {
    const stmt = this.db.prepare(`
      INSERT INTO AdminUsers (
        Username, Password, AdminName, EmailAddress, Role, IsActive
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      admin.username, admin.password, admin.name, admin.email,
      admin.role || 'admin', admin.isActive ? 1 : 0
    );
  }

  getAdminByUsername(username: string) {
    const stmt = this.db.prepare('SELECT * FROM AdminUsers WHERE Username = ? AND IsActive = 1');
    return stmt.get(username);
  }

  // Customer Nail Info operations (Access-style)
  async createCustomerNailInfo(nailInfo: any) {
    const stmt = this.db.prepare(`
      INSERT INTO CustomerNailInfo (
        PhoneNumber, SessionID, FingerPosition, OriginalImage, AIGeneratedImage,
        DesignPrompt, NailShape, NailLength, NailCondition, DesignStyle, ColorPreferences
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      nailInfo.phoneNumber, nailInfo.sessionId, nailInfo.fingerPosition,
      nailInfo.originalImage, nailInfo.aiGeneratedImage, nailInfo.designPrompt,
      nailInfo.nailShape, nailInfo.nailLength, nailInfo.nailCondition,
      nailInfo.designStyle, nailInfo.colorPreferences
    );
  }

  async getCustomerNailInfoByPhone(phoneNumber: string) {
    const stmt = this.db.prepare('SELECT * FROM CustomerNailInfo WHERE PhoneNumber = ? ORDER BY CreatedDate DESC');
    return stmt.all(phoneNumber);
  }

  // Dashboard statistics (Access-style)
  async getDashboardStats() {
    const totalCustomers = this.db.prepare('SELECT COUNT(*) as count FROM Customers').get() as any;
    const totalBookings = this.db.prepare('SELECT COUNT(*) as count FROM Bookings').get() as any;
    const totalOrders = this.db.prepare('SELECT COUNT(*) as count FROM Orders').get() as any;
    
    const today = new Date().toISOString().split('T')[0] + '%';
    const todayCustomers = this.db.prepare('SELECT COUNT(*) as count FROM Customers WHERE EntryDate LIKE ?').get(today) as any;
    const todayBookings = this.db.prepare('SELECT COUNT(*) as count FROM Bookings WHERE EntryDate LIKE ?').get(today) as any;
    const todayOrders = this.db.prepare('SELECT COUNT(*) as count FROM Orders WHERE EntryDate LIKE ?').get(today) as any;
    const todayVisits = this.db.prepare('SELECT COUNT(*) as count FROM SiteVisits WHERE EntryDate LIKE ?').get(today) as any;

    return {
      totalCustomers: totalCustomers?.count || 0,
      totalBookings: totalBookings?.count || 0,
      totalOrders: totalOrders?.count || 0,
      todayCustomers: todayCustomers?.count || 0,
      todayBookings: todayBookings?.count || 0,
      todayOrders: todayOrders?.count || 0,
      todayVisits: todayVisits?.count || 0
    };
  }

  // Initialize sample data (Access-style)
  async initializeSampleData() {
    console.log('📊 Initializing Microsoft Access sample data...');

    try {
      // Create admin user
      const existingAdmin = this.getAdminByUsername('admin');
      if (!existingAdmin) {
        this.createAdminUser({
          username: 'admin',
          password: '1111',
          name: 'Admin User',
          email: 'admin@connienail.com',
          role: 'admin',
          isActive: true
        });
        console.log('✅ Admin user created: admin/1111');
      }

      // Create sample customers
      const sampleCustomers = [
        {
          name: 'Emma Johnson',
          email: 'emma.johnson@email.com',
          phoneNumber: '010-1111-2024',
          category: 'VIP',
          visitType: 'first_visit',
          mailingConsent: true,
          totalVisits: 3,
          totalSpent: '180.00',
          notes: 'VIP customer - prefers floral designs'
        },
        {
          name: 'Sarah Kim',
          email: 'sarah.kim@email.com',
          phoneNumber: '010-2222-2024',
          category: 'General',
          visitType: 'appointment_visit',
          mailingConsent: true,
          totalVisits: 2,
          totalSpent: '110.00',
          notes: 'Regular customer - likes geometric patterns'
        },
        {
          name: 'Lisa Chen',
          email: 'lisa.chen@email.com',
          phoneNumber: '010-3333-2024',
          category: 'General',
          visitType: 'online_booking',
          mailingConsent: false,
          totalVisits: 1,
          totalSpent: '65.00',
          notes: 'New customer - minimalist style'
        }
      ];

      for (const customer of sampleCustomers) {
        await this.createCustomer(customer);
      }

      console.log('✅ Sample data initialized successfully');
      console.log('🎯 Access database ready with sample customers, admin user, and basic structure');

    } catch (error) {
      console.error('❌ Error initializing sample data:', error);
    }
  }
}

export const accessStorage = new AccessStorage();
export default accessStorage;
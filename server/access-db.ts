import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Microsoft Access-style database using SQLite3
const dbPath = path.join(process.cwd(), 'connie_nail.db');

// Initialize SQLite database
export const accessDb = new Database(dbPath);

// Enable foreign keys
accessDb.pragma('foreign_keys = ON');

// Create Access-style tables
export function initializeAccessDB() {
  console.log('🔧 Initializing Microsoft Access-style database...');
  
  // Sessions table (equivalent to Access Sessions table)
  accessDb.exec(`
    CREATE TABLE IF NOT EXISTS Sessions (
      SessionID TEXT PRIMARY KEY,
      SessionData TEXT NOT NULL,
      ExpiryDate DATETIME NOT NULL,
      CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Users table (equivalent to Access Users table)
  accessDb.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      UserID TEXT PRIMARY KEY,
      EmailAddress TEXT UNIQUE,
      FirstName TEXT,
      LastName TEXT,
      ProfileImageURL TEXT,
      PhoneNumber TEXT UNIQUE,
      Password TEXT,
      Workplace TEXT,
      Region TEXT,
      PostalCode TEXT,
      MailingList INTEGER DEFAULT 0,
      UserLevel TEXT DEFAULT 'Customer',
      Username TEXT UNIQUE,
      CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      EntryDate DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Customers table (equivalent to Access Customers table)
  accessDb.exec(`
    CREATE TABLE IF NOT EXISTS Customers (
      CustomerID INTEGER PRIMARY KEY AUTOINCREMENT,
      CustomerName TEXT NOT NULL,
      EmailAddress TEXT,
      PhoneNumber TEXT NOT NULL,
      VisitType TEXT,
      Category TEXT,
      MailingConsent INTEGER DEFAULT 0,
      TotalVisits INTEGER DEFAULT 0,
      TotalSpent TEXT DEFAULT '0.00',
      LastVisit DATETIME,
      Notes TEXT,
      EntryDate DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Bookings table (equivalent to Access Bookings table)
  accessDb.exec(`
    CREATE TABLE IF NOT EXISTS Bookings (
      BookingID INTEGER PRIMARY KEY AUTOINCREMENT,
      CustomerID INTEGER,
      BookingDate DATETIME NOT NULL,
      TimeSlot TEXT NOT NULL,
      Duration INTEGER,
      Status TEXT DEFAULT 'scheduled',
      VisitReason TEXT,
      ServiceDetails TEXT,
      Price TEXT,
      ReminderSent INTEGER DEFAULT 0,
      Notes TEXT,
      EntryDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
    )
  `);

  // Orders table (equivalent to Access Orders table)
  accessDb.exec(`
    CREATE TABLE IF NOT EXISTS Orders (
      OrderID INTEGER PRIMARY KEY AUTOINCREMENT,
      UserID TEXT,
      DesignID INTEGER,
      SessionID TEXT,
      TotalAmount TEXT NOT NULL,
      PayPalOrderID TEXT,
      PaymentStatus TEXT DEFAULT 'pending',
      PrintStatus TEXT DEFAULT 'pending',
      EntryDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (UserID) REFERENCES Users(UserID)
    )
  `);

  // Gallery table (equivalent to Access Gallery table)
  accessDb.exec(`
    CREATE TABLE IF NOT EXISTS Gallery (
      GalleryID INTEGER PRIMARY KEY AUTOINCREMENT,
      GalleryNumber TEXT UNIQUE NOT NULL,
      Title TEXT NOT NULL,
      Description TEXT,
      ImagePath TEXT NOT NULL,
      ThumbnailPath TEXT,
      Category TEXT NOT NULL,
      Tags TEXT,
      DisplayOrder INTEGER DEFAULT 0,
      IsActive INTEGER DEFAULT 1,
      CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      EntryDate DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Gallery Descriptions table (equivalent to Access Gallery_Desc table)
  accessDb.exec(`
    CREATE TABLE IF NOT EXISTS Gallery_Desc (
      DescID INTEGER PRIMARY KEY AUTOINCREMENT,
      GalleryID INTEGER NOT NULL,
      TechniquesUsed TEXT,
      TimeRequired TEXT,
      DifficultyLevel TEXT,
      PriceRange TEXT,
      MaintenanceGuide TEXT,
      SuitableFor TEXT,
      Materials TEXT,
      CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      EntryDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (GalleryID) REFERENCES Gallery(GalleryID)
    )
  `);

  // Site Visits table (equivalent to Access SiteVisits table)
  accessDb.exec(`
    CREATE TABLE IF NOT EXISTS SiteVisits (
      VisitID INTEGER PRIMARY KEY AUTOINCREMENT,
      VisitorID TEXT,
      IPAddress TEXT,
      UserAgent TEXT,
      Referrer TEXT,
      PagePath TEXT,
      SessionID TEXT,
      VisitDuration INTEGER,
      VisitedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      EntryDate DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admin Users table (equivalent to Access AdminUsers table)
  accessDb.exec(`
    CREATE TABLE IF NOT EXISTS AdminUsers (
      AdminID INTEGER PRIMARY KEY AUTOINCREMENT,
      Username TEXT UNIQUE NOT NULL,
      Password TEXT NOT NULL,
      AdminName TEXT NOT NULL,
      EmailAddress TEXT UNIQUE,
      Role TEXT DEFAULT 'admin' NOT NULL,
      IsActive INTEGER DEFAULT 1 NOT NULL,
      LastLogin DATETIME,
      CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      EntryDate DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // SMS Templates table (equivalent to Access SMSTemplates table)
  accessDb.exec(`
    CREATE TABLE IF NOT EXISTS SMSTemplates (
      TemplateID INTEGER PRIMARY KEY AUTOINCREMENT,
      TemplateName TEXT UNIQUE NOT NULL,
      TemplateContent TEXT NOT NULL,
      IsActive INTEGER DEFAULT 1,
      CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      EntryDate DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Nail Designs table (equivalent to Access NailDesigns table)
  accessDb.exec(`
    CREATE TABLE IF NOT EXISTS NailDesigns (
      DesignID INTEGER PRIMARY KEY AUTOINCREMENT,
      DesignName TEXT NOT NULL,
      Description TEXT,
      ImageURL TEXT NOT NULL,
      Category TEXT,
      Price TEXT,
      Tags TEXT,
      IsActive INTEGER DEFAULT 1,
      CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      EntryDate DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Customer Nail Info table (equivalent to Access CustomerNailInfo table)
  accessDb.exec(`
    CREATE TABLE IF NOT EXISTS CustomerNailInfo (
      NailInfoID INTEGER PRIMARY KEY AUTOINCREMENT,
      PhoneNumber TEXT NOT NULL,
      SessionID TEXT NOT NULL,
      FingerPosition TEXT NOT NULL,
      OriginalImage TEXT,
      AIGeneratedImage TEXT,
      DesignPrompt TEXT,
      NailShape TEXT,
      NailLength TEXT,
      NailCondition TEXT,
      DesignStyle TEXT,
      ColorPreferences TEXT,
      CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      EntryDate DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Microsoft Access-style database initialized successfully');
  console.log(`📍 Database location: ${dbPath}`);
}

// Initialize database on module load
initializeAccessDB();

export default accessDb;
# Connie's Nail - Replit Project Guide

## Overview
Connie's Nail is a full-stack web application for a traditional nail salon featuring comprehensive nail care and spa services. The platform provides multi-language support (Korean/English), detailed service menus with pricing, appointment booking, customer management, and PayPal payment integration. **MAJOR UPDATE: Migrated from PostgreSQL to Microsoft Access-style database using SQLite3 for improved operational stability.**

## User Preferences
Preferred communication style: Simple, everyday language.

## User Preferences
- 비용 효율적인 솔루션 선호
- 단계적 배포 및 확장 희망
- nolsae.com 도메인으로 서비스 론칭 계획
- **Database preference: Microsoft Access-style instead of PostgreSQL due to operational issues**

## Recent Changes (July 2025)

### Supabase PostgreSQL Migration (July 24, 2025)
- **Database Migration to Supabase**: Successfully migrated from temporary Access DB to Supabase PostgreSQL
  - Restored original PostgreSQL/Drizzle ORM architecture with Supabase backend
  - Connected to Supabase database using provided DATABASE_URL
  - Re-enabled all original PostgreSQL-based data seeding and initialization
  - Restored comprehensive REST API endpoints using original routes.ts
  - All 35+ database tables with proper Drizzle schema definitions active
- **Supabase Integration Benefits**: Modern cloud database with enhanced capabilities
  - Real-time database subscriptions for live updates
  - Automatic API generation from database schema
  - Built-in authentication and row-level security
  - Unlimited scalability compared to Access DB limitations
  - Full PostgreSQL feature set with advanced querying capabilities
- **Data Restoration**: All sample data and seed scripts re-activated
  - Comprehensive test customers, bookings, orders, and gallery data
  - Admin authentication system restored with proper JWT tokens
  - Today's metrics and dashboard statistics fully operational
  - Real-time booking system and customer management active

## Recent Changes (July 2025)

### Universal GetDate Timestamp System Implementation (July 24, 2025)
- **Complete Database Schema Enhancement**: Added GetDate timestamp field to ALL database tables
  - Universal data entry tracking: Every table now includes GetDate field with defaultNow()
  - Systematic timestamp implementation across 35+ database tables for comprehensive tracking
  - All insert operations automatically capture data entry timestamps for audit trail
  - Enhanced dashboard filtering capabilities with precise date-based queries
- **Today's Date Sample Data System**: Created comprehensive test data infrastructure
  - New today-date-seeder.ts creating customers, bookings, orders with today's timestamps
  - Dashboard now displays accurate "today" metrics using GetDate field filtering
  - Sample data includes realistic customer profiles, booking appointments, orders, site visits
  - Automatic seeding ensures dashboard shows active today metrics for testing
- **Database Schema Completion**: Successfully resolved all timestamp field requirements
  - Fixed duplicate table definitions and TypeScript errors in schema files
  - Proper foreign key relationships maintained with GetDate additions
  - Schema push completed with all 35+ tables including universal timestamp tracking

### 5-Card Admin Dashboard Layout Implementation (July 24, 2025)
- **Restructured Admin Dashboard**: Updated from 4-card to 5-card layout as requested
  - Combined "Total" card showing Customers / Bookings / Orders in concise format
  - Individual today cards: Today Customer, Today's Booking, Today's Visit, Today Orders
  - Site visits tracking table (siteVisits) created for website visitor analytics
  - All "today" metrics now properly filter by current date using database timestamps
- **Enhanced Data Tracking**: Added comprehensive today-specific metrics
  - Today Customer: New customers registered today (filtered by GetDate)
  - Today's Booking: Booking appointments for today (filtered by GetDate) 
  - Today's Visit: Website visitors today (tracked via site visit API)
  - Today Orders: Order transactions completed today (filtered by GetDate)
- **Site Visit Tracking System**: Complete visitor analytics infrastructure
  - New siteVisits table storing IP, user agent, referrer, page, session data
  - API endpoint /api/track-visit for visitor data collection
  - Real-time today's visit count for dashboard analytics

### Complete AI Nail Art System with Customer Integration (July 23, 2025)
- **Customer-Centric 10-Finger AI Nail System**: Comprehensive nail art management connected to Customer table via phone number
  - Created customer_nail_info table storing all 10 fingers data per customer session
  - Each customer identified by phone number with complete nail information storage
  - Finger positions: left_thumb, left_index, left_middle, left_ring, left_pinky, right_thumb, right_index, right_middle, right_ring, right_pinky
  - Comprehensive nail data: original/AI images, design prompts, nail shape/length/condition, design style, color preferences
- **Customer Nail Info Page**: Dedicated customer interface for viewing nail art history
  - Phone number-based search to access personal nail information
  - Latest session view showing all 10 fingers in current design session
  - Complete history view with all past nail art records
  - Responsive card layout with nail images, design details, and AI prompts
- **Database Schema & API Integration**: Complete backend system for nail art management
  - customer_nail_info table with foreign key to customers.phone_number
  - Session-based grouping for complete 10-finger nail art sets
  - REST API endpoints: GET/POST /api/customer/:phone/nail-info for customer access
  - Admin API endpoints: /api/admin/customer-nail-info for management
- **Sample Data Integration**: Test data with complete 10-finger nail art session
  - Customer 010-1234-5678 with floral design session across all 10 fingers
  - Design prompt: "Elegant floral design with roses" with oval shape, medium length
  - Color preferences: pink, white, gold for consistent design theme

### Complete Database-Driven Gallery System Implementation (July 23, 2025)
- **Database Schema Completion**: Successfully created gallery and gallery_desc tables with proper relationships
  - Gallery table stores basic information: title, description, category, tags, image_path, display_order
  - Gallery_desc table stores detailed information: techniques_used, time_required, difficulty_level, price_range, maintenance_guide
  - Foreign key relationship between gallery_desc.gallery_id and gallery.id for detailed modal views
- **Gallery Data Migration**: Moved all hardcoded gallery content to database storage
  - Created 6 sample gallery items with real image paths from uploaded files
  - Added comprehensive descriptions for each gallery item with professional nail salon details
  - Images now properly linked to /uploads/gallery/ folder with actual uploaded image files
- **Admin Gallery Management**: Complete CRUD operations for gallery content management
  - Admin can create, read, update, and delete gallery items through admin dashboard
  - File upload functionality for gallery images with proper storage in uploads/gallery/
  - Gallery items display in admin dashboard with image previews, categories, and management options
- **API Integration**: Full REST API implementation for gallery management
  - GET /api/gallery - Public gallery viewing for customers
  - GET /api/admin/gallery - Admin gallery management with authentication
  - POST /api/admin/gallery - Create new gallery items with image upload
  - PUT/DELETE /api/admin/gallery/:id - Update and delete gallery items
  - Gallery description endpoints for detailed modal views

## Recent Changes (July 2025)

### Progressive Web App (PWA) Implementation (July 23, 2025)
- **Complete Mobile App Conversion**: Transformed web application into installable PWA for Android and iOS
  - Added comprehensive PWA manifest with app shortcuts and screenshots
  - Implemented service worker with offline caching and background sync
  - Created PWA install prompt component with smart timing and dismissal handling
  - Added mobile-optimized meta tags and viewport settings for native app experience
  - Integrated push notifications and Web Share API support
  - Safe area insets support for iPhone X+ devices and Android notches
  - Touch optimizations and gesture handling for mobile interactions
- **Mobile-First Enhancements**: Native app-like features and performance
  - Offline mode with cached content and sync capabilities
  - App shortcuts for quick booking, services, and admin access
  - Responsive design with mobile header component and navigation
  - Status bar styling and full-screen PWA display mode
  - Card scanning integration with Stripe for mobile payments
  - Calendar integration for appointment booking reminders

### Complete Stripe Payment Integration (July 23, 2025)
- **SMS Confirmation System**: Added automatic SMS notification after booking completion
  - SMS message format: "[Connie's Nail] 고객님, 예약 날짜 시간에 예약이 완료되었습니다"
  - SMS integration with existing smsService for customer notification
  - Fail-safe implementation: booking succeeds even if SMS fails
- **Full Stripe Payment System**: Complete payment integration with card scanning
  - Button text: "Online Payment Discount (10%)" with English interface
  - Stripe checkout page with professional payment interface and card scanning
  - Mobile-responsive design with Apple Pay and Google Pay integration
  - Secure payment processing with 10% discount calculation
  - Fixed navigation using wouter routing for seamless page transitions
  - Payment intent creation with booking metadata for transaction tracking
  - English-only interface with locale settings for consistent user experience

### User Management System Implementation (July 23, 2025)
- **Complete User Level System**: Added comprehensive user management with level-based access control
  - Added "level" field to users table to distinguish between "admin" and "Customer" users
  - Created admin user with username "admin", password "1111", firstName "admin", lastName "admin"
  - Implemented User Management tab in admin dashboard with user creation functionality
  - Updated authentication to support both admin_users table and users table authentication
  - Fixed database schema issues with user_id/userId column mapping
  - Added comprehensive user creation API endpoint for admin-managed user registration

### Homepage Layout Optimization (July 23, 2025)
- **Component Restructuring**: Split AI Service Section into focused components
  - Created separate PremiumServicesSection for nail services overview
  - Created dedicated AINailArtSection for AI features
  - Optimized page flow: Premium Services → AI Nail Art → Carousel → Booking
  - Improved user experience with logical content progression

### Admin Dashboard Modal System Fixed (July 23, 2025)
- **Card Click Handler Repair**: Fixed non-functional admin dashboard metric cards
  - Resolved modal state management issues preventing detail views from opening
  - Created new AdminModal component with proper Tailwind CSS styling and z-index handling
  - Fixed TypeScript errors in error handling for API calls
  - Implemented real-time data loading from admin/customers and admin/appointments APIs
  - Cards now properly display detailed customer and appointment data when clicked
  - Modal shows comprehensive data with pagination for large datasets
  - Added proper close functionality and responsive design for mobile devices

### Complete Korean to English Text Conversion (July 23, 2025)
- **Comprehensive Text Translation**: Completed full conversion of all Korean text to English
  - Updated admin dashboard interface: 관리자 대시보드 → Admin Dashboard, 고객관리 → Customer Management
  - Converted all navigation elements: 로그인 → Log In, 예약관리 → Appointment Management
  - Fixed all error messages and status text throughout the application
  - Updated form labels, buttons, and system messages across client and server files
  - Maintained proper authentication flow with admin/1111 credentials
  - Resolved Header component TypeScript errors for better stability
  - **Korean Booking Form Translation**: Translated appointment-booking-new.tsx to English
    - Form title: 📞 예약 정보 입력 → 📞 Booking Information
    - Field labels: 고객 전화번호 → Customer Phone Number, 고객 이름 → Customer Name
    - Visit type options: 방문예약/최초방문/인터넷예약 → Appointment Visit/First Visit/Online Booking
    - Booking guidance: Added English booking information panel with business hours and policies
  - **Header Welcome Text**: Removed "Welcome, admin admin" text after admin login for cleaner interface
  - **Navigation Cleanup**: Removed "Customer Management", "Admin Panel", "Analytics", and duplicate "Logout" button from navigation menu for streamlined interface
  - **Database Test Data**: Added comprehensive test data with 10+ customer records and admin distinction
    - Created admin user with username "admin", password "1111", level "admin" 
    - Added 12 customer users with level "Customer" including names, phone numbers, emails, workplace info
    - Added corresponding customer records with categories (VIP, General, Mailing List), visit history, and spending data
    - Created sample appointments with various service types and booking statuses for testing
  - **Logout Button Fix**: Resolved logout functionality issues
    - Fixed admin authentication system to use admin_users table consistently
    - Corrected JWT token generation with proper numeric ID instead of username
    - Fixed API request parameter order in admin auth hook
    - Logout button now works correctly with proper authentication flow
  - **AI Nail Art Translation**: Revolutionary AI service description fully translated
    - Korean: "손톱을 등록한 후 네일아트 디자인을 선택한 후 결제 하신 후 방문일자를 입력해 주세요" 
    - English: "Register your nails → select nail art design → payment → visit date process"
  - **Services Section Translation**: All 9 service types with pricing and descriptions
    - Classic French Manicure ($45), Floral Design ($65), Geometric Pattern ($55)
    - Glitter & Sparkle ($70), Minimalist Style ($40), Seasonal Design ($60)
    - Wedding Special ($80), Ombre Effect ($65), 3D Art Design ($90)
  - **Treatment Process Translation**: 4-step nail treatment process in English
    - Nail Preparation → Base Coating → Color Application → Finish Coating
  - **Complete Services Section Translation**: All service content fully translated
    - Classic French Manicure ($45) - Traditional French manicure style
    - Floral Design ($65) - Delicate floral nail art  
    - Geometric Pattern ($55) - Modern geometric patterns
    - Glitter & Sparkle ($70) - Glamorous glitter nail art
    - Minimalist Style ($40) - Simple and sophisticated minimal design
    - Seasonal Design ($60) - Special seasonal designs
    - Wedding Special ($80) - Elegant nail art for weddings
    - Ombre Effect ($65) - Soft gradient effects
    - 3D Art Design ($90) - Three-dimensional nail art
  - **Updated Booking Process**: Changed from 3-step to 4-step process
    - Step 1: Select Date & Time
    - Step 2: Select Service  
    - Step 3: Customer Information
    - Step 4: Visit Store

### HTML/CSS/JavaScript Conversion (July 22, 2025)
- **Complete Standalone HTML Version**: Converted React application to vanilla HTML/CSS/JavaScript
  - Created fully functional HTML version in `html-version/` directory
  - Implemented proper English-default language system with Korean/Japanese/Spanish support
  - Fixed language switching functionality - English now displays correctly when selected
  - No external dependencies except Font Awesome and Google Fonts via CDN
  - Responsive design with mobile-first approach
  - Complete carousel functionality with auto-advance and manual controls
  - Working booking and contact forms with validation and toast notifications
  - All original features preserved in vanilla JavaScript implementation

### AI Nail Art Generator Integration (July 22, 2025)
- **Full AI Nail Art System**: Complete smartphone nail analysis and design generation system
  - Added prominent AI Nail Art navigation menu with special highlighting
  - 6-photo upload system with drag-and-drop functionality
  - AI analysis simulation measuring nail size and curvature from smartphone photos
  - Automatic design generation with 3-second processing simulation
  - Interactive design gallery with selection and download features
  - Complete language support for all AI features in 4 languages
  - Mobile-responsive photo upload and preview system
  - Seamless integration with booking system for AI-generated designs
  - Revolutionary nail salon workflow optimization tool

### Real-Time Booking System Implementation (July 22, 2025)
- **Advanced Real-Time Booking Platform**: Live appointment management system
  - Real-time availability checking with automatic 30-second refresh
  - Live conflict detection preventing double bookings
  - Optimistic UI updates with automatic rollback on errors
  - Color-coded availability status indicators (high/medium/low/full)
  - 30-minute time slots from 10:00 AM to 6:30 PM
  - Comprehensive customer information capture integration

- **Complete Language Translation System**: Full 4-language support implementation
  - Fixed all language switching issues across application
  - Complete translation coverage for Korean 🇰🇷, English 🇺🇸, Japanese 🇯🇵, Spanish 🇪🇸
  - Removed Chinese language support for focused multilingual experience
  - Real-time content translation when switching languages
  - All hardcoded text replaced with translation keys

### Major Home Page Redesign & Customer Management System
- **Complete Home Page Overhaul**: Revolutionary redesign with customer engagement focus
  - Added stunning image carousel with professional nail salon photography
  - Created prominent booking hero section with real-time availability
  - Implemented AI service description highlighting time and cost savings
  - Integrated interactive location map with transportation details
  - Enhanced visual appeal with gradient designs and professional imagery

- **Full Appointment Booking System**: End-to-end salon management platform
  - Real-time availability checking with 30-minute time slots
  - Complete service catalog with spa treatments, nail care, waxing, massage
  - Customer information capture with phone/email integration
  - Operating hours enforcement (Monday-Friday 10AM-7PM)
  - Database integration with PostgreSQL and Drizzle ORM

- **Enhanced Admin Panel & Customer Categorization**: Comprehensive customer management
  - Customer categorization system: Mailing List, General, Booking customers
  - Advanced email marketing functionality with SendGrid integration
  - Customer analytics dashboard with engagement metrics
  - Bulk email campaigns with consent management
  - Customer visit tracking and spending analysis

- **Rebranding to Connie's Nail**: Complete rebrand from AI Nail Studio
  - Updated all branding elements and titles throughout the application
  - Created comprehensive Services page with detailed pricing
  - Added traditional nail salon services: spa treatments, nail care, waxing, massage
  - Updated navigation with Services, Booking, Gallery, and Contact sections

## System Architecture

### Full-Stack Structure
- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js with TypeScript, serving both API endpoints and static files
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit's built-in OpenID Connect authentication system
- **Payment Processing**: PayPal SDK integration for secure transactions
- **AI Integration**: OpenAI API for nail shape analysis and image generation
- **UI Framework**: Shadcn/ui components with Tailwind CSS styling

### Deployment Strategy
- **Development**: Uses Vite dev server with HMR (Hot Module Replacement)
- **Production**: Static files served by Express with esbuild bundling
- **Database**: Configured for Neon PostgreSQL with connection pooling
- **Environment**: Designed for Replit hosting with specific environment variable handling

## Key Components

### Frontend Architecture
- **Router**: Wouter for client-side routing with conditional authentication flows
- **State Management**: TanStack Query for server state and caching
- **UI Components**: Radix UI primitives with custom Shadcn/ui styling
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with CSS custom properties for theming

### Backend Architecture
- **API Structure**: RESTful endpoints organized by feature (auth, photos, designs, orders, payments)
- **Middleware**: Express session management, request logging, and error handling
- **File Upload**: Multer for handling image uploads with disk storage
- **Database Layer**: Drizzle ORM with connection pooling for PostgreSQL

### Authentication Flow
- **Replit Auth**: Integrated OpenID Connect with automatic user session management
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **Route Protection**: Middleware-based authentication checks for protected endpoints

### Advanced AI Integration
- **Image Analysis**: OpenAI Vision API for analyzing uploaded nail photos with card-based scale reference
- **Precise Measurement**: 6-photo nail measurement system using standard credit card dimensions (85.60mm x 53.98mm x 0.76mm)
- **Advanced Design Generation**: Multi-layered AI system with comprehensive style preferences
- **Personality-Based Customization**: AI considers user personality traits, lifestyle, and inspiration keywords
- **Design Variations**: Automated generation of multiple design alternatives with different intensity levels
- **Smart Recommendations**: AI analysis providing personalized suggestions based on nail measurements and preferences

## Data Flow

### User Journey
1. **Authentication**: Users authenticate via Replit's OAuth system
2. **Photo Upload**: Multiple finger photos uploaded and stored locally
3. **AI Processing**: Photos analyzed by OpenAI for shape and dimension data
4. **Design Selection**: Users choose from curated nail art designs
5. **Payment**: PayPal integration handles secure payment processing
6. **Order Tracking**: Real-time order status updates and printing queue management

### Database Schema
- **Users**: Replit user profiles with extended metadata
- **Customer Photos**: Uploaded images with finger type and analysis metadata
- **AI Generated Nails**: Results from AI analysis with shape measurements
- **Nail Designs**: Curated design catalog with pricing and categories
- **Orders**: Complete order records linking users, designs, and payment status
- **Sessions**: Secure session storage required for Replit authentication

## External Dependencies

### Core Services
- **Replit Authentication**: Mandatory OIDC integration for user management
- **Neon Database**: PostgreSQL hosting with serverless connection pooling
- **OpenAI API**: Vision and completion models for nail analysis
- **PayPal SDK**: Payment processing with sandbox/production environment switching

### Development Tools
- **Vite**: Frontend build tool with React plugin and custom configuration
- **Drizzle Kit**: Database migration and schema management
- **TypeScript**: Full-stack type safety with shared schema definitions
- **ESBuild**: Production bundling for backend code

### UI/UX Libraries
- **Radix UI**: Accessible component primitives for complex interactions
- **Tailwind CSS**: Utility-first styling with custom design system
- **Lucide React**: Consistent icon library throughout the application
- **React Hook Form**: Form state management with validation

## Development Strategy

### Environment Setup
- Database requires `DATABASE_URL` environment variable for Neon PostgreSQL
- OpenAI integration needs `OPENAI_API_KEY` for AI functionality
- PayPal requires `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`
- Replit authentication requires `REPLIT_DOMAINS` and session configuration

### Code Organization
- **Shared Types**: Common TypeScript definitions in `/shared/schema.ts`
- **Client Code**: React application in `/client/src/` with component-based structure
- **Server Code**: Express API in `/server/` with feature-based route organization
- **Database**: Drizzle schema and migrations with type-safe query building

### Critical Integration Points
- **PayPal Code**: Marked sections must not be modified to maintain payment functionality
- **Replit Auth**: User operations in storage layer are mandatory for authentication
- **Session Management**: PostgreSQL sessions table required for Replit auth compliance
- **File Uploads**: Local disk storage with organized directory structure for user photos
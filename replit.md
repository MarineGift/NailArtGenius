# Connie's Nail - Replit Project Guide

## Overview
Connie's Nail is a full-stack web application for a traditional nail salon featuring comprehensive nail care and spa services. The platform provides multi-language support (Korean/English), detailed service menus with pricing, appointment booking, customer management, and PayPal payment integration. The application is built with a modern React frontend and Express.js backend, featuring Replit authentication.

## User Preferences
Preferred communication style: Simple, everyday language.

## User Preferences
- 비용 효율적인 솔루션 선호
- 단계적 배포 및 확장 희망
- nolsae.com 도메인으로 서비스 론칭 계획

## Recent Changes (July 2025)

### User Management System Implementation (July 23, 2025)
- **Complete User Level System**: Added comprehensive user management with level-based access control
  - Added "level" field to users table to distinguish between "admin" and "Customer" users
  - Created admin user with username "admin", password "1111", firstName "admin", lastName "admin"
  - Implemented User Management tab in admin dashboard with user creation functionality
  - Updated authentication to support both admin_users table and users table authentication
  - Fixed database schema issues with user_id/userId column mapping
  - Added comprehensive user creation API endpoint for admin-managed user registration

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
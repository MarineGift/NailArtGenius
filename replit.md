# ConnieNail Admin Dashboard

## Project Overview
A cutting-edge luxury nail salon admin management system built with Next.js 15, TypeScript, and Supabase. Features comprehensive customer relationship management (CRM), booking management, admin role-based access control, and a modern luxury design with purple/pink gradient theme.

## Technology Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Backend**: Next.js API routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui components
- **Deployment**: Railway (standalone output)

## Key Features
- **Multi-tier Admin System**: Role-based access control (Super Admin, Admin, Editor, Viewer)
- **Customer CRM**: Phone-based customer identification with complete history tracking
- **Booking Management**: Advanced appointment scheduling with admin input tracking
- **Treatment History**: Complete service history with photos and notes
- **Communication System**: Email/SMS integration for customer outreach
- **Gallery Management**: Image upload with object storage integration
- **News & Content Management**: Article creation and publishing
- **Product & Carousel Management**: E-commerce ready with luxury UI
- **Real-time Dashboard**: Live statistics and luxury animations
- **Object Storage Integration**: Cloud-based file management

## Project Structure
```
├── app/                       # Next.js 15 App Router
│   ├── api/                  # API routes
│   │   ├── auth/user/        # Supabase authentication
│   │   ├── services/         # Nail services API
│   │   └── gallery/          # Gallery API
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main dashboard
│   └── globals.css           # Global styles with pastel theme
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── login-form.tsx        # Supabase auth form
│   ├── dashboard-tabs.tsx    # Main admin dashboard
│   └── [feature-components]  # CRM, booking, gallery managers
├── lib/                      # Utilities and configurations
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client
│   │   └── server.ts         # Server Supabase client
│   ├── auth.ts              # Authentication logic
│   ├── types.ts             # TypeScript definitions
│   └── utils.ts             # Utility functions
├── hooks/                    # React hooks
│   └── use-toast.ts         # Toast notifications
└── package.json             # Next.js dependencies only
```

## Database Schema (ConnieNail Supabase)
- **admin_users**: Multi-role admin authentication with permissions
- **customers**: Phone-based customer records with complete profiles
- **services**: Nail services with pricing and duration
- **bookings**: Appointment system with admin input tracking
- **treatments**: Complete treatment history with photos
- **customer_communications**: Email/SMS communication logs
- **gallery**: Image gallery with object storage integration
- **news**: News articles and blog posts
- **products**: Product catalog for e-commerce
- **carousel_images**: Homepage slider management

## Default Credentials
- Email: `admin@connienail.com`
- Password: `admin123`
- Role: `super_admin` (Full system access)

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side)
- `SENDGRID_API_KEY`: For email functionality (optional)

## Development Commands
- `next dev -p 5000`: Start development server
- `next build`: Build for production
- `next start -p 5000`: Start production server

## Recent Changes
- **2025-08-15**: Converted to 100% Next.js 15 App Router structure
- **2025-08-15**: Removed all unnecessary dependencies (Express, Drizzle, Vite, etc.)
- **2025-08-15**: Implemented pure Supabase authentication with SSR support
- **2025-08-15**: Beautiful pastel color theme with soft purple/pink gradients
- **2025-08-15**: Clean project structure using only Next.js, TypeScript, Supabase, Railway
- **2025-08-15**: Floating animations and glow effects for luxury UI
- **2025-08-15**: Korean interface elements integrated
- **2025-08-15**: Standalone build configuration for Railway deployment
- **2025-08-15**: **NEW: AR Virtual Nail Try-On Feature** - MediaPipe hand tracking with real-time nail design preview
- **2025-08-15**: **NEW: Comprehensive Nail Design Manager** - Full CRUD system for managing nail designs with trending features
- **2025-08-15**: **NEW: API Integration** - Real nail design data with color palettes, pricing, and categories
- **2025-08-15**: **NEW: Enhanced Dashboard** - 9 fully functional tabs including AR experience and design management
- **2025-08-15**: Fixed deployment configuration issues - created proper Next.js build scripts

## User Preferences
- **Language**: English only (all content and UI)
- **Framework**: Next.js 15 with App Router structure
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Railway
- **Design**: Professional admin dashboard with purple/blue gradient theme
- **Architecture**: Clean, modern, minimal dependencies

## Deployment Notes
- Configured for Railway deployment with Next.js standalone output
- All necessary environment variables should be set in Railway
- Supabase database will need to be configured separately
- No server-side dependencies required (serverless architecture)
- Professional design optimized for admin workflows
# ConnieNail Admin Dashboard

## Project Overview
A cutting-edge luxury nail salon admin management system built with Next.js 15, TypeScript, and Supabase. Features comprehensive customer relationship management (CRM), booking management, admin role-based access control, and a modern luxury design with purple/pink gradient theme.

## Technology Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Backend**: Next.js API routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Demo authentication (Supabase Auth ready)
- **Communication**: Email (SendGrid integration ready)

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
├── app/                       # Next.js App Router
│   ├── api/                  # API routes
│   │   └── customer-inquiries/
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main dashboard
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── login-form.tsx        # Authentication
│   ├── dashboard-tabs.tsx    # Main dashboard
│   ├── customer-inquiries.tsx
│   ├── gallery-manager.tsx
│   └── news-manager.tsx
├── lib/                      # Utilities and configurations
│   ├── auth.ts              # Authentication logic
│   ├── supabase.ts          # Supabase client
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Utility functions
├── hooks/                    # React hooks
│   └── use-toast.ts         # Toast notifications
└── package.json
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
- **2025-08-15**: Complete ConnieNail luxury admin system implementation
- **2025-08-15**: Multi-role admin authentication with Supabase backend
- **2025-08-15**: Phone-based customer CRM with complete history tracking
- **2025-08-15**: Advanced booking management with admin input tracking
- **2025-08-15**: Object storage integration for gallery management
- **2025-08-15**: Luxury UI design with purple/pink gradient theme
- **2025-08-15**: Comprehensive database schema for nail salon operations
- **2025-08-15**: Email/SMS communication system for customer outreach
- **2025-08-15**: Real-time dashboard with luxury animations and statistics

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
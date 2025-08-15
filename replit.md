# KICT Group Admin Dashboard

## Project Overview
A clean, modern admin management platform built with Next.js 15, TypeScript, and Supabase for handling customer inquiries, gallery management, and news management. Features a professional design with purple/blue gradient theme and full App Router architecture.

## Technology Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Backend**: Next.js API routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Demo authentication (Supabase Auth ready)
- **Communication**: Email (SendGrid integration ready)

## Key Features
- Modern admin authentication system
- Customer inquiry management dashboard
- Gallery management with image handling
- News article management and publishing
- Statistics overview dashboard
- Responsive design with dark mode support

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

## Database Schema (Supabase Ready)
- **customer_inquiries**: Customer contact messages and status
- **gallery**: Image gallery with categories and publishing status
- **news**: News articles with content and publishing workflow
- **admin_users**: Admin user authentication and roles
- **email_templates**: Customizable email response templates
- **sms_templates**: SMS response templates

## Default Credentials
- Email: `admin@kictgroup.com`
- Password: `admin123`

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
- **2025-08-15**: Complete migration to Next.js 15 + Supabase architecture
- **2025-08-15**: Removed all Express.js and Drizzle dependencies
- **2025-08-15**: Implemented clean App Router structure
- **2025-08-15**: Created modern shadcn/ui component library
- **2025-08-15**: Added demo authentication system (Supabase Auth ready)
- **2025-08-15**: Built responsive dashboard with statistics overview
- **2025-08-15**: Cleaned up unnecessary files for Railway deployment

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
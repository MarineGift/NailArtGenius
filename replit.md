# KICT Group Admin Dashboard

## Project Overview
A comprehensive admin management platform built with Next.js and TypeScript for handling customer inquiries, gallery management, and news management. The system includes email and SMS functionality for customer responses and uses Supabase for database management.

## Technology Stack
- **Frontend**: Next.js 13+ with App Router, React, TypeScript
- **Backend**: Express.js API routes
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: JWT-based admin authentication
- **Communication**: Email (SendGrid integration ready) + SMS functionality

## Key Features
- Admin authentication system
- Customer inquiry management with email/SMS responses
- Gallery management with image upload capabilities
- News article management and publishing
- Dashboard with statistics overview
- Email and SMS template management

## Project Structure
```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main dashboard
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── login.tsx         # Authentication
│   │   ├── customer-inquiries.tsx
│   │   ├── gallery-manager.tsx
│   │   └── news-manager.tsx
│   └── lib/                   # Utilities
├── server/                    # Backend Express server
│   ├── routes.ts             # API routes
│   ├── storage.ts            # Database layer
│   └── seedData.ts           # Sample data seeding
├── shared/
│   └── schema.ts             # Database schema with Drizzle ORM
└── package.json
```

## Database Schema
- **customer_inquiries**: Customer contact messages and status
- **gallery**: Image gallery with categories and publishing status
- **news**: News articles with content and publishing workflow
- **admin_users**: Admin user authentication and roles
- **email_templates**: Customizable email response templates
- **sms_templates**: SMS response templates

## Default Credentials
- Username: `admin`
- Password: `admin123`
- Email: `admin@kictgroup.com`

## Environment Variables
- `DATABASE_URL`: Supabase PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token signing (optional, defaults to development key)
- `SENDGRID_API_KEY`: For email functionality (when implemented)

## Development Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run db:push`: Push database schema changes

## Recent Changes
- **2025-01-15**: Created clean Next.js admin system with TypeScript
- **2025-01-15**: Implemented customer inquiry management with email/SMS response
- **2025-01-15**: Added gallery management with image handling
- **2025-01-15**: Built news management system with publishing workflow
- **2025-01-15**: Set up Supabase integration with proper schema
- **2025-01-15**: Added admin authentication with JWT tokens

## User Preferences
- **Language**: English only (all content and UI)
- **Framework**: Next.js with App Router structure
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Railway (planned)
- **Design**: Professional admin dashboard with purple/blue gradient theme

## Deployment Notes
- Configured for Railway deployment with standalone output
- All necessary environment variables should be set in Railway
- Database schema will be automatically created on first run
- Sample data includes admin user and demo content
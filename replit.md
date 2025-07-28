# Connie's Nail - Multilingual Nail Salon Website

## Overview

This is a modern, multilingual nail salon website built with Next.js 14, featuring AI-powered nail art generation, online booking capabilities, and comprehensive customer management. The application supports four languages (Korean, English, Japanese, Spanish) and provides a mobile-first, PWA-enabled experience for nail salon customers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router for modern React development
- **Styling**: Tailwind CSS for utility-first styling with custom components
- **Internationalization**: Custom i18n solution with dynamic language routing
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Progressive Web App**: Service worker implementation for offline functionality

The application uses Next.js App Router with a `[lang]` dynamic route structure to handle multilingual content. Each page is server-rendered with language-specific dictionaries loaded at build time.

### Backend Architecture
- **API Layer**: Next.js API routes for server-side functionality
- **Database**: Configured for Supabase (PostgreSQL) with auth helpers
- **Authentication**: Supabase Auth integration with React hooks
- **State Management**: React Context and custom hooks for client-side state

### Data Storage Solutions
- **Primary Database**: Supabase (PostgreSQL) for user data, bookings, and content
- **File Storage**: Supabase Storage for images and media assets
- **Local Storage**: Browser localStorage for user preferences and temporary data

## Key Components

### Internationalization System
- **Language Support**: Korean (default), English, Japanese, Spanish
- **Routing**: Dynamic `[lang]` parameter in URL structure
- **Content Management**: JSON-based translation files in `/public/locales/`
- **Language Switching**: Client-side language selector with route preservation

### UI Component Library
- **Base Components**: Custom Button, Card components with Tailwind variants
- **Radix UI Integration**: Accessible components for dialogs, dropdowns, and form elements
- **Responsive Design**: Mobile-first approach with breakpoint-specific styling

### Service Worker & PWA
- **Offline Support**: Caches critical pages and resources
- **Installation**: Web app manifest for mobile app-like experience
- **Performance**: Background updates and resource optimization

## Data Flow

### User Journey
1. **Language Detection**: Middleware redirects to appropriate language route
2. **Content Loading**: Server-side dictionary loading for translations
3. **Navigation**: Client-side routing with language preservation
4. **API Communication**: Next.js API routes handle server interactions
5. **State Management**: React hooks manage authentication and user data

### Booking Flow
1. Service selection from multilingual service pages
2. AI nail art generation (if selected)
3. Appointment scheduling with real-time availability
4. Payment processing integration
5. Confirmation and reminder system

## External Dependencies

### Core Dependencies
- **Next.js 14**: React framework with App Router
- **Supabase**: Backend-as-a-Service for database and auth
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Tanstack Query**: Server state management

### Payment & Communication
- **Stripe**: Payment processing for bookings
- **PayPal**: Alternative payment method
- **SendGrid**: Email notifications and confirmations

### Development Tools
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast bundling for production builds
- **Drizzle**: Database ORM for type-safe queries

## Deployment Strategy

### Build Process
- **Development**: Local development server with hot reloading
- **Build**: Vite-based build system with ESBuild for server bundling
- **Production**: Node.js server deployment with optimized assets

### Environment Configuration
- **Database**: Neon Database (PostgreSQL) for production
- **Hosting**: Railway platform for seamless deployment
- **CDN**: Next.js automatic image optimization and static asset serving

### Database Management
- **Schema**: Drizzle ORM with PostgreSQL
- **Migrations**: Drizzle Kit for database schema management
- **Backup**: Automated backups through hosting platform

The application is designed for scalability with a clear separation between frontend and backend concerns, allowing for easy maintenance and feature expansion while supporting multiple languages and modern web standards.
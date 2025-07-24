# Supabase Database Setup Guide

This application has been configured to work with Supabase instead of Neon Database.

## Steps to Setup Supabase Database

### 1. Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Click "New Project"
3. Choose your organization
4. Enter project name: `connies-nail`
5. Enter a secure database password
6. Choose your region (preferably close to your users)
7. Click "Create new project"

### 2. Get Database Connection String
1. Once your project is created, go to **Settings** → **Database**
2. Scroll down to **Connection string** section
3. Copy the **URI** connection string (Transaction pooler)
4. Replace `[YOUR-PASSWORD]` with the database password you set in step 1

### 3. Add Database URL to Environment
1. In your Replit project, go to **Secrets** (lock icon in sidebar)
2. Add a new secret:
   - Key: `DATABASE_URL`
   - Value: Your Supabase connection string from step 2

### 4. Push Database Schema
After setting up the DATABASE_URL secret, run:
```bash
npm run db:push
```

This will create all the necessary tables in your Supabase database.

## Example Database URL Format
```
postgresql://postgres.xxxxxxxxxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

## Features Enabled with Supabase
- Real-time database subscriptions
- Built-in authentication (if needed later)
- Automatic backups
- Dashboard for database management
- Row Level Security (RLS)
- PostgREST API endpoints

## Migration Benefits
- More reliable hosting
- Better performance
- Built-in monitoring
- Free tier with generous limits
- Easy scaling options

Once you've completed these steps, your application will use Supabase as the database backend!
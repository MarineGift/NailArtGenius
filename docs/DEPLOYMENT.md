# Deployment Guide

## Railway Deployment

### Prerequisites
1. Railway account
2. GitHub repository
3. Supabase project with database URL

### Environment Variables
Create these environment variables in Railway:

```bash
DATABASE_URL=your_supabase_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deployment Steps
1. Connect GitHub repository to Railway
2. Set environment variables
3. Deploy automatically on push to main branch

### Domain Configuration
- Railway provides automatic domain: `your-app.railway.app`
- Custom domain can be configured in Railway dashboard

### Build Configuration
The project uses standard Next.js build process:
- Build command: `npm run build`
- Start command: `npm start`
- Node.js version: 18+

## GitHub Deployment

### Repository Setup
1. Create new GitHub repository
2. Push code to main branch
3. Enable GitHub Pages (if needed for documentation)

### Automatic Deployment
Railway automatically deploys when code is pushed to connected branch.
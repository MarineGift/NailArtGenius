# Deployment Guide

This guide covers deploying Connie's Nail website to Railway platform.

## 🚂 Railway Deployment

### Prerequisites

1. **GitHub Repository**: Your code must be in a GitHub repository
2. **Railway Account**: Sign up at [railway.app](https://railway.app)
3. **Supabase Project**: Set up your database

### Step 1: Prepare Your Repository

1. Ensure all your code is committed and pushed to GitHub
2. Your `package.json` should have a proper build script:
   ```json
   {
     "scripts": {
       "build": "next build",
       "start": "next start"
     }
   }
   ```

### Step 2: Connect to Railway

1. **Login to Railway**: Go to [railway.app](https://railway.app)
2. **Create New Project**: Click "New Project"
3. **Deploy from GitHub**: Select "Deploy from GitHub repo"
4. **Select Repository**: Choose your Connie's Nail repository
5. **Configure Settings**: Railway will auto-detect your Next.js app

### Step 3: Environment Variables

Set these variables in Railway dashboard:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Next.js
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=your_secret_key
```

### Step 4: Deploy

1. **Automatic Deployment**: Railway automatically deploys on git push
2. **Monitor Build**: Watch the build logs in Railway dashboard
3. **Custom Domain** (Optional): Add your custom domain in settings

## 🔧 Build Configuration

### Railway-specific Settings

Railway automatically detects Next.js projects, but you can customize:

1. **Start Command**: `npm start` (default)
2. **Build Command**: `npm run build` (default)
3. **Node Version**: Specified in `package.json` engines field

### Performance Optimization

```json
// package.json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 🌐 Custom Domain Setup

1. **Railway Dashboard**: Go to your project settings
2. **Domains**: Click "Add Domain"
3. **DNS Configuration**: Point your domain to Railway
4. **SSL**: Railway automatically provisions SSL certificates

## 📊 Monitoring

- **Logs**: View real-time logs in Railway dashboard
- **Metrics**: Monitor CPU, memory, and request metrics
- **Alerts**: Set up alerts for downtime or errors

## 🔄 Automatic Deployments

Railway automatically deploys when you:

1. Push to your main branch
2. Merge pull requests
3. Create new releases

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Railway dashboard
   - Ensure all dependencies are in `package.json`
   - Verify environment variables are set

2. **Runtime Errors**
   - Check runtime logs
   - Verify database connection
   - Ensure environment variables are correct

3. **Deployment Timeouts**
   - Optimize build process
   - Remove unnecessary dependencies
   - Use Railway's build cache

### Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: Community support
- GitHub Issues: Report bugs in your repository

## 📋 Deployment Checklist

- [ ] Code committed and pushed to GitHub
- [ ] Railway project created and connected
- [ ] Environment variables configured
- [ ] Supabase database set up
- [ ] Build successful
- [ ] Application accessible via Railway URL
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring set up

## 🎯 Next Steps

After successful deployment:

1. **Test All Features**: Verify multilingual support, AI features
2. **Performance Testing**: Check loading times and responsiveness
3. **SEO Setup**: Configure meta tags and sitemap
4. **Analytics**: Set up Google Analytics or similar
5. **Backup Strategy**: Regular database backups via Supabase
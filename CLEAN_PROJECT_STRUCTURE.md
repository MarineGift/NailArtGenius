# Clean Project Structure

## ✅ Reorganized Folder Structure

The project has been completely restructured from the complex Replit architecture to a clean, maintainable Next.js standard structure:

```
connienail-website/
├── README.md                   # Complete project documentation
├── next.config.js             # Next.js configuration
├── middleware.js              # Language routing middleware
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind CSS configuration
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
│
├── src/                      # Source code directory
│   ├── app/                  # Next.js App Router
│   │   ├── globals.css       # Global styles with Connie's Nail theme
│   │   ├── layout.js         # Root layout
│   │   ├── page.js           # Root page (redirects to /ko)
│   │   └── [lang]/           # Dynamic language routing
│   │       ├── layout.js     # Language-specific layout
│   │       ├── page.js       # Homepage with all sections
│   │       ├── services/     # Services pages
│   │       ├── booking/      # Booking system
│   │       ├── gallery/      # Gallery pages
│   │       ├── ai-nail-art/  # AI features
│   │       └── contact/      # Contact pages
│   │
│   ├── components/           # Reusable React components
│   │   ├── ui/              # Basic UI components (Button, Card, etc.)
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.js    # Main navigation header
│   │   │   ├── Footer.js    # Site footer
│   │   │   └── LanguageSelector.js # Language switcher
│   │   ├── sections/        # Page section components
│   │   │   ├── Hero.js      # Hero carousel section
│   │   │   ├── Services.js  # Services overview
│   │   │   ├── AIFeatures.js # AI nail art features
│   │   │   └── BookingCTA.js # Booking call-to-action
│   │   └── forms/           # Form components
│   │
│   ├── lib/                 # Utilities and configurations
│   │   ├── supabase/        # Supabase configuration
│   │   │   ├── client.js    # Client-side Supabase
│   │   │   └── server.js    # Server-side Supabase
│   │   ├── i18n/           # Internationalization
│   │   │   ├── config.js    # Language configuration
│   │   │   └── dictionaries.js # Translation loader
│   │   ├── utils/          # Utility functions
│   │   └── constants/      # App constants
│   │
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React contexts
│   ├── styles/             # Additional styles
│   └── types/              # TypeScript types
│
├── public/                 # Static assets
│   ├── locales/           # Translation files
│   │   ├── ko/           # Korean translations
│   │   │   └── common.json
│   │   ├── en/           # English translations
│   │   │   └── common.json
│   │   ├── ja/           # Japanese translations
│   │   │   └── common.json
│   │   └── es/           # Spanish translations
│   │       └── common.json
│   ├── images/           # Image assets
│   │   ├── common/       # Common images
│   │   ├── hero/         # Hero section images
│   │   └── icons/        # Icon files
│   ├── icons/            # PWA icons
│   ├── manifest.json     # PWA manifest
│   └── sw.js            # Service worker
│
├── docs/                 # Project documentation
│   ├── deployment.md     # Railway deployment guide
│   ├── i18n-guide.md     # Internationalization guide
│   └── contributing.md   # Contributing guidelines
│
└── scripts/             # Build and deployment scripts
    └── deploy.sh         # Railway deployment script
```

## 🔄 Key Improvements

### 1. **Standard Next.js Architecture**
- App Router structure with proper dynamic routing
- Server and Client Components separation
- Optimized for performance and SEO

### 2. **Clean Component Organization**
- Logical separation of UI, layout, and section components
- Reusable component structure
- Easy to locate and maintain

### 3. **Professional i18n Setup**
- Proper middleware for language detection
- Organized translation files
- Dynamic language routing with `/[lang]/`

### 4. **Supabase Integration**
- Clean client/server separation
- Proper environment variable handling
- Ready for production deployment

### 5. **Deployment Ready**
- Railway deployment configuration
- Proper build scripts
- Environment variable templates
- Professional documentation

## 🚀 Benefits

1. **Easy Maintenance**: Clear folder structure makes finding and updating code simple
2. **Scalable Architecture**: Standard Next.js patterns allow easy feature additions
3. **Professional Deployment**: Ready for GitHub + Railway deployment pipeline
4. **Developer Friendly**: Clear documentation and standard practices
5. **Multi-language Ready**: Proper i18n setup for global audience

## 📝 Next Steps

1. **Environment Setup**: Copy `.env.example` to `.env.local` and add Supabase credentials
2. **GitHub Repository**: Push to GitHub for version control
3. **Railway Deployment**: Connect repository to Railway for automatic deployment
4. **Custom Domain**: Configure custom domain in Railway dashboard
5. **Feature Development**: Add additional pages and features as needed

This clean structure ensures the project is maintainable, scalable, and ready for professional deployment.
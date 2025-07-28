# Connie's Nail - Multilingual Website

A modern, multilingual nail salon website built with Next.js, featuring AI-powered nail art generation, online booking, and comprehensive customer management.

## 🚀 Features

- **Multilingual Support**: Korean, English, Japanese, Spanish
- **AI Nail Art Generation**: Advanced AI-powered custom nail design
- **Online Booking System**: Real-time appointment scheduling
- **Supabase Backend**: Scalable database and authentication
- **PWA Support**: Mobile app-like experience
- **Responsive Design**: Mobile-first with Tailwind CSS

## 🏗️ Project Structure

```
my-multilang-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [lang]/            # Dynamic language routing
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── ui/               # Basic UI components
│   │   ├── layout/           # Layout components
│   │   ├── sections/         # Page sections
│   │   └── forms/            # Form components
│   ├── lib/                  # Utilities and configurations
│   │   ├── supabase/         # Supabase setup
│   │   ├── i18n/            # Internationalization
│   │   ├── utils/           # Utility functions
│   │   └── constants/        # App constants
│   ├── hooks/               # Custom React hooks
│   ├── context/             # React contexts
│   └── styles/              # Additional styles
├── public/                  # Static assets
│   ├── locales/            # Translation files
│   └── images/             # Image assets
├── docs/                   # Documentation
└── scripts/               # Build/deployment scripts
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Internationalization**: Custom i18n solution
- **Deployment**: Railway
- **Version Control**: GitHub

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd connienail-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌍 Supported Languages

- 🇰🇷 Korean (Default)
- 🇺🇸 English
- 🇯🇵 Japanese
- 🇪🇸 Spanish

## 🚀 Deployment

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm run deploy
```

## 📱 PWA Features

- Offline support
- App-like experience
- Push notifications
- Background sync

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Copy your project URL and anon key
3. Update `.env.local` with your credentials

### Railway Setup

1. Create Railway account
2. Connect GitHub repository
3. Configure environment variables
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

© 2025 Connie's Nail. All rights reserved.
# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
git clone <repository-url>
cd connienail-website
npm install
```

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials
3. Run `npm run dev`

## Project Structure
```
src/
├── app/              # Next.js App Router
│   ├── [lang]/       # Dynamic language routing
│   ├── api/          # API routes
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── ui/           # Basic UI components
│   ├── layout/       # Layout components
│   └── sections/     # Page sections
├── lib/              # Utilities and configurations
│   ├── supabase/     # Database setup
│   ├── i18n/         # Internationalization
│   └── utils/        # Helper functions
├── hooks/            # Custom React hooks
├── styles/           # Additional styles
└── types/            # TypeScript definitions
```

## Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Update translations if needed
4. Test across all supported languages
5. Submit pull request

## Code Style
- Use TypeScript for type safety
- Follow Next.js conventions
- Use Tailwind CSS for styling
- Implement responsive design first

## Testing
- Test all language variants
- Verify mobile responsiveness
- Check accessibility compliance
- Test Supabase integration
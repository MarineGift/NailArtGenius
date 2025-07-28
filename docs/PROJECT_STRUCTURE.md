# Project Structure Documentation

## Overview
This document explains the complete folder structure and organization of the Connie's Nail multilingual website project.

## Root Level Files (Documentation)
```
├── README.md                    # Main project description
├── FINAL_PROFESSIONAL_STRUCTURE.md  # Complete structure overview
├── STANDARD_NEXTJS_STRUCTURE.md     # Standard structure documentation
├── replit.md                    # Project memory and preferences
├── package.json                 # Dependencies and scripts
├── package-lock.json            # Dependency lock file
├── next-env.d.ts               # Next.js TypeScript definitions
├── tsconfig.json               # TypeScript configuration
├── .env.example                # Environment variables template
└── .gitignore                  # Git ignore rules
```

## Organized Folder Structure
```
├── src/                        # Source code
├── public/                     # Static assets
├── docs/                       # Documentation
├── scripts/                    # Automation scripts
├── config/                     # Configuration files
└── node_modules/               # Dependencies (auto-generated)
```

## Configuration Folder (`config/`)
All configuration files are centralized here for better maintainability:

- `app.js` - Application settings and constants
- `database.js` - Database connection configuration
- `next.config.js` - Next.js framework configuration
- `tailwind.config.js` - Tailwind CSS styling configuration
- `postcss.config.js` - PostCSS processing configuration
- `typescript.config.js` - TypeScript helper configuration

## Documentation Folder (`docs/`)
Professional documentation for all aspects of the project:

- `README.md` - Project overview and quick start
- `DEVELOPMENT.md` - Development guidelines and setup
- `DEPLOYMENT.md` - Deployment instructions for Railway/GitHub
- `I18N.md` - Internationalization implementation guide
- `PROJECT_STRUCTURE.md` - This file, explaining the structure

## Scripts Folder (`scripts/`)
Automation and development tools:

- `build.sh` - Production build automation with error checking
- `deploy.sh` - Deployment automation for Railway
- `setup.sh` - New developer environment setup
- `translate.js` - Translation file management and validation

## Source Folder (`src/`)
Standard Next.js 13+ App Router structure:

```
src/
├── app/                        # Next.js App Router
├── components/                 # React components
├── lib/                       # Libraries and utilities
├── hooks/                     # Custom React hooks
├── styles/                    # CSS and styling
├── context/                   # React Context providers
└── types/                     # TypeScript type definitions
```

## Benefits of This Structure

### 1. **Maintainability**
- Clear separation of concerns
- Easy to locate and modify files
- Logical grouping of related functionality

### 2. **Scalability**
- Easy to add new features
- Clear patterns for expansion
- Modular architecture

### 3. **Developer Experience**
- Intuitive folder organization
- Comprehensive documentation
- Automation tools for common tasks

### 4. **Professional Standards**
- Industry-standard Next.js structure
- Enterprise-level organization
- Ready for team collaboration

## File Naming Conventions

- **Components**: PascalCase (e.g., `Header.js`, `LanguageSelector.js`)
- **Utilities**: camelCase (e.g., `formatDate.js`, `apiHelpers.js`)
- **Configuration**: kebab-case or camelCase (e.g., `next.config.js`, `app.js`)
- **Documentation**: UPPERCASE or Title Case (e.g., `README.md`, `DEPLOYMENT.md`)

## Import Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```javascript
// Instead of: import Button from '../../../components/ui/Button'
import Button from '@/components/ui/Button'

// Available aliases:
// @/* - src folder
// @/components/* - components folder
// @/lib/* - lib folder
// @/hooks/* - hooks folder
// @/styles/* - styles folder
// @/config/* - config folder
```

This structure provides maximum maintainability, clear organization, and follows modern web development best practices.
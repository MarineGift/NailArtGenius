# Connie's Nail Salon - HTML Version

This is a standalone HTML/CSS/JavaScript version of the Connie's Nail Salon website, converted from the React application.

## Features

### 🌍 Multi-Language Support
- **English (Default)** 🇺🇸 - Complete translation
- **Korean** 🇰🇷 - 한국어 전체 번역
- **Japanese** 🇯🇵 - 日本語完全翻訳  
- **Spanish** 🇪🇸 - Traducción completa en español

### 💅 Core Functionality
- **Image Carousel** - Beautiful nail salon and art showcase
- **Service Catalog** - Complete pricing for all nail services
- **Booking System** - Online appointment booking form
- **Gallery** - Professional nail art designs
- **Contact Form** - Customer inquiry system with Google Maps
- **Responsive Design** - Works on all devices

### 🎨 Design Features
- Modern gradient color scheme
- Smooth animations and transitions
- Mobile-first responsive design
- Professional carousel with auto-advance
- Toast notification system
- Loading states and form validation

## File Structure

```
html-version/
├── index.html          # Main HTML file
├── styles.css          # Complete CSS styling
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Quick Start

1. **Open the website**: Simply open `index.html` in any modern web browser
2. **Language Switching**: Use the language dropdown in the top navigation
3. **Navigation**: Click any navigation link for smooth scrolling to sections
4. **Booking**: Fill out the booking form to make appointments
5. **Contact**: Use the contact form to send inquiries

## Language System

The application defaults to **English** and allows switching between:

- **English**: All content in English
- **Korean**: 모든 콘텐츠가 한국어로 표시
- **Japanese**: すべてのコンテンツが日本語で表示
- **Spanish**: Todo el contenido se muestra en español

Language preferences are automatically saved in browser localStorage.

## Sections

### 🏠 Home
- Hero carousel with salon images
- Premium service booking call-to-action
- AI-powered nail technology showcase

### 💄 Services
- **Spa Specials**: Premium spa treatments
- **Nail Treatments**: Complete manicure and pedicure services
- **Waxing**: Full-body waxing services
- **Pricing**: Clear pricing for all services

### 📅 Booking
- Service selection dropdown
- Date and time picker
- Customer information form
- Special requests section

### 🖼️ Gallery
- Professional nail art showcase
- Hover effects with descriptions
- Various nail design styles

### 📍 Contact
- Business information
- Contact form
- Google Maps integration
- Hours and location details

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #e91e63;
    --secondary-color: #8e24aa;
    --accent-color: #f06292;
}
```

### Translations
Add or modify translations in `script.js`:
```javascript
const translations = {
    'key.name': {
        en: 'English text',
        ko: '한국어 텍스트',
        ja: '日本語テキスト',
        es: 'Texto en español'
    }
};
```

### Images
Replace image paths in `index.html` with your own images:
```html
<img src="your-image-path.jpg" alt="Description">
```

## Business Information

**Connie's Nail Salon**
- 📍 Address: 1300 Pennsylvania Avenue NW, Washington, DC 20004
- 📞 Phone: 202.898.0826
- 🕒 Hours: Monday - Friday, 10:00 AM - 7:00 PM

## Technical Features

- **Responsive Grid Layouts**: CSS Grid and Flexbox
- **Smooth Animations**: CSS transitions and JavaScript interactions
- **Form Validation**: Client-side validation with error messages
- **Local Storage**: Language preference persistence
- **Toast Notifications**: Success/error message system
- **Carousel**: Auto-advancing image slider with manual controls

## Performance

- ⚡ Fast loading with minimal dependencies
- 📱 Mobile-optimized responsive design
- 🎯 SEO-friendly semantic HTML
- ♿ Accessible navigation and forms

## No Dependencies

This version uses only vanilla HTML, CSS, and JavaScript with no external frameworks or libraries except:
- Font Awesome icons (CDN)
- Google Fonts (CDN)

Perfect for deployment to any web hosting service!
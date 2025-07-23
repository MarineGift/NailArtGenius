import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Track PWA usage
if (window.matchMedia('(display-mode: standalone)').matches || 
    (window.navigator as any).standalone || 
    document.referrer.includes('android-app://')) {
  console.log('App is running as PWA');
}

// Add viewport meta tag for mobile devices
const viewport = document.querySelector('meta[name="viewport"]');
if (viewport) {
  viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no');
}

// Add PWA meta tags if not already present
const addMetaTag = (name: string, content: string) => {
  if (!document.querySelector(`meta[name="${name}"]`)) {
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
  }
};

const addLinkTag = (rel: string, href: string, sizes?: string) => {
  if (!document.querySelector(`link[rel="${rel}"]`)) {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (sizes) link.setAttribute('sizes', sizes);
    document.head.appendChild(link);
  }
};

// Add mobile app meta tags
addMetaTag('description', 'Professional nail care and beauty services with AI-powered design and online booking');
addMetaTag('theme-color', '#16a34a');
addMetaTag('apple-mobile-web-app-capable', 'yes');
addMetaTag('apple-mobile-web-app-status-bar-style', 'default');
addMetaTag('apple-mobile-web-app-title', "Connie's Nail");
addMetaTag('mobile-web-app-capable', 'yes');
addMetaTag('msapplication-TileColor', '#16a34a');

// Add manifest and icons
addLinkTag('manifest', '/manifest.json');
addLinkTag('apple-touch-icon', '/icons/icon.svg');
addLinkTag('icon', '/icons/icon.svg', '192x192');

// Prevent zoom on iOS
document.addEventListener('touchstart', function() {}, { passive: true });

// Handle install prompt
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('Install prompt deferred');
});

// Track app installation
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  deferredPrompt = null;
});

// Add CSS for mobile optimizations
const mobileStyles = `
  :root {
    --safe-area-inset-top: env(safe-area-inset-top);
    --safe-area-inset-right: env(safe-area-inset-right);
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
    --safe-area-inset-left: env(safe-area-inset-left);
  }
  
  body {
    padding-top: var(--safe-area-inset-top);
    padding-right: var(--safe-area-inset-right);
    padding-bottom: var(--safe-area-inset-bottom);
    padding-left: var(--safe-area-inset-left);
    -webkit-text-size-adjust: 100%;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    overscroll-behavior: none;
  }
  
  /* Hide scrollbars but allow scrolling */
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  
  /* Mobile touch improvements */
  button, input, select, textarea {
    -webkit-appearance: none;
    border-radius: 0;
  }
  
  /* Prevent pull-to-refresh */
  body {
    overscroll-behavior-y: contain;
  }
  
  /* Status bar adjustments for PWA */
  @media (display-mode: standalone) {
    body {
      padding-top: calc(var(--safe-area-inset-top) + 20px);
    }
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = mobileStyles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
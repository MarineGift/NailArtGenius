// PWA utility functions for mobile app functionality

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  showUpdateNotification();
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

export const showUpdateNotification = () => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('App Update Available', {
      body: 'A new version of Connie\'s Nail is available. Refresh to update.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: 'app-update'
    });
  }
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const isStandalone = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone ||
         document.referrer.includes('android-app://');
};

export const getInstallPrompt = () => {
  return new Promise((resolve) => {
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      resolve(deferredPrompt);
    });
    
    // Timeout after 5 seconds if no prompt event
    setTimeout(() => resolve(null), 5000);
  });
};

export const trackPWAUsage = () => {
  // Track PWA installation and usage
  if (isStandalone()) {
    console.log('App is running as PWA');
    
    // Send analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'pwa_launch', {
        event_category: 'PWA',
        event_label: 'App Launch'
      });
    }
  }
};

export const enableOfflineMode = () => {
  // Handle offline/online events
  window.addEventListener('online', () => {
    console.log('App is online');
    document.body.classList.remove('offline');
    
    // Sync offline actions when back online
    syncOfflineActions();
  });
  
  window.addEventListener('offline', () => {
    console.log('App is offline');
    document.body.classList.add('offline');
    
    // Show offline indicator
    showOfflineIndicator();
  });
};

const syncOfflineActions = () => {
  // Sync any offline bookings or data
  const offlineActions = JSON.parse(localStorage.getItem('offlineActions') || '[]');
  
  offlineActions.forEach(async (action: any) => {
    try {
      await fetch(action.url, {
        method: action.method,
        headers: action.headers,
        body: action.body
      });
      
      console.log('Synced offline action:', action);
    } catch (error) {
      console.error('Failed to sync offline action:', error);
    }
  });
  
  // Clear synced actions
  localStorage.removeItem('offlineActions');
};

const showOfflineIndicator = () => {
  const indicator = document.createElement('div');
  indicator.id = 'offline-indicator';
  indicator.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #f59e0b;
      color: white;
      text-align: center;
      padding: 8px;
      font-size: 14px;
      z-index: 9999;
    ">
      📴 You're offline. Some features may be limited.
    </div>
  `;
  
  document.body.appendChild(indicator);
};

export const addToHomeScreen = async () => {
  const prompt = await getInstallPrompt();
  
  if (prompt) {
    (prompt as any).prompt();
    const { outcome } = await (prompt as any).userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      return true;
    } else {
      console.log('User dismissed the install prompt');
      return false;
    }
  }
  
  return false;
};

export const shareContent = async (data: { title: string; text: string; url: string }) => {
  if (navigator.share) {
    try {
      await navigator.share(data);
      console.log('Content shared successfully');
      return true;
    } catch (error) {
      console.error('Error sharing content:', error);
      return false;
    }
  } else {
    // Fallback for browsers that don't support Web Share API
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(data.url);
      console.log('URL copied to clipboard');
      return true;
    }
    return false;
  }
};

export const vibrate = (pattern: number | number[]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

export const setStatusBarStyle = (style: 'default' | 'dark' | 'light') => {
  const metaTag = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (metaTag) {
    metaTag.setAttribute('content', style);
  }
};
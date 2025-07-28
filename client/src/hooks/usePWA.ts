import { useState, useEffect } from 'react';
import { 
  registerServiceWorker, 
  requestNotificationPermission, 
  isStandalone, 
  trackPWAUsage,
  enableOfflineMode 
} from '@/utils/pwa';

interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  hasNotificationPermission: boolean;
  installPromptEvent: any;
  canInstall: boolean;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    hasNotificationPermission: false,
    installPromptEvent: null,
    canInstall: false,
  });

  useEffect(() => {
    // Initialize PWA functionality
    const initializePWA = async () => {
      // Register service worker
      registerServiceWorker();
      
      // Track PWA usage
      trackPWAUsage();
      
      // Enable offline mode handling
      enableOfflineMode();
      
      // Check if app is already installed
      const installed = isStandalone();
      
      // Check notification permission
      const hasNotifications = Notification.permission === 'granted';
      
      setPwaState(prev => ({
        ...prev,
        isInstalled: installed,
        hasNotificationPermission: hasNotifications,
      }));
    };

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaState(prev => ({
        ...prev,
        installPromptEvent: e,
        canInstall: true,
      }));
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setPwaState(prev => ({
        ...prev,
        isInstalled: true,
        canInstall: false,
        installPromptEvent: null,
      }));
    };

    // Listen for online/offline
    const handleOnline = () => {
      setPwaState(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setPwaState(prev => ({ ...prev, isOnline: false }));
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize
    initializePWA();

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (pwaState.installPromptEvent) {
      pwaState.installPromptEvent.prompt();
      const { outcome } = await pwaState.installPromptEvent.userChoice;
      
      if (outcome === 'accepted') {
        setPwaState(prev => ({
          ...prev,
          canInstall: false,
          installPromptEvent: null,
        }));
        return true;
      }
    }
    return false;
  };

  const requestNotifications = async () => {
    const granted = await requestNotificationPermission();
    setPwaState(prev => ({
      ...prev,
      hasNotificationPermission: granted,
    }));
    return granted;
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (pwaState.hasNotificationPermission) {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options,
      });
    }
  };

  const addToCalendar = (booking: any) => {
    const startDate = new Date(booking.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const event = {
      title: `Connie's Nail Appointment - ${booking.serviceName}`,
      start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      description: `Nail appointment at Connie's Nail. Service: ${booking.serviceName}`,
      location: "Connie's Nail Salon",
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return {
    ...pwaState,
    installApp,
    requestNotifications,
    sendNotification,
    addToCalendar,
  };
};
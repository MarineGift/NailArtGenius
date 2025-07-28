import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor, Settings } from 'lucide-react';

const PWAStatus: React.FC = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone ||
                  document.referrer.includes('android-app://');
    
    setIsInstalled(isPWA);

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-lg border">
        {isInstalled ? (
          <Badge variant="default" className="bg-green-600">
            <Smartphone className="h-3 w-3 mr-1" />
            PWA Installed
          </Badge>
        ) : (
          <Badge variant="secondary">
            <Monitor className="h-3 w-3 mr-1" />
            Web App
          </Badge>
        )}
        
        <Badge variant={isOnline ? "default" : "destructive"}>
          {isOnline ? "Online" : "Offline"}
        </Badge>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.location.href = '/pwa-test'}
          className="h-6 px-2"
        >
          <Settings className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default PWAStatus;
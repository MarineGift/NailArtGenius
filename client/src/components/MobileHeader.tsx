import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, ArrowLeft, Share, Home } from 'lucide-react';
import { useLocation } from 'wouter';
import { usePWA } from '@/hooks/usePWA';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  showShare?: boolean;
  onMenuClick?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = false,
  showMenu = false,
  showShare = false,
  onMenuClick,
}) => {
  const [, setLocation] = useLocation();
  const { isInstalled } = usePWA();

  const handleBack = () => {
    window.history.back();
  };

  const handleShare = async () => {
    const shareData = {
      title: `${title} - Connie's Nail`,
      text: 'Professional nail care and beauty services',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        // Show toast notification
      }
    }
  };

  const handleHome = () => {
    setLocation('/');
  };

  return (
    <div className="sticky top-0 z-50 bg-green-600 text-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-white hover:bg-green-700 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          {showMenu && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="text-white hover:bg-green-700 p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {showShare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-white hover:bg-green-700 p-2"
            >
              <Share className="h-4 w-4" />
            </Button>
          )}
          
          {isInstalled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHome}
              className="text-white hover:bg-green-700 p-2"
            >
              <Home className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Status bar spacer for iOS */}
      <div className="h-safe-top" />
    </div>
  );
};

export default MobileHeader;
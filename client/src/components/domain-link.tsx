import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DomainLinkProps {
  url: string;
  children: React.ReactNode;
  className?: string;
}

export function DomainLink({ url, children, className = "" }: DomainLinkProps) {
  const handleClick = () => {
    // Open in new tab/window
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 ${className}`}
    >
      {children}
      <ExternalLink className="h-4 w-4" />
    </Button>
  );
}

export default DomainLink;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DeploymentStatusProps {
  deploymentUrl?: string;
  customDomain?: string;
  status?: 'deployed' | 'pending' | 'error';
  deployedMinutesAgo?: number;
}

export default function DeploymentStatus({ 
  deploymentUrl = "https://nail-art-genius-MarineGift.replit.app",
  customDomain = "https://marinecosmetic.com",
  status = "deployed",
  deployedMinutesAgo = 10 
}: DeploymentStatusProps) {
  
  const handleDomainClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'deployed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'deployed':
        return `Marine deployed ${deployedMinutesAgo} minutes ago`;
      case 'pending':
        return 'Deployment in progress...';
      case 'error':
        return 'Deployment failed';
      default:
        return 'Unknown status';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Production</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Status</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-sm">{getStatusText()}</span>
          </div>
        </div>

        {/* Visibility */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Visibility</span>
          <Badge variant="outline" className="flex items-center space-x-1">
            <span>🌐</span>
            <span>Public</span>
          </Badge>
        </div>

        {/* Domain Links */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Domain</span>
          
          {/* Primary Replit Domain */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDomainClick(deploymentUrl)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 p-0 h-auto"
            >
              <span className="text-sm">{deploymentUrl}</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>

          {/* Custom Domain */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDomainClick(customDomain)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 p-0 h-auto"
            >
              <span className="text-sm">{customDomain}</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Badge variant="secondary" className="text-xs">
              verifying
            </Badge>
          </div>

          {/* Buy Domain Link */}
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>🔗</span>
            <Button
              variant="link"
              size="sm"
              className="text-xs p-0 h-auto text-blue-600 hover:text-blue-800"
              onClick={() => window.open('https://replit.com/domains', '_blank')}
            >
              Buy a new domain
            </Button>
            <Badge variant="outline" className="text-xs">
              Beta
            </Badge>
          </div>
        </div>

        {/* Resource Usage */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span className="font-medium">Type</span>
          <span>Autoscale (0 vCPU / 8 GiB RAM / 3 Max)</span>
          <Button
            variant="link"
            size="sm"
            className="text-xs p-0 h-auto text-blue-600 hover:text-blue-800"
            onClick={() => window.open('https://replit.com/pricing', '_blank')}
          >
            Manage
          </Button>
          <Button
            variant="link"
            size="sm"
            className="text-xs p-0 h-auto text-blue-600 hover:text-blue-800"
            onClick={() => window.open('/admin-dashboard', '_self')}
          >
            See all usage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
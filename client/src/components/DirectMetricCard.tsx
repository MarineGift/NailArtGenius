import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DirectMetricCardProps {
  title: string;
  value: string | number;
  description: string;
  iconComponent: React.ReactNode;
  borderClass: string;
  onClick: () => void;
}

export function DirectMetricCard({ 
  title, 
  value, 
  description, 
  iconComponent, 
  borderClass, 
  onClick 
}: DirectMetricCardProps) {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow duration-200 ${borderClass} border-2`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {iconComponent}
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {value}
            </div>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
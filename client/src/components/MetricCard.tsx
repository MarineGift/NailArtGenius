import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  borderColor: string;
  onClick: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  borderColor,
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`🔥 ${title} card clicked!`);
    alert(`${title} card clicked directly!`);
    onClick();
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow border-2 hover:${borderColor}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
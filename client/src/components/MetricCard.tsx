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
    console.log(`🔥 ${title} card clicked BEFORE prevent!`);
    e.preventDefault();
    e.stopPropagation();
    console.log(`🔥 ${title} card clicked AFTER prevent!`);
    alert(`${title} card clicked directly!`);
    console.log(`🔥 About to call onClick for ${title}`);
    onClick();
    console.log(`🔥 onClick called for ${title}`);
  };

  console.log(`MetricCard ${title} rendering`);
  
  return (
    <div 
      onClick={handleClick}
      style={{ 
        cursor: 'pointer',
        border: '3px solid red',
        padding: '4px',
        margin: '2px'
      }}
      onMouseEnter={() => console.log(`Mouse entered ${title}`)}
      onMouseLeave={() => console.log(`Mouse left ${title}`)}
    >
      <Card 
        className={`hover:shadow-lg transition-shadow border-2 hover:${borderColor}`}
        style={{ cursor: 'pointer', pointerEvents: 'none' }}
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
    </div>
  );
};

export default MetricCard;
import React from 'react';

interface DirectMetricCardProps {
  title: string;
  value: number;
  description: string;
  iconComponent: React.ReactNode;
  borderClass: string;
  onClick: () => void;
}

const DirectMetricCard: React.FC<DirectMetricCardProps> = ({
  title,
  value,
  description,
  iconComponent,
  borderClass,
  onClick
}) => {
  return (
    <div 
      onClick={() => {
        console.log(`🔥 ${title} clicked!`);
        onClick();
      }}
      style={{
        cursor: 'pointer',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '500', margin: 0, color: '#374151' }}>{title}</h3>
        {iconComponent}
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
        {value}
      </div>
      <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
        {description}
      </p>
    </div>
  );
};

export default DirectMetricCard;
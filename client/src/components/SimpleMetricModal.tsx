import React from 'react';

interface SimpleMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any[];
  totalCount: number;
}

const SimpleMetricModal: React.FC<SimpleMetricModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  totalCount
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 50000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '800px',
          maxHeight: '80vh',
          width: '100%',
          overflow: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '16px'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            margin: 0,
            color: '#1f2937'
          }}>
            {title} - Detailed View
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Total Count: {totalCount} | Data Loaded: {data.length}
          </p>
        </div>

        <div style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '16px', 
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#374151' }}>데이터 미리보기</h3>
          {data.length > 0 ? (
            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
              {data.slice(0, 10).map((item, index) => (
                <div key={index} style={{
                  padding: '8px',
                  borderBottom: '1px solid #d1d5db',
                  fontSize: '14px'
                }}>
                  <strong>{item.name || item.customerName || `Item ${index + 1}`}</strong>
                  {item.phoneNumber && <span> - {item.phoneNumber}</span>}
                  {item.email && <span> - {item.email}</span>}
                  {item.appointmentDate && <span> - {new Date(item.appointmentDate).toLocaleDateString()}</span>}
                </div>
              ))}
              {data.length > 10 && (
                <p style={{ margin: '8px 0 0 0', fontStyle: 'italic', color: '#6b7280' }}>
                  ... and {data.length - 10} more items
                </p>
              )}
            </div>
          ) : (
            <p style={{ margin: 0, color: '#6b7280' }}>데이터가 없습니다.</p>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleMetricModal;
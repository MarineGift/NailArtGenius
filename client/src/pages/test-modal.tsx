import { useState } from 'react';

export default function TestModal() {
  const [showModal, setShowModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleButtonClick = () => {
    console.log('Button clicked!');
    alert('JavaScript is working!');
    setClickCount(prev => prev + 1);
  };

  const showModalTest = () => {
    console.log('Modal test clicked!');
    setShowModal(true);
  };

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          color: '#1f2937', 
          marginBottom: '30px',
          textAlign: 'center',
          fontSize: '32px'
        }}>
          🧪 JavaScript & Modal Test Page
        </h1>

        {/* JavaScript Test Section */}
        <div style={{
          padding: '20px',
          backgroundColor: '#fef3c7',
          border: '3px solid #f59e0b',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h2 style={{ margin: '0 0 15px 0', color: '#92400e' }}>
            JavaScript Test Zone
          </h2>
          <p style={{ margin: '0 0 15px 0', color: '#92400e' }}>
            Click count: {clickCount}
          </p>
          <button 
            onClick={handleButtonClick}
            style={{
              padding: '15px 30px',
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              marginRight: '15px'
            }}
          >
            Test Alert & Counter
          </button>
          <button 
            onClick={showModalTest}
            style={{
              padding: '15px 30px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            Test Modal
          </button>
        </div>

        {/* Mock Dashboard Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            { title: 'Total Customers', count: 23, color: '#3b82f6', bgColor: '#dbeafe' },
            { title: 'Total Appointments', count: 45, color: '#10b981', bgColor: '#d1fae5' },
            { title: 'Today Visitors', count: 12, color: '#f59e0b', bgColor: '#fef3c7' },
            { title: 'Total Orders', count: 8, color: '#ef4444', bgColor: '#fee2e2' }
          ].map((card, index) => (
            <div 
              key={index}
              onClick={() => {
                console.log(`${card.title} clicked!`);
                alert(`${card.title}: ${card.count}`);
                setShowModal(true);
              }}
              style={{
                padding: '25px',
                backgroundColor: card.bgColor,
                border: `3px solid ${card.color}`,
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3 style={{ 
                margin: '0 0 10px 0', 
                color: '#1f2937',
                fontSize: '18px'
              }}>
                {card.title}
              </h3>
              <p style={{ 
                fontSize: '36px', 
                fontWeight: 'bold', 
                margin: '0 0 5px 0', 
                color: card.color 
              }}>
                {card.count}
              </p>
              <p style={{ 
                margin: 0, 
                color: '#6b7280', 
                fontSize: '14px',
                fontStyle: 'italic'
              }}>
                Click to view details
              </p>
            </div>
          ))}
        </div>

        {/* Status Display */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>
            Current Status
          </h3>
          <p style={{ margin: '5px 0', fontSize: '16px' }}>
            Modal Open: {showModal ? '✅ YES' : '❌ NO'}
          </p>
          <p style={{ margin: '5px 0', fontSize: '16px' }}>
            Button Clicks: {clickCount}
          </p>
          <p style={{ margin: '5px 0', fontSize: '16px', color: '#059669' }}>
            JavaScript Status: ✅ WORKING
          </p>
        </div>
      </div>

      {/* Test Modal */}
      {showModal && (
        <div 
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              transform: 'scale(1)',
              animation: 'modalIn 0.3s ease-out'
            }}
          >
            <div style={{
              fontSize: '64px',
              marginBottom: '20px'
            }}>
              🎉
            </div>
            <h2 style={{ 
              margin: '0 0 20px 0', 
              color: '#1f2937',
              fontSize: '28px'
            }}>
              Modal Test Success!
            </h2>
            <div style={{
              padding: '20px',
              backgroundColor: '#f0fdf4',
              border: '2px solid #10b981',
              borderRadius: '8px',
              marginBottom: '25px'
            }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#065f46' }}>
                ✅ JavaScript is working correctly
              </p>
              <p style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#065f46' }}>
                ✅ Modal rendering is functional
              </p>
              <p style={{ margin: '0', fontSize: '18px', color: '#065f46' }}>
                ✅ Click events are being handled
              </p>
            </div>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                padding: '15px 30px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              Close Modal
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
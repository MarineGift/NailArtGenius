import { useState, useEffect } from 'react';

export default function EmergencyTest() {
  const [clickCount, setClickCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    console.log('EmergencyTest component mounted');
    setStatus('React component loaded successfully');
  }, []);

  const handleTestClick = () => {
    console.log('Emergency test button clicked');
    setClickCount(prev => prev + 1);
    alert(`Emergency Test Success!\n\nClick Count: ${clickCount + 1}\nTime: ${new Date().toLocaleTimeString()}\nReact Status: Working`);
    setStatus(`Test completed at ${new Date().toLocaleTimeString()}`);
  };

  const handleCardClick = (title: string, count: number) => {
    console.log('Emergency card clicked:', title, count);
    alert(`${title}: ${count}\n\nOpening React modal...`);
    setModalOpen(true);
  };

  const handleModalTest = () => {
    console.log('Emergency modal test');
    setModalOpen(true);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#1f2937', 
          marginBottom: '30px',
          fontSize: '2.5rem'
        }}>
          Emergency React Test
        </h1>

        {/* Test Zone */}
        <div style={{
          padding: '25px',
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          border: '3px solid #f59e0b',
          borderRadius: '12px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#92400e', marginBottom: '20px' }}>
            React Emergency Test Zone
          </h2>
          <p style={{ color: '#92400e', marginBottom: '15px', fontSize: '1.1rem' }}>
            Status: {status}
          </p>
          <p style={{ color: '#92400e', marginBottom: '20px', fontSize: '1.1rem' }}>
            Click Count: {clickCount}
          </p>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={handleTestClick}
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Emergency Alert Test
            </button>
            <button 
              onClick={handleModalTest}
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Emergency Modal Test
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {[
            { title: 'Total Customers', count: 23, color: '#3b82f6', bg: '#dbeafe' },
            { title: 'Total Appointments', count: 45, color: '#10b981', bg: '#d1fae5' },
            { title: 'Today Visitors', count: 12, color: '#f59e0b', bg: '#fef3c7' },
            { title: 'Total Orders', count: 8, color: '#ef4444', bg: '#fee2e2' }
          ].map((card, index) => (
            <div 
              key={index}
              onClick={() => handleCardClick(card.title, card.count)}
              style={{
                padding: '25px',
                background: card.bg,
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
                fontSize: '1.1rem'
              }}>
                {card.title}
              </h3>
              <p style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                margin: '10px 0', 
                color: card.color 
              }}>
                {card.count}
              </p>
              <p style={{ 
                margin: 0, 
                color: '#6b7280', 
                fontSize: '0.9rem',
                fontStyle: 'italic'
              }}>
                Click for emergency test
              </p>
            </div>
          ))}
        </div>

        {/* Status Info */}
        <div style={{
          padding: '20px',
          background: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#374151' }}>
            Emergency System Status
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <strong>React Status:</strong> ✅ Working
            </div>
            <div>
              <strong>Modal Status:</strong> {modalOpen ? '🟢 Open' : '🔴 Closed'}
            </div>
            <div>
              <strong>Click Count:</strong> {clickCount}
            </div>
            <div>
              <strong>Last Update:</strong> {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Modal */}
      {modalOpen && (
        <div 
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
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
              background: 'white',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
              🚨
            </div>
            <h2 style={{ 
              margin: '0 0 20px 0', 
              color: '#1f2937',
              fontSize: '2rem'
            }}>
              Emergency Modal Success!
            </h2>
            <div style={{
              padding: '20px',
              background: '#f0fdf4',
              border: '2px solid #10b981',
              borderRadius: '8px',
              marginBottom: '25px'
            }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#065f46' }}>
                ✅ React component system working
              </p>
              <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#065f46' }}>
                ✅ State management functional
              </p>
              <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#065f46' }}>
                ✅ Event handling operational
              </p>
              <p style={{ margin: '0', fontSize: '1.1rem', color: '#065f46' }}>
                ✅ Modal rendering successful
              </p>
            </div>
            <div style={{
              padding: '15px',
              background: '#f0f9ff',
              borderRadius: '8px',
              marginBottom: '25px'
            }}>
              <p style={{ margin: '0', color: '#3b82f6', fontSize: '1rem' }}>
                Emergency Test Time: {new Date().toLocaleString()}
              </p>
            </div>
            <button 
              onClick={() => setModalOpen(false)}
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              Close Emergency Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
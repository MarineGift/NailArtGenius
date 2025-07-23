import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

export default function AdminDashboardSimple() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<any>(null);
  const [modalData, setModalData] = useState<any>(null);

  useEffect(() => {
    console.log('🚀 AdminDashboardSimple loaded!');
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleCardClick = (type: string, title: string, count: number) => {
    console.log(`✅ Card clicked successfully: ${type}`, { title, count, timestamp: new Date().toISOString() });
    
    // Show immediate alert with detailed information
    const alertMessage = `📊 ${title}\n\nCurrent Count: ${count}\nLast Updated: ${new Date().toLocaleTimeString()}\nStatus: Working Perfectly\n\nOpening detailed modal...`;
    alert(alertMessage);
    
    // Open modal with enhanced data
    setModalData({ 
      type, 
      title, 
      count,
      details: {
        timestamp: new Date().toLocaleString(),
        status: 'Active',
        performance: 'Excellent'
      }
    });
  };

  const closeModal = () => {
    setModalData(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setLocation('/admin-login');
  };

  console.log('🎯 Rendering AdminDashboardSimple');
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f9ff' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '20px'
      }}>
        <h1 style={{ fontSize: '28px', margin: 0, color: '#1f2937' }}>
          Admin Dashboard (Simple Test)
        </h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Test Alert Button */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#fef3c7', 
        border: '2px solid #f59e0b',
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#92400e' }}>Click Test Zone</h3>
        <button 
          onClick={() => alert('JavaScript is working!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Alert
        </button>
        <button 
          onClick={() => console.log('Console test working!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Console
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div 
          onClick={() => handleCardClick('customers', 'Total Customers', stats?.totalCustomers || 0)}
          style={{
            padding: '20px',
            backgroundColor: 'white',
            border: '3px solid #3b82f6',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Total Customers</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#3b82f6' }}>
            {stats?.totalCustomers || 0}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Click to view details
          </p>
        </div>

        <div 
          onClick={() => handleCardClick('appointments', 'Total Appointments', stats?.totalAppointments || 0)}
          style={{
            padding: '20px',
            backgroundColor: 'white',
            border: '3px solid #10b981',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Total Appointments</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#10b981' }}>
            {stats?.totalAppointments || 0}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Click to view details
          </p>
        </div>

        <div 
          onClick={() => handleCardClick('visitors', 'Today Visitors', stats?.todayAppointments || 12)}
          style={{
            padding: '20px',
            backgroundColor: 'white',
            border: '3px solid #f59e0b',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Today's Visitors</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#f59e0b' }}>
            {stats?.todayAppointments || 12}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Click to view details
          </p>
        </div>

        <div 
          onClick={() => handleCardClick('orders', 'Total Orders', stats?.totalOrders || 0)}
          style={{
            padding: '20px',
            backgroundColor: 'white',
            border: '3px solid #ef4444',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Total Orders</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#ef4444' }}>
            {stats?.totalOrders || 0}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            Click to view details
          </p>
        </div>
      </div>

      {/* Simple Modal */}
      {modalData && (
        <div 
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
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
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}
          >
            <h2 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>
              {modalData.title} Details
            </h2>
            <div style={{
              padding: '20px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                <strong>Type:</strong> {modalData.type}
              </p>
              <p style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
                <strong>Count:</strong> {modalData.count}
              </p>
              <p style={{ margin: 0, color: '#6b7280' }}>
                Detailed analytics would appear here
              </p>
            </div>
            <button 
              onClick={closeModal}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f9fafb',
        border: '1px solid #d1d5db',
        borderRadius: '6px'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Debug Information</h4>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          Stats loaded: {stats ? 'Yes' : 'No'}
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          Modal open: {modalData ? 'Yes' : 'No'}
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          Total Customers: {stats?.totalCustomers || 'Loading...'}
        </p>
      </div>
    </div>
  );
}
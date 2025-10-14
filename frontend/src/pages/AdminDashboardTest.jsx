import React from 'react';

const AdminDashboardTest = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
          Admin Dashboard Test
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          If you can see this, the basic routing is working.
        </p>
        <div style={{ color: '#059669', fontWeight: '600' }}>
          ✅ Component is rendering successfully!
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardTest;

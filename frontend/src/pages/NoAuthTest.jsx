import React from 'react';

const NoAuthTest = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#10b981',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        🟢 NO AUTH TEST - STABLE PAGE
      </div>
      
      <div style={{ fontSize: '1rem', fontWeight: 'normal', maxWidth: '600px' }}>
        <p>If this page stays visible without crashing, then the issue is with AuthContext.</p>
        <p>This page doesn't use any authentication or API calls.</p>
        <br />
        <p><strong>Next steps:</strong></p>
        <ul style={{ textAlign: 'left', paddingLeft: '2rem' }}>
          <li>If this page is stable → AuthContext is crashing</li>
          <li>If this page also crashes → There's a deeper React issue</li>
        </ul>
      </div>
    </div>
  );
};

export default NoAuthTest;

import React from 'react';

const MinimalApp = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#3b82f6',
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
        🔵 MINIMAL APP TEST
      </div>
      
      <div style={{ fontSize: '1rem', fontWeight: 'normal', maxWidth: '600px' }}>
        <p>This is a minimal version without complex components.</p>
        <p>If this works, we'll add components one by one to find the issue.</p>
        <br />
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="/no-auth-test" 
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#10b981', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px' 
            }}
          >
            No Auth Test
          </a>
          
          <a 
            href="/minimal-login" 
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#1e40af', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px' 
            }}
          >
            Minimal Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default MinimalApp;

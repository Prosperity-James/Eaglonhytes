import React, { useState, useEffect } from 'react';

const MinimalAdmin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost/Eaglonhytes/api/session.php', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success && data.user && data.user.is_admin) {
          setUser(data.user);
        } else {
          // Redirect to login if not admin
          window.location.href = '/minimal-login';
        }
      } catch (error) {
        console.error('Session check failed:', error);
        window.location.href = '/minimal-login';
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#6366f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#6366f1',
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '8px'
        }}>
          <h1 style={{ margin: 0 }}>🟣 Minimal Admin Dashboard</h1>
          <div>
            Welcome, {user?.full_name} | 
            <button 
              onClick={() => window.location.href = '/minimal-login'}
              style={{
                marginLeft: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </header>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: '2rem',
            borderRadius: '8px'
          }}>
            <h2>✅ Admin Dashboard Working!</h2>
            <p>This minimal admin dashboard proves that:</p>
            <ul>
              <li>✅ Authentication is working</li>
              <li>✅ Session management works</li>
              <li>✅ Admin access control works</li>
              <li>✅ API communication is stable</li>
            </ul>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: '2rem',
            borderRadius: '8px'
          }}>
            <h2>🔧 Next Steps</h2>
            <p>Now we can gradually add features:</p>
            <ul>
              <li>Add navigation sidebar</li>
              <li>Add data management components</li>
              <li>Import the refactored hooks</li>
              <li>Test each component individually</li>
            </ul>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: '2rem',
            borderRadius: '8px'
          }}>
            <h2>👤 User Info</h2>
            <pre style={{ 
              backgroundColor: 'rgba(0,0,0,0.3)', 
              padding: '1rem', 
              borderRadius: '4px',
              fontSize: '0.8rem',
              overflow: 'auto'
            }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalAdmin;

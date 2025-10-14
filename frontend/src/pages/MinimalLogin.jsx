import React, { useState } from 'react';

const MinimalLogin = () => {
  const [email, setEmail] = useState('iam111@gmail.com');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('Attempting login...');

    try {
      const response = await fetch('http://localhost/Eaglonhytes/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(`✅ Login successful! Welcome ${data.user.full_name}`);
        
        // Redirect to admin if admin user
        if (data.user.is_admin) {
          setTimeout(() => {
            window.location.href = '/minimal-admin';
          }, 1000);
        }
      } else {
        setResult(`❌ Login failed: ${data.message}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#1e40af',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: 'white'
    }}>
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: '2rem',
        borderRadius: '8px',
        minWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          🟡 Minimal Login Test
        </h1>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: 'none',
                color: '#000'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: 'none',
                color: '#000'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? '#6b7280' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {result && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            {result}
          </div>
        )}
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default MinimalLogin;

import React, { useState } from 'react';

const LoginTest = () => {
  const [email, setEmail] = useState('iam111@gmail.com');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('Testing login...');

    try {
      console.log('Attempting login with:', { email, password: '***' });
      
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

      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setResult(`✅ Login successful! Welcome ${data.user.full_name}`);
      } else {
        setResult(`❌ Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setResult(`❌ Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSession = async () => {
    setLoading(true);
    setResult('Testing session...');

    try {
      const response = await fetch('http://localhost/Eaglonhytes/api/session.php', {
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Session data:', data);

      if (data.success) {
        setResult(`✅ Session valid! User: ${data.user.full_name} (Admin: ${data.user.is_admin ? 'Yes' : 'No'})`);
      } else {
        setResult(`❌ No active session: ${data.message}`);
      }
    } catch (error) {
      console.error('Session error:', error);
      setResult(`❌ Session check failed: ${error.message}`);
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
      backgroundColor: '#f3f4f6',
      padding: '2rem',
      overflow: 'auto',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
          Login API Test
        </h1>
        
        <form onSubmit={testLogin} style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}
              required
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Testing...' : 'Test Login'}
            </button>
            
            <button
              type="button"
              onClick={testSession}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              Test Session
            </button>
          </div>
        </form>
        
        {result && (
          <div style={{
            padding: '1rem',
            backgroundColor: result.startsWith('✅') ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${result.startsWith('✅') ? '#10b981' : '#ef4444'}`,
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '14px',
            whiteSpace: 'pre-wrap'
          }}>
            {result}
          </div>
        )}
        
        <div style={{ marginTop: '2rem', fontSize: '14px', color: '#6b7280' }}>
          <p><strong>Instructions:</strong></p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>First click "Test Session" to see if you're already logged in</li>
            <li>If not logged in, enter your credentials and click "Test Login"</li>
            <li>Check the browser console (F12) for detailed error messages</li>
            <li>This will help identify the exact login issue</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginTest;

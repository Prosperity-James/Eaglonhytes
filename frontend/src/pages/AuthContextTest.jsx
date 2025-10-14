import React, { useState, useEffect } from 'react';

const AuthContextTest = () => {
  const [testResults, setTestResults] = useState({});
  const [currentTest, setCurrentTest] = useState('Starting...');

  useEffect(() => {
    const runTests = async () => {
      const results = {};
      
      try {
        setCurrentTest('Testing AuthContext import...');
        const { useAuth, AuthContext } = await import('../context/AuthContext');
        results.import = '✅ AuthContext imported successfully';
        
        setCurrentTest('Testing useAuth hook...');
        // This is where it might crash
        const authData = useAuth();
        results.useAuth = '✅ useAuth hook executed';
        
        setCurrentTest('Testing auth data...');
        results.user = authData?.user ? `✅ User: ${authData.user.full_name}` : '❌ No user data';
        results.logout = authData?.logout ? '✅ Logout function available' : '❌ No logout function';
        
        setCurrentTest('All tests completed!');
        results.overall = '✅ AuthContext working correctly';
        
      } catch (error) {
        results.error = `❌ Failed at: ${currentTest} - ${error.message}`;
        results.errorStack = error.stack;
        setCurrentTest(`FAILED: ${error.message}`);
        console.error('AuthContext test error:', error);
      }
      
      setTestResults(results);
    };

    // Add a small delay to ensure component mounts first
    const timeoutId = setTimeout(runTests, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#dc2626',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: 'white',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '800px',
        width: '100%'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          🔴 AuthContext Test
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3>Current Test: {currentTest}</h3>
        </div>
        
        <div style={{ 
          backgroundColor: 'rgba(0,0,0,0.3)', 
          padding: '1.5rem', 
          borderRadius: '6px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          <h4>Test Results:</h4>
          {Object.entries(testResults).map(([key, value]) => (
            <div key={key} style={{ 
              marginBottom: '0.5rem',
              color: value.startsWith('✅') ? '#10b981' : '#fbbf24'
            }}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
          
          {Object.keys(testResults).length === 0 && (
            <div style={{ color: '#fbbf24' }}>⏳ Running tests...</div>
          )}
        </div>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a 
            href="/no-auth-test" 
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#10b981', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '6px',
              marginRight: '1rem'
            }}
          >
            ← Back to Safe Page
          </a>
          
          <button
            onClick={() => window.location.reload()}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Retry Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthContextTest;

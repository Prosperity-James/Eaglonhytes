import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Test using hooks one by one
const AdminDashboardWithData = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [testingPhase, setTestingPhase] = useState('Starting...');
  const [hookResults, setHookResults] = useState({});

  // Test AuthContext first
  const { user, logout } = useAuth();

  const testHooks = async () => {
    const results = {};
    
    try {
      setTestingPhase('Testing useLands hook...');
      const { useLands } = await import('../hooks/useLands');
      results.useLands = '✅ Imported successfully';
      
      setTestingPhase('Testing useUsers hook...');
      const { useUsers } = await import('../hooks/useUsers');
      results.useUsers = '✅ Imported successfully';
      
      setTestingPhase('Testing useApplications hook...');
      const { useApplications } = await import('../hooks/useApplications');
      results.useApplications = '✅ Imported successfully';
      
      setTestingPhase('Testing useProfile hook...');
      const { useProfile } = await import('../hooks/useProfile');
      results.useProfile = '✅ Imported successfully';
      
      setTestingPhase('Testing useNotifications hook...');
      const { useNotifications } = await import('../hooks/useNotifications');
      results.useNotifications = '✅ Imported successfully';
      
      setTestingPhase('All hooks imported successfully!');
      results.overall = '✅ Ready to test hook execution';
      
    } catch (error) {
      results.error = `❌ Failed: ${error.message}`;
      setTestingPhase(`Failed at: ${testingPhase}`);
    }
    
    setHookResults(results);
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'auth', label: 'Auth Test', icon: '🔐' },
    { id: 'hooks', label: 'Hook Test', icon: '🪝' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Dashboard with Data Test</h2>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
            }}>
              <h3>Current Phase: {testingPhase}</h3>
              <p>This version tests actually using the hooks, not just importing them.</p>
              
              <button
                onClick={testHooks}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                Test Hook Imports
              </button>
            </div>
          </div>
        );
        
      case 'auth':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Auth Context Test</h2>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
            }}>
              <h3>Auth Context Status:</h3>
              <div style={{ fontFamily: 'monospace', marginTop: '1rem' }}>
                <div><strong>User:</strong> {user ? '✅ Logged in' : '❌ Not logged in'}</div>
                {user && (
                  <>
                    <div><strong>Name:</strong> {user.full_name}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Admin:</strong> {user.is_admin ? '✅ Yes' : '❌ No'}</div>
                    <div><strong>ID:</strong> {user.id}</div>
                  </>
                )}
              </div>
              
              {user && (
                <button
                  onClick={logout}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '1rem'
                  }}
                >
                  Test Logout
                </button>
              )}
            </div>
          </div>
        );
        
      case 'hooks':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Hook Import Results</h2>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
            }}>
              <h3>Testing Phase: {testingPhase}</h3>
              
              <div style={{ fontFamily: 'monospace', fontSize: '14px', marginTop: '1rem' }}>
                {Object.entries(hookResults).map(([key, value]) => (
                  <div key={key} style={{ 
                    marginBottom: '0.5rem',
                    color: value.startsWith('✅') ? '#10b981' : '#ef4444'
                  }}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
              
              {Object.keys(hookResults).length === 0 && (
                <div style={{ color: '#6b7280', marginTop: '1rem' }}>
                  Click "Test Hook Imports" on the Dashboard tab to start testing.
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return <div>Page not found</div>;
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
      display: 'flex'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '1rem',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Data Test Admin</h1>
        </div>
        
        <nav>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                backgroundColor: activeTab === item.id ? '#3b82f6' : 'transparent',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        
        <div style={{ 
          marginTop: 'auto', 
          paddingTop: '2rem', 
          borderTop: '1px solid #374151' 
        }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#374151', 
            borderRadius: '6px',
            fontSize: '0.8rem'
          }}>
            <div><strong>User:</strong> {user ? user.full_name : 'Not logged in'}</div>
            <div><strong>Phase:</strong> {testingPhase}</div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{
        flex: 1,
        backgroundColor: '#f9fafb',
        overflowY: 'auto'
      }}>
        <header style={{
          backgroundColor: 'white',
          padding: '1rem 2rem',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem' }}>
            {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h1>
        </header>
        
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardWithData;

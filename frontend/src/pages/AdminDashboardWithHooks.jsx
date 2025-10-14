import React, { useState, useEffect } from 'react';

// Test imports one by one to find the problematic one
const AdminDashboardWithHooks = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [importStatus, setImportStatus] = useState({});
  const [testingPhase, setTestingPhase] = useState('starting');

  useEffect(() => {
    const testImports = async () => {
      const results = {};
      
      try {
        setTestingPhase('Testing AuthContext...');
        const { useAuth } = await import('../context/AuthContext');
        results.useAuth = '✅ Success';
        
        setTestingPhase('Testing API utils...');
        const { api, endpoints } = await import('../utils/api');
        results.api = '✅ Success';
        
        setTestingPhase('Testing useLands hook...');
        const { useLands } = await import('../hooks/useLands');
        results.useLands = '✅ Success';
        
        setTestingPhase('Testing useUsers hook...');
        const { useUsers } = await import('../hooks/useUsers');
        results.useUsers = '✅ Success';
        
        setTestingPhase('Testing useApplications hook...');
        const { useApplications } = await import('../hooks/useApplications');
        results.useApplications = '✅ Success';
        
        setTestingPhase('Testing useProfile hook...');
        const { useProfile } = await import('../hooks/useProfile');
        results.useProfile = '✅ Success';
        
        setTestingPhase('Testing useNotifications hook...');
        const { useNotifications } = await import('../hooks/useNotifications');
        results.useNotifications = '✅ Success';
        
        setTestingPhase('Testing upload utils...');
        const { uploadImage, createImagePreviews } = await import('../utils/upload');
        results.upload = '✅ Success';
        
        setTestingPhase('Testing validation utils...');
        const { validateLandForm, validateUserForm } = await import('../utils/validation');
        results.validation = '✅ Success';
        
        setTestingPhase('Testing notification utils...');
        const { showSuccess, showError } = await import('../utils/notifications');
        results.notifications = '✅ Success';
        
        setTestingPhase('Testing ConfirmModal...');
        const ConfirmModal = await import('../components/ConfirmModal');
        results.ConfirmModal = '✅ Success';
        
        setTestingPhase('All imports successful!');
        results.overall = '✅ All imports working';
        
      } catch (error) {
        results.error = `❌ Failed at: ${testingPhase} - ${error.message}`;
        console.error('Import error:', error);
      }
      
      setImportStatus(results);
    };

    testImports();
  }, []);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'imports', label: 'Import Test', icon: '🔍' },
    { id: 'lands', label: 'Lands', icon: '🏢' },
    { id: 'users', label: 'Users', icon: '👥' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Dashboard with Hooks Test</h2>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
            }}>
              <h3>Testing Phase: {testingPhase}</h3>
              <p>This version tests all the refactored hooks and utilities to identify which one is causing issues.</p>
            </div>
          </div>
        );
        
      case 'imports':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Import Test Results</h2>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: '8px', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Current Phase: {testingPhase}</h3>
              
              <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                {Object.entries(importStatus).map(([key, value]) => (
                  <div key={key} style={{ 
                    marginBottom: '0.5rem',
                    color: value.startsWith('✅') ? '#10b981' : '#ef4444'
                  }}>
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
              
              {Object.keys(importStatus).length === 0 && (
                <div style={{ color: '#1e40af' }}>⏳ Testing imports...</div>
              )}
            </div>
          </div>
        );
        
      case 'lands':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Lands Management</h2>
            <p>If imports are successful, we'll add real land management here.</p>
          </div>
        );
        
      case 'users':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>User Management</h2>
            <p>If imports are successful, we'll add real user management here.</p>
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
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Hook Test Admin</h1>
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
            <div>Phase: {testingPhase}</div>
            <div>Status: {Object.keys(importStatus).length > 0 ? 'Testing...' : 'Starting...'}</div>
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

export default AdminDashboardWithHooks;

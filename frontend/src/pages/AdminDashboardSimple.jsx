import React, { useState } from 'react';

const AdminDashboardSimple = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'lands', label: 'Lands', icon: '🏢' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'applications', label: 'Applications', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Dashboard Overview</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem' 
            }}>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
              }}>
                <h3 style={{ color: '#3b82f6', margin: '0 0 0.5rem 0' }}>Total Lands</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>12</p>
              </div>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
              }}>
                <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Active Users</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>8</p>
              </div>
              <div style={{ 
                backgroundColor: 'white', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
              }}>
                <h3 style={{ color: '#1e40af', margin: '0 0 0.5rem 0' }}>Pending Applications</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>3</p>
              </div>
            </div>
          </div>
        );
      case 'lands':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Land Management</h2>
            <p>Land management features will be added here...</p>
          </div>
        );
      case 'users':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>User Management</h2>
            <p>User management features will be added here...</p>
          </div>
        );
      case 'applications':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Applications</h2>
            <p>Application management features will be added here...</p>
          </div>
        );
      case 'settings':
        return (
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Settings</h2>
            <p>Settings will be added here...</p>
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
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Eaglonhytes Admin</h1>
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
                fontSize: '0.9rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.backgroundColor = '#374151';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.target.style.backgroundColor = 'transparent';
                }
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
          <button
            onClick={() => window.location.href = '/minimal-login'}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.9rem'
            }}
          >
            <span>🚪</span>
            Logout
          </button>
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

export default AdminDashboardSimple;

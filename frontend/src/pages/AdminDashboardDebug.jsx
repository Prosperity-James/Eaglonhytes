import React, { useState, useEffect } from 'react';

// Simple debug version to test imports one by one
const AdminDashboardDebug = () => {
  const [debugInfo, setDebugInfo] = useState([]);
  
  useEffect(() => {
    const testImports = async () => {
      const results = [];
      
      try {
        // Test AuthContext
        const { useAuth } = await import('../context/AuthContext');
        results.push('✅ AuthContext imported successfully');
        
        // Test hooks
        const { useLands } = await import('../hooks/useLands');
        results.push('✅ useLands imported successfully');
        
        const { useUsers } = await import('../hooks/useUsers');
        results.push('✅ useUsers imported successfully');
        
        const { useApplications } = await import('../hooks/useApplications');
        results.push('✅ useApplications imported successfully');
        
        const { useProfile } = await import('../hooks/useProfile');
        results.push('✅ useProfile imported successfully');
        
        const { useNotifications } = await import('../hooks/useNotifications');
        results.push('✅ useNotifications imported successfully');
        
        // Test utils
        const { api, endpoints } = await import('../utils/api');
        results.push('✅ API utils imported successfully');
        
        const { uploadImage, createImagePreviews } = await import('../utils/upload');
        results.push('✅ Upload utils imported successfully');
        
        const { validateLandForm, validateUserForm } = await import('../utils/validation');
        results.push('✅ Validation utils imported successfully');
        
        const { showSuccess, showError } = await import('../utils/notifications');
        results.push('✅ Notification utils imported successfully');
        
        // Test components
        const ConfirmModal = await import('../components/ConfirmModal');
        results.push('✅ ConfirmModal imported successfully');
        
      } catch (error) {
        results.push(`❌ Import error: ${error.message}`);
        console.error('Import error:', error);
      }
      
      setDebugInfo(results);
    };
    
    testImports();
  }, []);

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
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
          AdminDashboard Import Debug
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Testing all imports to identify the issue:
        </p>
        
        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          {debugInfo.length === 0 ? (
            <div style={{ color: '#1e40af' }}>⏳ Testing imports...</div>
          ) : (
            debugInfo.map((info, index) => (
              <div key={index} style={{ 
                marginBottom: '0.5rem',
                color: info.startsWith('✅') ? '#059669' : '#dc2626'
              }}>
                {info}
              </div>
            ))
          )}
        </div>
        
        {debugInfo.length > 0 && (
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
            <strong>Next Steps:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              <li>If all imports are ✅, the issue is in the component logic</li>
              <li>If there are ❌ errors, fix those imports first</li>
              <li>Check the browser console for additional error details</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardDebug;

import React from 'react';

const SimpleTest = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: '#ff0000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: 'white',
      fontSize: '2rem',
      fontWeight: 'bold'
    }}>
      🔴 SIMPLE TEST - IF YOU SEE THIS, REACT IS WORKING!
    </div>
  );
};

export default SimpleTest;

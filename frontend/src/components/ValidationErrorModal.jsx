import React from 'react';
import '../styles/validation-modal.css';

const ValidationErrorModal = ({ isOpen, onClose, errors }) => {
  if (!isOpen || !errors || Object.keys(errors).length === 0) {
    return null;
  }

  const errorMessages = Object.values(errors).filter(Boolean);

  return (
    <div className="validation-modal-overlay" onClick={onClose}>
      <div className="validation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="validation-modal-header">
          <h3>⚠️ Input Validation Error</h3>
          <button className="validation-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="validation-modal-body">
          {errorMessages.map((message, index) => (
            <div key={index} className="validation-error-message">
              {message}
            </div>
          ))}
        </div>
        <div className="validation-modal-footer">
          <button className="validation-modal-button" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrorModal;

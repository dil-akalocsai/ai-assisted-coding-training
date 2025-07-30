import React from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  type?: 'error' | 'warning' | 'success' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info',
  onClose 
}) => {
  return (
    <div className={`toast toast--${type}`} role="alert">
      <div className="toast__content">
        <span className="toast__message">{message}</span>
        {onClose && (
          <button 
            className="toast__close" 
            onClick={onClose}
            aria-label="Close notification"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
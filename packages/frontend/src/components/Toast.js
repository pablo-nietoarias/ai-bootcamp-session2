import React from 'react';

const Toast = ({ toasts, onRemove }) => {
  if (!toasts.length) return null;

  return (
    <div className='toast-container'>
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button
            type='button'
            onClick={() => onRemove(toast.id)}
            aria-label='Close notification'
            className='toast-close-btn'
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;

import React from 'react';

const PrimaryButton = ({ children, onClick, type = 'button', disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className='primary-button'
    >
      {children}
    </button>
  );
};

export default PrimaryButton;

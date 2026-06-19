import React from 'react';

const SecondaryButton = ({ children, onClick, type = 'button', disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className='secondary-button'
    >
      {children}
    </button>
  );
};

export default SecondaryButton;

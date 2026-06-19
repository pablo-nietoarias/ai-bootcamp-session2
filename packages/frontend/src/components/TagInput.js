import React, { useState } from 'react';

const TagInput = ({ onAddTag }) => {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (!value.trim()) return;
    onAddTag(value.trim());
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <span className='tag-input'>
      <input
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Add tag...'
      />
      <button type='button' onClick={handleAdd} aria-label='Add tag'>+</button>
    </span>
  );
};

export default TagInput;

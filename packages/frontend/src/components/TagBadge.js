import React, { useState } from 'react';

const TagBadge = ({ tag, onRemove, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(tag.name);

  const handleNameClick = () => {
    setEditing(true);
    setEditValue(tag.name);
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== tag.name) {
      onEdit(tag.id, trimmed);
    }
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditing(false);
      setEditValue(tag.name);
    }
  };

  return (
    <span className='tag-badge'>
      {editing ? (
        <input
          type='text'
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className='tag-edit-input'
        />
      ) : (
        <span onClick={handleNameClick} className='tag-name'>{tag.name}</span>
      )}
      <button
        type='button'
        onClick={() => onRemove(tag.id)}
        aria-label={`Remove tag ${tag.name}`}
        className='tag-remove-btn'
      >
        ×
      </button>
    </span>
  );
};

export default TagBadge;

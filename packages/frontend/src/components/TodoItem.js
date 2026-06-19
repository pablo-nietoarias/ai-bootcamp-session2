import React from 'react';
import SecondaryButton from './SecondaryButton';
import TagBadge from './TagBadge';
import TagInput from './TagInput';

const TodoItem = ({ item, onDelete, onAddTag, onRemoveTag, onEditTag }) => {
  const formattedDate = item.due_date
    ? new Date(item.due_date).toLocaleDateString()
    : 'No due date';

  return (
    <li className='todo-item'>
      <div className='todo-item-main'>
        <span className='todo-item-name'>{item.name}</span>
        <span className='due-date'>{formattedDate}</span>
      </div>
      <div className='todo-item-tags'>
        {(item.tags || []).map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            onRemove={(tagId) => onRemoveTag(item.id, tagId)}
            onEdit={onEditTag}
          />
        ))}
        <TagInput onAddTag={(name) => onAddTag(item.id, name)} />
      </div>
      <SecondaryButton onClick={() => onDelete(item.id)}>Delete</SecondaryButton>
    </li>
  );
};

export default TodoItem;

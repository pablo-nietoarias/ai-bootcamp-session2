import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ items, onDelete, onAddTag, onRemoveTag, onEditTag }) => {
  if (!items.length) {
    return <p>No items found. Add some!</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          onDelete={onDelete}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
          onEditTag={onEditTag}
        />
      ))}
    </ul>
  );
};

export default TodoList;

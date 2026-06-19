import React, { useState } from 'react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

const TodoForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onAdd(name.trim(), dueDate || null);
    setName('');
    setDueDate('');
  };

  const handleClear = () => {
    setName('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Enter item name'
        required
      />
      <input
        type='date'
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <PrimaryButton type='submit'>Add Item</PrimaryButton>
      <SecondaryButton type='button' onClick={handleClear}>Clear</SecondaryButton>
    </form>
  );
};

export default TodoForm;

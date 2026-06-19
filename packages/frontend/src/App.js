import React, { useState, useEffect } from 'react';
import './App.css';
import useToast from './components/useToast';
import Toast from './components/Toast';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setTodos(result);
    } catch (err) {
      showToast('Failed to fetch data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (name, dueDate) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dueDate }),
      });
      if (!response.ok) {
        throw new Error('Failed to add item');
      }
      const result = await response.json();
      setTodos((prev) => [...prev, result]);
      showToast('Item added successfully', 'success');
    } catch (err) {
      showToast('Error adding item: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/items/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      setTodos((prev) => prev.filter((item) => item.id !== id));
      showToast('Item deleted', 'success');
    } catch (err) {
      showToast('Error deleting item: ' + err.message, 'error');
    }
  };

  const handleAddTag = async (itemId, name) => {
    try {
      const response = await fetch(`/api/items/${itemId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error('Failed to add tag');
      }
      const tag = await response.json();
      setTodos((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, tags: [...(item.tags || []), tag] }
            : item
        )
      );
      showToast('Tag added', 'success');
    } catch (err) {
      showToast('Error adding tag: ' + err.message, 'error');
    }
  };

  const handleRemoveTag = async (itemId, tagId) => {
    try {
      const response = await fetch(`/api/items/${itemId}/tags/${tagId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove tag');
      }
      setTodos((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, tags: (item.tags || []).filter((t) => t.id !== tagId) }
            : item
        )
      );
      showToast('Tag removed', 'success');
    } catch (err) {
      showToast('Error removing tag: ' + err.message, 'error');
    }
  };

  const handleEditTag = async (tagId, newName) => {
    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) {
        throw new Error('Failed to edit tag');
      }
      const updatedTag = await response.json();
      setTodos((prev) =>
        prev.map((item) => ({
          ...item,
          tags: (item.tags || []).map((t) =>
            t.id === tagId ? updatedTag : t
          ),
        }))
      );
      showToast('Tag updated', 'success');
    } catch (err) {
      showToast('Error updating tag: ' + err.message, 'error');
    }
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>React Frontend with Node Backend</h1>
        <p>Connected to in-memory database</p>
      </header>

      <main>
        <section className='add-item-section'>
          <h2>Add New Item</h2>
          <TodoForm onAdd={handleAdd} />
        </section>

        <section className='items-section'>
          <h2>Items from Database</h2>
          {loading && <p>Loading data...</p>}
          {!loading && (
            <TodoList
              items={todos}
              onDelete={handleDelete}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              onEditTag={handleEditTag}
            />
          )}
        </section>
      </main>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
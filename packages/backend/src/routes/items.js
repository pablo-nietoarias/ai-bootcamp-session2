const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const getItemTags = (itemId) => {
  return db.prepare(
    'SELECT t.id, t.name FROM tags t INNER JOIN item_tags it ON it.tag_id = t.id WHERE it.item_id = ?'
  ).all(itemId);
};

const getItemWithTags = (id) => {
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
  if (!item) return null;
  return { ...item, tags: getItemTags(id) };
};

// GET /api/items
router.get('/', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM items ORDER BY created_at DESC').all();
    const result = items.map(item => ({ ...item, tags: getItemTags(item.id) }));
    res.json(result);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// POST /api/items
router.post('/', (req, res) => {
  try {
    const { name, dueDate } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Item name is required' });
    }

    if (dueDate !== undefined && dueDate !== null) {
      if (typeof dueDate !== 'string' || !DATE_REGEX.test(dueDate)) {
        return res.status(400).json({ error: 'Invalid due date format. Use YYYY-MM-DD' });
      }
    }

    const result = db.prepare('INSERT INTO items (name, due_date) VALUES (?, ?)').run(
      name.trim(),
      dueDate || null
    );
    const newItem = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ ...newItem, tags: [] });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT /api/items/:id
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const existingItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const { name, dueDate } = req.body;

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Item name must be a non-empty string' });
      }
    }

    if (dueDate !== undefined && dueDate !== null) {
      if (typeof dueDate !== 'string' || !DATE_REGEX.test(dueDate)) {
        return res.status(400).json({ error: 'Invalid due date format. Use YYYY-MM-DD' });
      }
    }

    const newName = name !== undefined ? name.trim() : existingItem.name;
    const newDueDate = dueDate !== undefined ? (dueDate || null) : existingItem.due_date;

    db.prepare('UPDATE items SET name = ?, due_date = ? WHERE id = ?').run(newName, newDueDate, id);

    const updatedItem = getItemWithTags(parseInt(id));
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /api/items/:id
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid item ID is required' });
    }

    const existingItem = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const result = db.prepare('DELETE FROM items WHERE id = ?').run(id);

    if (result.changes > 0) {
      res.json({ message: 'Item deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// POST /api/items/:id/tags
router.post('/:id/tags', (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    const item = db.prepare('SELECT id FROM items WHERE id = ?').get(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)').run(name.trim());
    const tag = db.prepare('SELECT * FROM tags WHERE name = ?').get(name.trim());

    db.prepare('INSERT OR IGNORE INTO item_tags (item_id, tag_id) VALUES (?, ?)').run(
      parseInt(id),
      tag.id
    );

    res.status(201).json({ id: tag.id, name: tag.name });
  } catch (error) {
    console.error('Error adding tag to item:', error);
    res.status(500).json({ error: 'Failed to add tag to item' });
  }
});

// DELETE /api/items/:id/tags/:tagId
router.delete('/:id/tags/:tagId', (req, res) => {
  try {
    const { id, tagId } = req.params;

    const item = db.prepare('SELECT id FROM items WHERE id = ?').get(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const link = db.prepare(
      'SELECT * FROM item_tags WHERE item_id = ? AND tag_id = ?'
    ).get(parseInt(id), parseInt(tagId));
    if (!link) {
      return res.status(404).json({ error: 'Tag link not found' });
    }

    db.prepare('DELETE FROM item_tags WHERE item_id = ? AND tag_id = ?').run(
      parseInt(id),
      parseInt(tagId)
    );

    res.status(204).send();
  } catch (error) {
    console.error('Error removing tag from item:', error);
    res.status(500).json({ error: 'Failed to remove tag from item' });
  }
});

module.exports = router;

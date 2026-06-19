const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// GET /api/tags
router.get('/', (req, res) => {
  try {
    const tags = db.prepare('SELECT * FROM tags ORDER BY name ASC').all();
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// PUT /api/tags/:id
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    const tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const existing = db.prepare('SELECT * FROM tags WHERE name = ? AND id != ?').get(
      name.trim(),
      parseInt(id)
    );
    if (existing) {
      return res.status(409).json({ error: 'Tag name already taken' });
    }

    db.prepare('UPDATE tags SET name = ? WHERE id = ?').run(name.trim(), id);
    const updatedTag = db.prepare('SELECT * FROM tags WHERE id = ?').get(id);

    res.json({ id: updatedTag.id, name: updatedTag.name });
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ error: 'Failed to update tag' });
  }
});

module.exports = router;

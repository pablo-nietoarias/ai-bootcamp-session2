const Database = require('better-sqlite3');

const db = new Database(':memory:');

// Enable foreign key support for cascade deletes
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    due_date TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS item_tags (
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (item_id, tag_id)
  );
`);

// Insert initial seed data
const insertStmt = db.prepare('INSERT INTO items (name) VALUES (?)');
['Item 1', 'Item 2', 'Item 3'].forEach(name => {
  insertStmt.run(name);
});

console.log('In-memory database initialized with sample data');

module.exports = { db };

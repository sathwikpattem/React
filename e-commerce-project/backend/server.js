const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Create items table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert initial data if table is empty
  db.get("SELECT COUNT(*) as count FROM items", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO items (name, price, category) VALUES (?, ?, ?)");
      const initialItems = [
        ["Coffee - Small", 30, "beverages"],
        ["Coffee - Medium", 45, "beverages"],
        ["Coffee - Large", 60, "beverages"],
        ["Sandwich", 50, "food"],
        ["Fries", 35, "food"],
        ["Pizza", 120, "food"],
        ["Burger", 100, "food"]
      ];

      initialItems.forEach(item => {
        stmt.run(item);
      });
      stmt.finalize();
      console.log('Initial data inserted into database');
    }
  });
});

// API Routes

// Get all items
app.get('/api/items', (req, res) => {
  db.all("SELECT * FROM items ORDER BY id", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get item by ID
app.get('/api/items/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM items WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json(row);
  });
});

// Add new item
app.post('/api/items', (req, res) => {
  const { name, price, category } = req.body;
  
  if (!name || !price) {
    res.status(400).json({ error: 'Name and price are required' });
    return;
  }

  db.run("INSERT INTO items (name, price, category) VALUES (?, ?, ?)", 
    [name, price, category || null], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID,
        name,
        price,
        category
      });
    }
  );
});

// Update item
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;

  db.run("UPDATE items SET name = ?, price = ?, category = ? WHERE id = ?",
    [name, price, category, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }
      res.json({ message: 'Item updated successfully' });
    }
  );
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  
  db.run("DELETE FROM items WHERE id = ?", [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Item deleted successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});

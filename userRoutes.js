const express = require('express');
const router = express.Router();
const db = require('./db');

// 1. GET all users from MySQL
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    let html = '<html><head><title>Users</title></head><body>';
    html += '<h1>User List</h1>';
    if (rows.length === 0) {
      html += '<p>No users found.</p>';
    } else {
      html += '<ul>';
      rows.forEach(user => {
        html += `<li>ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Age: ${user.age}</li>`;
      });
      html += '</ul>';
    }
    html += '</body></html>';
    res.send(html);
  } catch (err) {
    res.status(500).send(`<html><body><h1>Error</h1><p>${err.message}</p></body></html>`);
  }
});

// 2. POST (Create) a new user
router.post('/', async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const sql = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
    const [result] = await db.query(sql, [name, email, age]);
    res.status(201).json({ id: result.insertId, name, email, age });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. PUT (Update) a user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
    const sql = 'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?';
    await db.query(sql, [name, email, age, id]);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. DELETE a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
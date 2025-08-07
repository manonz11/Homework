require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.use(express.json());


app.get('/products', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM products WHERE is_deleted = 0');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ? AND is_deleted = 0', [id]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Product not found.' });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving product', error: err });
  }
});


app.get('/products/search/:keyword', async (req, res) => {
  const keyword = req.params.keyword;
  try {
    const search = `%${keyword}%`;
    const [rows] = await db.query('SELECT * FROM products WHERE name LIKE ? AND is_deleted = 0', [search]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error searching products', error: err });
  }
});

app.post('/products', async (req, res) => {
  const { name, price, discount, review_count, image_url } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, price, discount, review_count, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, price, discount, review_count, image_url]
    );
    res.status(201).json({ id: result.insertId, message: 'Product created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, price, discount, review_count, image_url } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?',
      [name, price, discount, review_count, image_url, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Product not found or not updated' });
    } else {
      res.json({ message: 'Product updated' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [result] = await db.query('UPDATE products SET is_deleted = 1 WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Product not found or already deleted' });
    } else {
      res.json({ message: 'Product soft-deleted' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/products/restore/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [result] = await db.query(
      'UPDATE products SET is_deleted = 0 WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Product not found or already restored' });
    } else {
      res.json({ message: 'Product restored' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

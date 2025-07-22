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
    const [rows] = await db.query('SELECT * FROM products');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving products', error: err });
  }
});


app.get('/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
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
    const [rows] = await db.query('SELECT * FROM products WHERE name LIKE ?', [search]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error searching products', error: err });
  }
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});

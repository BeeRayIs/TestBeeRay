import { Router } from 'express';
import db from '../database/init';
import { Product } from '../types';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { category, search, sort = 'created_at', order = 'DESC' } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY ${sort} ${order}`;

    const products = db.prepare(query).all(...params) as Product[];
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as Product | undefined;

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { name, description, price, category, image_url, stock, specs } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const result = db.prepare(`
      INSERT INTO products (name, description, price, category, image_url, stock, specs)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, description, price, category, image_url, stock || 0, specs || '{}');

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid) as Product;

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { name, description, price, category, image_url, stock, specs } = req.body;

    const result = db.prepare(`
      UPDATE products
      SET name = ?, description = ?, price = ?, category = ?, image_url = ?, stock = ?, specs = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description, price, category, image_url, stock, specs, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as Product;
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;

import { Router } from 'express';
import db from '../database/init';
import { CartItem, Product } from '../types';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  try {
    const cartItems = db.prepare(`
      SELECT ci.*, p.name, p.price, p.image_url, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `).all(req.user!.userId);

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/add', authMiddleware, (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid product_id and quantity are required' });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id) as Product | undefined;

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const existingItem = db.prepare(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?'
    ).get(req.user!.userId, product_id) as CartItem | undefined;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQuantity, existingItem.id);
    } else {
      db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)').run(
        req.user!.userId,
        product_id,
        quantity
      );
    }

    res.json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const cartItem = db.prepare(
      'SELECT * FROM cart_items WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.user!.userId) as CartItem | undefined;

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(cartItem.product_id) as Product;

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, req.params.id);

    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(
      req.params.id,
      req.user!.userId
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

router.delete('/', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user!.userId);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;

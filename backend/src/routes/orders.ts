import { Router } from 'express';
import db from '../database/init';
import { Order, CartItem, Product } from '../types';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  try {
    let orders;

    if (req.user!.role === 'admin') {
      orders = db.prepare(`
        SELECT o.*, u.email, u.name as customer_name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `).all();
    } else {
      orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user!.userId);
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as Order | undefined;

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.user!.role !== 'admin' && order.user_id !== req.user!.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const items = db.prepare(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(req.params.id);

    res.json({ ...order, items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

router.post('/create', authMiddleware, (req, res) => {
  try {
    const { shipping_address } = req.body;

    if (!shipping_address) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    const cartItems = db.prepare(`
      SELECT ci.*, p.price, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `).all(req.user!.userId) as (CartItem & { price: number; stock: number })[];

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for product ${item.product_id}` });
      }
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderResult = db.prepare(
      'INSERT INTO orders (user_id, total, shipping_address) VALUES (?, ?, ?)'
    ).run(req.user!.userId, total, shipping_address);

    const orderId = orderResult.lastInsertRowid;

    const insertOrderItem = db.prepare(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
    );

    const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

    for (const item of cartItems) {
      insertOrderItem.run(orderId, item.product_id, item.quantity, item.price);
      updateStock.run(item.quantity, item.product_id);
    }

    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user!.userId);

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.patch('/:id/status', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;

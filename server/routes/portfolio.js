import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get portfolio positions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.portfolio || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load portfolio' });
  }
});

// Add position
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { symbol, quantity, avgCost, currency = 'USD', notes } = req.body || {};
    if (!symbol || quantity == null || avgCost == null) {
      return res.status(400).json({ error: 'symbol, quantity, and avgCost are required' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const pos = { symbol: symbol.toUpperCase(), quantity: Number(quantity), avgCost: Number(avgCost), currency, notes };
    user.portfolio = [...(user.portfolio || []), pos];
    await user.save();
    res.status(201).json(pos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add position' });
  }
});

// Update position by index
router.put('/:index', authMiddleware, async (req, res) => {
  try {
    const idx = Number(req.params.index);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.portfolio || idx < 0 || idx >= user.portfolio.length) {
      return res.status(404).json({ error: 'Position not found' });
    }
    const curr = user.portfolio[idx];
    user.portfolio[idx] = { ...curr, ...req.body };
    await user.save();
    res.json(user.portfolio[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update position' });
  }
});

// Delete position by index
router.delete('/:index', authMiddleware, async (req, res) => {
  try {
    const idx = Number(req.params.index);
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.portfolio || idx < 0 || idx >= user.portfolio.length) {
      return res.status(404).json({ error: 'Position not found' });
    }
    const removed = user.portfolio.splice(idx, 1);
    await user.save();
    res.json(removed[0] || null);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete position' });
  }
});

export default router;

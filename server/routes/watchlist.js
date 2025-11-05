import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user.watchlist || []);
});

router.post('/', async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ error: 'symbol required' });
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!user.watchlist.includes(symbol)) user.watchlist.push(symbol);
  await user.save();
  res.json(user.watchlist);
});

router.delete('/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.watchlist = (user.watchlist || []).filter((s) => s !== symbol);
  await user.save();
  res.json(user.watchlist);
});

export default router;

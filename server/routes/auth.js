import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

function sign(user) {
  const payload = { id: user._id.toString(), email: user.email };
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT secret not configured');
  const expiresIn = '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: email.toLowerCase(), passwordHash, watchlist: [] });
    const token = sign(user);
    return res.json({ token, user: { email: user.email, watchlist: user.watchlist } });
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password || '', user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = sign(user);
    return res.json({ token, user: { email: user.email, watchlist: user.watchlist } });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: 'Server misconfigured' });
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ email: user.email, watchlist: user.watchlist });
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;

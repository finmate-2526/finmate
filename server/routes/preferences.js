import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get current user's preferences
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    const prefs = user.preferences || {};
    const indicators = prefs.indicators || {
      sma: false,
      ema: true,
      rsi: false,
      macd: false,
      bbands: false,
    };
    res.json({
      lastSymbol: prefs.lastSymbol,
      timeRange: prefs.timeRange,
      density: prefs.density,
      panelOrder: Array.isArray(prefs.panelOrder) ? prefs.panelOrder : undefined,
      indicators,
    });
  } catch (err) {
    // Surface details in server logs to help debugging 500s
    console.error('Preferences GET error:', err?.message || err);
    res.status(500).json({ error: 'Failed to load preferences' });
  }
});

// Update preferences (partial update)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const updates = req.body || {};
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const current = user.preferences || {};
    const defaults = {
      sma: false,
      ema: true,
      rsi: false,
      macd: false,
      bbands: false,
    };

    const allowed = ['sma', 'ema', 'rsi', 'macd', 'bbands'];
    const mergedIndicators = (() => {
      const curr = current?.indicators && typeof current.indicators === 'object' ? current.indicators : {};
      const patch = updates?.indicators && typeof updates.indicators === 'object' ? updates.indicators : {};
      const out = { ...defaults, ...curr };
      for (const [k, v] of Object.entries(patch)) {
        if (allowed.includes(k) && typeof v === 'boolean') out[k] = v;
      }
      return out;
    })();

    const newPrefs = {
      lastSymbol: typeof updates.lastSymbol === 'string' ? updates.lastSymbol : (current.lastSymbol ?? undefined),
      timeRange: typeof updates.timeRange === 'string' ? updates.timeRange : (current.timeRange ?? undefined),
      density: (updates.density === 'comfortable' || updates.density === 'compact')
        ? updates.density
        : (current.density ?? undefined),
      panelOrder: Array.isArray(updates.panelOrder)
        ? updates.panelOrder.filter((v) => typeof v === 'string')
        : (Array.isArray(current.panelOrder) ? current.panelOrder : undefined),
      indicators: mergedIndicators,
    };

    user.preferences = newPrefs;
    user.markModified('preferences');
    await user.save();
    res.json(user.preferences);
  } catch (err) {
    // Surface details in server logs to help debugging 500s
    console.error('Preferences PUT error:', err?.message || err);
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

export default router;

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import watchlistRoutes from './routes/watchlist.js';
import preferencesRoutes from './routes/preferences.js';
import portfolioRoutes from './routes/portfolio.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

// --- CORS ---
// Allow only our deploy origins and localhost (dev). Credentials enabled for cookie/JWT scenarios.
const ALLOWED_ORIGINS = [
  'https://finmate-2526.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (no Origin header) and allowlisted origins
    if (!origin) return callback(null, true);
    const hostname = (() => { try { return new URL(origin).hostname; } catch { return ''; } })();
    const isVercel = /\.vercel\.app$/i.test(hostname);
    const isLocal = /^(localhost|127\.0\.0\.1)$/i.test(hostname);
    const ok = ALLOWED_ORIGINS.includes(origin) || isVercel || isLocal;
    return callback(null, ok);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));
app.use(express.json());
// Ensure CORS preflight (OPTIONS) is handled
app.options('*', cors());

// Lightweight request logger for API routes (dev aid)
app.use('/api', (req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Simple health checks for uptime monitors and platform health probes
app.get('/api/healthz', (_req, res) => {
  res.json({ ok: true });
});
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// DB
connectDB(process.env.MONGO_URI).then(() => {
  console.log('✅ MongoDB connected');
}).catch((e) => {
  console.error('MongoDB connection failed', e.message);
});

// ✅ SEARCH (Autocomplete)
app.get('/api/search/:query', async (req, res) => {
  const { query } = req.params;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const results = response.data.quotes || [];

    res.json(
      results
        .filter(q => q.symbol && (q.shortname || q.longname))
        .map(q => ({
          symbol: q.symbol,
          name: q.longname || q.shortname,
          exchange: q.exchDisp || q.exchange
        }))
    );

  } catch (err) {
    console.error("Search API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});


// ✅ STOCK DATA (Chart)
app.get('/api/stock/:symbol', async (req, res) => {
  const { symbol } = req.params;

  // Fetch a longer range so client-side indicators (RSI/MACD/Bollinger/ATR) have enough bars
  const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=6mo&interval=1d`;

  try {
    const response = await axios.get(chartUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    res.json(response.data); // ✅ return Yahoo response exactly

  } catch (err) {
    console.error("Stock API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});


// ✅ REAL YAHOO FINANCE NEWS ✅
// ✅ AUTH & WATCHLIST
app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.get('/api/news/:symbol', async (req, res) => {
  const { symbol } = req.params;

  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }

  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${symbol}`;

  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const items = response.data.news || [];

    const formatted = items.map(n => ({
      uuid: n.uuid,
      title: n.title,
      source: n.publisher,
      url: n.link,
      publishedAt: n.providerPublishTime
        ? new Date(n.providerPublishTime * 1000).toISOString()
        : null,
      time_ago: n.providerPublishTime
        ? timeSince(new Date(n.providerPublishTime * 1000))
        : "—"
    }));

    res.json(formatted);

  } catch (err) {
    console.error("News API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});


// ✅ TIME FORMATTER
function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = [
    [31536000, 'y'],
    [2592000, 'm'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'm']
  ];
  for (const [div, label] of intervals) {
    const n = Math.floor(seconds / div);
    if (n >= 1) return `${n}${label} ago`;
  }
  return `${seconds}s ago`;
}

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Final 404 handler (JSON), after all routes
app.use((req, res) => {
  return res.status(404).json({ error: 'Not found', method: req.method, path: req.originalUrl });
});

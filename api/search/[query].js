export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });
  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await r.json();
    const results = Array.isArray(data?.quotes) ? data.quotes : [];
    const mapped = results
      .filter((q) => q.symbol && (q.shortname || q.longname))
      .map((q) => ({
        symbol: q.symbol,
        name: q.longname || q.shortname,
        exchange: q.exchDisp || q.exchange,
      }));
    res.status(200).json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
}

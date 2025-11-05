import express from 'express';
import axios from 'axios';

const router = express.Router();

const NEWSAPI_KEY = process.env.NEWSAPI_KEY || 'YOUR_API_KEY'; // Replace with your actual API key
const FINNHUB_API_KEY = 'd44el49r01qt371ulvtgd44el49r01qt371ulvu0'; // Replace with your actual API key

// Fetch general market news
router.get('/market-news', async (req, res) => {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`);
    const news = response.data.map(article => ({
      uuid: article.id,
      title: article.headline,
      source: article.source,
      url: article.url,
      time_ago: new Date(article.datetime * 1000).toLocaleDateString(),
      image_url: article.image,
      summary: article.summary
    }));
    res.json(news);
  } catch (error) {
    console.error('Error fetching market news:', error);
    res.status(500).json({ error: 'Failed to fetch market news' });
  }
});

// Fetch news for specific stock
router.get('/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${getLastWeek()}&to=${getCurrentDate()}&token=${FINNHUB_API_KEY}`
    );
    const news = response.data.map(article => ({
      uuid: article.id,
      title: article.headline,
      source: article.source,
      url: article.url,
      time_ago: new Date(article.datetime * 1000).toLocaleDateString(),
      image_url: article.image,
      summary: article.summary
    }));
    res.json(news);
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error);
    res.status(500).json({ error: `Failed to fetch news for ${symbol}` });
  }
});

function getCurrentDate() {
  const date = new Date();
  return date.toISOString().split('T')[0];
}

function getLastWeek() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0];
}

export default router;
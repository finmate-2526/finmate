import axios from 'axios';
import { authHeaders, getToken } from './auth';
import { API_BASE as API_BASE_URL } from './config';

// --- Stock Data ---

export const fetchStockData = async (symbol: string) => {
  try {
  const response = await axios.get(`${API_BASE_URL}/stock/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch stock data for ${symbol}:`, error);
    throw new Error(`Failed to fetch data for ${symbol}. Please try again.`);
  }
};

export const searchStocks = async (query: string) => {
  if (query.length < 2) return [];
  try {
  const response = await axios.get(`${API_BASE_URL}/search/${query}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch search results:', error);
    return []; // Return empty on error to prevent UI crashes
  }
};

// --- News ---

export const fetchNews = async (symbol: string) => {
  try {
  const response = await axios.get(`${API_BASE_URL}/news/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch news for ${symbol}:`, error);
    return [];
  }
};

// --- Watchlist (Server-backed with JWT; fallback to defaults when not authenticated) ---

export const getWatchlist = async (): Promise<string[]> => {
  try {
    if (!getToken()) return ['AAPL', 'GOOGL', 'TSLA', 'RELIANCE.NS'];
  const res = await axios.get(`${API_BASE_URL}/watchlist`, { headers: authHeaders() });
    return res.data || [];
  } catch (error) {
    console.error('Failed to retrieve watchlist:', error);
    return [];
  }
};

export const addToWatchlist = async (symbol: string): Promise<string[]> => {
  try {
    if (!getToken()) {
      // Fallback local for unauthenticated session
      const key = 'finmate_watchlist';
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      if (!list.includes(symbol)) {
        const nw = [...list, symbol];
        localStorage.setItem(key, JSON.stringify(nw));
        return nw;
      }
      return list;
    }
  const res = await axios.post(`${API_BASE_URL}/watchlist`, { symbol }, { headers: authHeaders() });
    return res.data || [];
  } catch (error) {
    console.error('Failed to add to watchlist:', error);
    return [];
  }
};

export const removeFromWatchlist = async (symbol: string): Promise<string[]> => {
  try {
    if (!getToken()) {
      const key = 'finmate_watchlist';
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : [];
      const nw = list.filter((s: string) => s !== symbol);
      localStorage.setItem(key, JSON.stringify(nw));
      return nw;
    }
  const res = await axios.delete(`${API_BASE_URL}/watchlist/${encodeURIComponent(symbol)}`, { headers: authHeaders() });
    return res.data || [];
  } catch (error) {
    console.error('Failed to remove from watchlist:', error);
    return [];
  }
};
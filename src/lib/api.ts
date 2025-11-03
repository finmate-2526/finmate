import axios from "axios";

const API_BASE = "http://localhost:4000/api";

export const fetchStockData = async (symbol: string) => {
  const url = `${API_BASE}/stock/${encodeURIComponent(symbol)}`;

  const res = await axios.get(url);
  return res.data;
};

import express from "express";
import axios from "axios";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());

// ✅ Normalize stock tickers (US + India)
function normalizeSymbol(input) {
  const s = input.toUpperCase().trim();

  // ✅ Indian ticker mappings
  const map = {
    ADANI: "ADANIENT.NS",
    ADANIENT: "ADANIENT.NS",
    ADANIPORTS: "ADANIPORTS.NS",
    ADANIPOWER: "ADANIPOWER.NS",
    ADANIGREEN: "ADANIGREEN.NS",
    ATGL: "ATGL.NS",
    AWL: "AWL.NS",
    RELIANCE: "RELIANCE.NS",
    TCS: "TCS.NS",
    INFY: "INFY.NS",
    HDFC: "HDFC.NS",
    HDFCBANK: "HDFCBANK.NS",
    SBIN: "SBIN.NS",
    ICICIBANK: "ICICIBANK.NS",
    KOTAKBANK: "KOTAKBANK.NS",
    WIPRO: "WIPRO.NS",
    LT: "LT.NS",
    TATASTEEL: "TATASTEEL.NS",
    TATAMOTORS: "TATAMOTORS.NS",
  };

  if (map[s]) return map[s];

  // ✅ If symbol is already NSE/BSE format
  if (s.endsWith(".NS") || s.endsWith(".BO")) return s;

  // ✅ Default: assume US ticker
  return s;
}

// ✅ API Route
app.get("/api/stock/:symbol", async (req, res) => {
  try {
    const original = req.params.symbol;
    const finalSymbol = normalizeSymbol(original);

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${finalSymbol}?interval=1h&range=1mo`;

    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    console.error("❌ Backend error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

// ✅ Start server
app.listen(4000, () => {
  console.log("✅ Server running on PORT 4000");
});

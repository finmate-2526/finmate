import { useEffect, useState } from "react";
import { StockSearch } from "@/components/StockSearch";
import { StockChart } from "@/components/StockChart";
import { StockCard } from "@/components/StockCard";
import { PredictionPanel } from "@/components/PredictionPanel";
import { NewsCard } from "@/components/NewsCard";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { logout, getCurrentUser } from "@/lib/localAuth";
import { useNavigate } from "react-router-dom";
import { fetchStockData } from "@/lib/api";

// Convert Yahoo API → Chart data
const convertYahooData = (yahooData: any) => {
  try {
    const result = yahooData.chart.result[0];
    const timestamps = result.timestamp;
    const prices = result.indicators.quote[0].close;

    return timestamps.map((ts: number, i: number) => ({
      time: new Date(ts * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: prices[i] ?? null,
    }));
  } catch (err) {
    console.error("Chart conversion failed", err);
    return [];
  }
};

const popularStocks = ["AAPL", "MSFT", "GOOGL", "NVDA", "TSLA", "RELIANCE.NS", "TCS.NS"];

const mockNews = [
  { title: "Tech Stocks Rally on Strong Earnings", source: "FT", url: "#", publishedAt: "2h ago" },
  { title: "Rate Hike Pause Expected", source: "Bloomberg", url: "#", publishedAt: "4h ago" },
  { title: "Market Flat Amid Uncertainty", source: "Reuters", url: "#", publishedAt: "6h ago" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [chartData, setChartData] = useState([]);
  const [stockPrice, setStockPrice] = useState<number | null>(null);

  // Watchlist now stores full data per stock
  const [watchlist, setWatchlist] = useState<any[]>([
    { symbol: "AAPL", price: null, change: 0, changePercent: 0 },
    { symbol: "GOOGL", price: null, change: 0, changePercent: 0 },
    { symbol: "MSFT", price: null, change: 0, changePercent: 0 },
  ]);

  // Fetch and update one stock
  const loadStock = async (symbol: string) => {
    try {
      const data = await fetchStockData(symbol);

      const result = data.chart.result[0];
      const price =
        result.meta.regularMarketPrice ??
        result.meta.previousClose;

      const converted = convertYahooData(data);
      setChartData(converted);
      setStockPrice(price);

      // Build watchlist entry
      const newStock = {
        symbol,
        price,
        change: 0,
        changePercent: 0,
      };

      // Add or update inside watchlist
      setWatchlist((prev) => {
        const exists = prev.find((s) => s.symbol === symbol);
        if (exists) {
          return prev.map((s) => (s.symbol === symbol ? newStock : s));
        }
        return [...prev, newStock];
      });

    } catch (err) {
      toast.error(`Failed to fetch ${symbol}`);
      console.error(err);
    }
  };

  const handleSearch = (symbol: string) => {
    const upper = symbol.toUpperCase();
    setSelectedStock(upper);
    loadStock(upper);
  };

  useEffect(() => {
    loadStock(selectedStock);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const prediction = {
    symbol: selectedStock,
    currentPrice: stockPrice ?? 0,
    predictedPrice: stockPrice ? stockPrice * 1.04 : 0,
    confidence: 72,
    trend: "up",
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">

        {/* HEADER */}
        <header className="w-full border-b border-gray-800 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Stock Market Predictor</h1>
            <p className="text-sm text-gray-400">AI-powered analytics & forecasts</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">{currentUser?.email}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 border border-gray-700 rounded hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* SEARCH BAR */}
        <div className="border border-gray-800 rounded p-4 bg-[#101010]">
          <StockSearch onSearch={handleSearch} />
        </div>

        {/* POPULAR STOCKS */}
        <div className="flex gap-2 flex-wrap">
          {popularStocks.map((stock) => (
            <button
              key={stock}
              onClick={() => handleSearch(stock)}
              className={`px-3 py-1 text-sm border rounded ${
                selectedStock === stock
                  ? "bg-white text-black"
                  : "border-gray-700 text-gray-300 hover:bg-gray-800"
              }`}
            >
              {stock}
            </button>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* LEFT SECTION */}
          <div className="xl:col-span-8 space-y-6">

            {/* CHART PANEL */}
            <div className="border border-gray-800 rounded bg-[#101010]">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{selectedStock}</span>
                  <span className="font-semibold">
                    {stockPrice ? `$${stockPrice.toFixed(2)}` : "—"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <StockChart data={chartData} symbol={selectedStock} />
              </div>
            </div>

            {/* PREDICTION PANEL */}
            <div className="border border-gray-800 rounded p-4 bg-[#101010]">
              <PredictionPanel prediction={prediction} />
            </div>

          </div>

          {/* RIGHT SECTION */}
          <div className="xl:col-span-4 space-y-6">

            {/* WATCHLIST */}
            <div className="border border-gray-800 rounded bg-[#101010]">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Watchlist</h2>
              </div>

              <div className="p-4 space-y-3 max-h-[350px] overflow-y-auto">
                {watchlist.map((s) => (
                  <div key={s.symbol} className="border border-gray-800 rounded p-3 bg-[#0d0d0d]">
                    <StockCard
                      symbol={s.symbol}
                      price={s.price ?? 0}
                      change={s.change}
                      changePercent={s.changePercent}
                      onSelect={() => handleSearch(s.symbol)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* NEWS */}
            <div className="border border-gray-800 rounded bg-[#101010]">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Market News</h2>
              </div>

              <div className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
                {mockNews.map((n, idx) => (
                  <NewsCard key={idx} news={n} />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

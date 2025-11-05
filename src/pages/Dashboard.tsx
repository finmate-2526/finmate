import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { StockSearch } from "@/components/StockSearch";
import { StockChart } from "@/components/StockChart";
import PredictionPanel from "@/components/PredictionPanel";
import { NewsCard, type NewsItem } from "@/components/NewsCard";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { logout, getCurrentUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import {
  fetchStockData,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} from "@/lib/api";
import { predictNextClose } from "@/lib/rulePredictor";
import { fetchNews } from "@/lib/api";
import { getPreferences, updatePreferences, type Preferences } from "@/lib/preferences";
import IndicatorToggles, { type IndicatorState } from "@/components/IndicatorToggles";
import PortfolioPanel from "@/components/PortfolioPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

// ✅ Convert Yahoo → Chart Data
const convertYahooData = (yahooData: any) => {
  try {
    const result = yahooData?.chart?.result?.[0];
    if (!result) return [];

    const timestamps = result.timestamp ?? [];
    const prices = result.indicators?.quote?.[0]?.close ?? [];

    return timestamps.map((ts: number, i: number) => ({
      time: new Date(ts * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      }),
      price: prices[i] ?? null
    }));
  } catch (err) {
    console.error("Chart conversion failed", err);
    return [];
  }
};

const popularStocks = ["AAPL", "MSFT", "GOOGL", "NVDA", "TSLA", "RELIANCE.NS", "TCS.NS"];

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [chartData, setChartData] = useState<any[]>([]);
  const [stockPrice, setStockPrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("USD");

  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [prediction, setPrediction] = useState({
    currentPrice: 0,
    predictedPrice: 0,
    confidence: 0,
    trend: "up" as "up" | "down",
    targetDate: "7 days",
    currency: "USD",
    rationale: [] as string[],
  });

  const [loadingChart, setLoadingChart] = useState<boolean>(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState<boolean>(true);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);

  const [tab, setTab] = useState<'overview' | 'compare' | 'portfolio'>('overview');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [indicators, setIndicators] = useState<IndicatorState>({ sma: false, ema: true, rsi: false, macd: false, bbands: false });
  const [comparisons, setComparisons] = useState<{ symbol: string; data: any[] }[]>([]);

  // Persist helpers
  const savePrefs = async (patch: Partial<Preferences>) => {
    try {
      await updatePreferences(patch);
    } catch {}
    try {
      const key = 'finmate_prefs';
      const raw = localStorage.getItem(key);
      const obj = raw ? JSON.parse(raw) : {};
      localStorage.setItem(key, JSON.stringify({ ...obj, ...patch }));
    } catch {}
  };

  // ✅ Load single stock
  const loadStock = async (symbol: string) => {
    try {
      setLoadingChart(true);
      const data = await fetchStockData(symbol);

      const result = data?.chart?.result?.[0];
      const error = data?.chart?.error;

      if (error || !result) {
        console.warn("Yahoo API returned error:", error);
        toast.error(`No data found for ${symbol}`);
        return;
      }

      const meta = result.meta ?? {};
      const price = meta.regularMarketPrice ?? meta.previousClose ?? null;

  const detectedCurrency = meta.currency ?? "USD";
  setCurrency(detectedCurrency);
  setStockPrice(price);
  setChartData(convertYahooData(data));

  // Build rule-based prediction
  const q = result.indicators?.quote?.[0] ?? {};
  const closes = (q.close ?? []).slice(-120);
  const highs = (q.high ?? []).slice(-120);
  const lows = (q.low ?? []).slice(-120);
  const p = predictNextClose({ close: closes, high: highs, low: lows }, detectedCurrency);
  // Generate AI confidence between 80 and 100 on each refresh
  const aiConfidence = Math.floor(Math.random() * 21) + 80; // 80-100 inclusive
  setPrediction({ ...p, confidence: aiConfidence, currency: p.currency ?? detectedCurrency });
  setLoadingChart(false);
    } catch (err) {
      console.error("loadStock failed:", err);
      toast.error(`Failed to fetch data for ${symbol}`);
      setLoadingChart(false);
    }
  };

  // ✅ Load news
  const loadNews = async (symbol: string) => {
    try {
      setLoadingNews(true);
      const data = await fetchNews(symbol);
      setNews(Array.isArray(data) ? data : []);
      setLoadingNews(false);
    } catch (error) {
      console.error("Failed to load news:", error);
      setNews([]);
      setLoadingNews(false);
    }
  };

  // ✅ Load watchlist
  const loadWatchlist = async () => {
    try {
      setLoadingWatchlist(true);
      const symbols = await getWatchlist();
      if (!Array.isArray(symbols)) {
        setWatchlist([]);
        setLoadingWatchlist(false);
        return;
      }

      const entries = await Promise.all(
        symbols.map(async (sym) => {
          try {
            const data = await fetchStockData(sym);
            const result = data?.chart?.result?.[0];

            const meta = result?.meta ?? {};
            return {
              symbol: sym,
              price: meta.regularMarketPrice ?? meta.previousClose ?? null,
              currency: meta.currency ?? "USD"
            };
          } catch {
            return { symbol: sym, price: null, currency: "USD" };
          }
        })
      );

      setWatchlist(entries);
      setLoadingWatchlist(false);
    } catch (err) {
      console.error("loadWatchlist failed", err);
      setWatchlist([]);
      setLoadingWatchlist(false);
    }
  };

  // ✅ When user selects a stock
  const handleSearch = async (symbol: string) => {
    const upper = symbol.toUpperCase();
    setSelectedStock(upper);
    const res = await addToWatchlist(upper);
    if (Array.isArray(res) && res.includes(upper)) toast.success(`${upper} added to watchlist`);
    await loadStock(upper);
    await loadWatchlist();
    await loadNews(upper); // ✅ load news too
    savePrefs({ lastSymbol: upper });
  };

  const handleRemove = async (symbol: string) => {
    await removeFromWatchlist(symbol);
    toast.success(`${symbol} removed`);
    await loadWatchlist();
  };

  // ✅ Load preferences once on mount (do not reset selection on every change)
  useEffect(() => {
    (async () => {
      try {
        const prefs = await getPreferences();
        if (prefs) {
          if (prefs.lastSymbol) setSelectedStock(prefs.lastSymbol);
          if (prefs.density) setDensity(prefs.density as any);
          if (prefs.indicators) setIndicators((i) => ({ ...i, ...prefs.indicators! }));
        } else {
          const raw = localStorage.getItem('finmate_prefs');
          if (raw) {
            const p = JSON.parse(raw);
            if (p.lastSymbol) setSelectedStock(p.lastSymbol);
            if (p.density) setDensity(p.density);
            if (p.indicators) setIndicators((i) => ({ ...i, ...p.indicators }));
          }
        }
      } catch {}
    })();
  }, []);

  // ✅ Load data whenever selectedStock changes
  useEffect(() => {
    loadStock(selectedStock);
    loadWatchlist();
    loadNews(selectedStock);
  }, [selectedStock]);

  // ✅ Auto refresh current selection every 60s
  useEffect(() => {
    const id = setInterval(() => {
      loadStock(selectedStock);
      loadWatchlist();
      loadNews(selectedStock);
    }, 60000);
    return () => clearInterval(id);
  }, [selectedStock]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const effectivePrediction = {
    ...prediction,
    currentPrice: stockPrice ?? prediction.currentPrice,
    currency,
  };

  return (
    <div className={`min-h-screen bg-black text-white ${density === 'compact' ? 'text-sm' : ''}`}>
      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">

        {/* HEADER */}
  <header className="sticky top-0 z-10 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/50 w-full border-b border-gray-800 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">FinMate</h1>
            <p className="text-sm text-gray-400">AI-powered analytics & forecasts</p>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/about" className="hidden sm:block">
              <button className="px-3 py-2 border border-gray-700 rounded hover:bg-gray-800">About</button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Compact</span>
              <Switch checked={density === 'compact'} onCheckedChange={(v) => { setDensity(v ? 'compact' : 'comfortable'); savePrefs({ density: v ? 'compact' : 'comfortable' }); }} />
            </div>
            <span className="text-sm text-gray-300">{currentUser?.email}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 border border-gray-700 rounded hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* SEARCH */}
        <div className="border border-gray-800 rounded p-4 bg-[#101010]">
          <StockSearch onSelect={handleSearch} />
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

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          {/* GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* LEFT / MAIN */}
          <div className="xl:col-span-8 space-y-6">

            {/* CHART */}
            <div className="border border-gray-800 rounded bg-[#101010]">

              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{selectedStock}</span>
                  <span className="font-semibold">
                    {currency === "INR" ? "₹" : currency === "USD" ? "$" : currency + " "}
                    {stockPrice ? stockPrice.toFixed(2) : "—"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                {loadingChart ? (
                  <Skeleton className="h-[450px] w-full" />
                ) : (
                  <StockChart data={chartData} symbol={selectedStock} currency={currency} indicators={{ sma: indicators.sma, ema: indicators.ema, bbands: indicators.bbands }} comparisons={tab === 'compare' ? comparisons.map(c => ({ symbol: c.symbol, data: c.data })) : undefined} />
                )}
              </div>

              <div className="border-t border-gray-800 p-4">
                <PredictionPanel prediction={effectivePrediction} />
              </div>
            </div>

              {/* Indicators */}
              <div className="border border-gray-800 rounded bg-[#101010] p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Indicators</h3>
                  <button className="text-xs text-gray-400 underline" onClick={() => {
                    const next = { sma: false, ema: true, rsi: false, macd: false, bbands: false };
                    setIndicators(next);
                    savePrefs({ indicators: next });
                  }}>Reset</button>
                </div>
                <IndicatorToggles state={indicators} onChange={(patch) => { const next = { ...indicators, ...patch }; setIndicators(next); savePrefs({ indicators: next }); }} />
              </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="xl:col-span-4 space-y-6">

            {/* WATCHLIST */}
            <div className="border border-gray-800 rounded bg-[#101010]">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Watchlist</h2>
              </div>

              <div className="p-4 space-y-3 max-h-[350px] overflow-y-auto">
                {loadingWatchlist ? (
                  <>
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                  </>
                ) : watchlist.length === 0 ? (
                  <div className="text-sm text-gray-400">No items in watchlist</div>
                ) : null}

                {watchlist.map((s) => (
                  <div
                    key={s.symbol}
                    className="border border-gray-800 rounded p-3 bg-[#0d0d0d] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-semibold">{s.symbol}</div>
                      <div className="text-xs text-gray-400">
                        {s.currency === "INR" ? "₹" : s.currency === "USD" ? "$" : s.currency + " "}
                        {s.price != null ? Number(s.price).toFixed(2) : "—"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-xs text-gray-400">
                        <input type="checkbox" checked={!!comparisons.find(c => c.symbol === s.symbol)} onChange={async (e) => {
                          if (e.target.checked) {
                            try {
                              const data = await fetchStockData(s.symbol);
                              const converted = convertYahooData(data);
                              setComparisons(prev => [...prev, { symbol: s.symbol, data: converted }]);
                              toast.success(`Added ${s.symbol} to comparison`);
                            } catch { toast.error('Failed to add to comparison'); }
                          } else {
                            setComparisons(prev => prev.filter(c => c.symbol !== s.symbol));
                          }
                        }} /> Compare
                      </label>
                      <button
                        onClick={() => handleSearch(s.symbol)}
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-800"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleRemove(s.symbol)}
                        className="px-3 py-1 text-sm border rounded hover:bg-gray-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REAL NEWS */}
            <div className="border border-gray-800 rounded bg-[#101010]">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold">Market News</h2>
              </div>

              <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                {loadingNews ? (
                  <>
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </>
                ) : news.length === 0 ? (
                  <div className="text-sm text-gray-400">No news available</div>
                ) : null}

                {news.map((n) => (
                  <NewsCard key={n.uuid} news={n} />
                ))}
              </div>
            </div>

          </div>

          </div>

          {tab === 'portfolio' && (
            <div className="mt-4">
              <PortfolioPanel />
            </div>
          )}
        </Tabs>

      </div>
    </div>
  );
};

export default Dashboard;

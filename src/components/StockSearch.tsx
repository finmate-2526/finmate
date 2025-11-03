import { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StockSearchProps {
  onSearch: (symbol: string) => void;
}

// ✅ Normalizes stock names into valid symbols (US + Indian)
const normalizeSymbol = (input: string) => {
  let s = input.trim().toUpperCase();

  // ✅ Full mapping for Indian companies (expandable)
  const indianMap: Record<string, string> = {
    "RELIANCE": "RELIANCE.NS",
    "RIL": "RELIANCE.NS",
    "TCS": "TCS.NS",
    "INFY": "INFY.NS",
    "HDFC": "HDFCBANK.NS",
    "HDFCBANK": "HDFCBANK.NS",
    "ICICI": "ICICIBANK.NS",
    "ICICIBANK": "ICICIBANK.NS",
    "SBIN": "SBIN.NS",
    "SBI": "SBIN.NS",
    "WIPRO": "WIPRO.NS",
    "WIPRO LTD": "WIPRO.NS",
  };

  // ✅ If user typed a known Indian company name
  if (indianMap[s]) return indianMap[s];

  // ✅ If user types something like “TCS.NS” keep it
  if (s.endsWith(".NS")) return s;

  // ✅ Bare Indian tickers become US tickers unless mapped
  return s;
};

export const StockSearch = ({ onSearch }: StockSearchProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const symbol = normalizeSymbol(query);
    onSearch(symbol);
    setQuery('');
  };

  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'RELIANCE', 'TCS'];

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search any stock (NVIDIA, RELIANCE, TCS, AAPL)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 glass-card border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground glow-primary"
        >
          Search
        </Button>
      </form>

      {/* ✅ Popular Stock Buttons */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-secondary" />
        <span className="text-xs text-muted-foreground">Popular:</span>

        <div className="flex gap-2 flex-wrap">
          {popularStocks.map((stock) => (
            <Button
              key={stock}
              variant="outline"
              size="sm"
              onClick={() => onSearch(normalizeSymbol(stock))}
              className="glass text-xs hover:glow-primary"
            >
              {stock}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

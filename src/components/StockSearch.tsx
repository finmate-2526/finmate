import { useState, useEffect, useRef } from "react";
import { Search, Loader, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchStocks, addToWatchlist } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";  // ✅ FIXED

interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
}

interface StockSearchProps {
  onSelect: (symbol: string) => void;
}

export const StockSearch = ({ onSelect }: StockSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const debounced = useDebounce(query, 300);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setVisible(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      setVisible(false);
      return;
    }

    const search = async () => {
      try {
        setLoading(true);
        const data = await searchStocks(debounced);
        setResults(data ?? []);
        setVisible(true);
      } catch (e) {
        console.error("search error", e);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debounced]);

  const handleAdd = async (symbol: string) => {
    try {
      await addToWatchlist(symbol);
      toast.success(`${symbol} added to watchlist`);
      onSelect(symbol);
    } catch (e) {
      console.error(e);
      toast.error("Failed to add to watchlist");
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stocks"
          onFocus={() => debounced.length > 1 && setVisible(true)}
          className="pl-10"
        />
        {loading && <Loader className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />}
      </div>

      {visible && results.length > 0 && (
        <div className="absolute z-50 w-full bg-neutral-900 border border-neutral-700 rounded mt-2 max-h-72 overflow-y-auto">
          {results.map((r) => (
            <div
              key={r.symbol}
              className="flex justify-between items-center p-3 hover:bg-neutral-800 cursor-pointer"
            >
              <div onClick={() => onSelect(r.symbol)}>
                <div className="font-semibold">{r.symbol}</div>
                <div className="text-sm text-neutral-400">{r.name}</div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd(r.symbol);
                }}
              >
                <Plus size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

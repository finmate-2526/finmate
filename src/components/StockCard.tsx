import { TrendingUp, TrendingDown, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const currencySymbols: { [key: string]: string } = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

interface StockCardProps {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  onSelect: () => void;
  onRemove?: () => void;
  onAdd?: () => void;
  isInWatchlist: boolean;
}

export const StockCard = ({
  symbol,
  price,
  change,
  changePercent,
  currency,
  onSelect,
  onRemove,
  onAdd,
  isInWatchlist,
}: StockCardProps) => {
  const isPositive = change >= 0;
  const currencySymbol = currencySymbols[currency] || '$';

  return (
    <div
      onClick={onSelect}
      className="group relative p-4 w-full bg-neutral-900/50 border border-neutral-700 rounded-xl shadow-lg hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 cursor-pointer glow-border"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-neutral-100 truncate">{symbol}</h3>
          <p className="text-2xl font-black text-white mt-1">
            {currencySymbol}{price.toFixed(2)}
          </p>
          <div className={cn(
            'flex items-center gap-1.5 mt-2 text-sm font-semibold',
            isPositive ? 'text-green-400' : 'text-red-400'
          )}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>
              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isInWatchlist ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.();
              }}
              className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
              title="Remove from Watchlist"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd?.();
              }}
              className="p-2 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/40 transition-colors"
              title="Add to Watchlist"
            >
              <PlusCircle size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
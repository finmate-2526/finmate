import { TrendingUp, TrendingDown, Trash2 } from "lucide-react";

interface StockCardProps {
  symbol: string;
  price: number;
  change: number;
  changePercent?: number;  // ✅ make optional
  onSelect?: () => void;
  onRemove?: () => void;
  showActions?: boolean;
}

export const StockCard = ({
  symbol,
  price,
  change,
  changePercent,
  onSelect,
  onRemove,
  showActions = true,
}: StockCardProps) => {
  const isPositive = change >= 0;
  const percent = changePercent ?? (price !== 0 ? (change / price) * 100 : 0);

  return (
    <div
      onClick={onSelect}
      className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-start justify-between">

        {/* LEFT SIDE */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{symbol}</h3>

          {/* PRICE */}
          <p className="text-xl font-bold text-gray-900 mt-1">
            ${price.toFixed(2)}
          </p>

          {/* CHANGE */}
          <div
            className={`flex items-center gap-1 mt-2 text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}

            <span>
              {isPositive ? "+" : ""}
              {change.toFixed(2)} ({isPositive ? "+" : ""}
              {percent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* REMOVE BUTTON */}
        {showActions && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-2 rounded-md hover:bg-red-100 text-red-600 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

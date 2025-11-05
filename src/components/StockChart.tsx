import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line
} from "recharts";
import { Card } from "@/components/ui/card";
import { sma as SMA, ema as EMA, bollinger as BB } from "@/lib/indicators";

const currencySymbols: { [key: string]: string } = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

interface ChartDataPoint {
  time: string;
  price: number | null;
}

interface StockChartProps {
  data: ChartDataPoint[];
  symbol: string;
  currency: string;
  indicators?: { sma?: boolean; ema?: boolean; bbands?: boolean };
  comparisons?: { symbol: string; data: ChartDataPoint[]; color?: string }[];
}

const CustomTooltip = ({ active, payload, label, currencySymbol }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-neutral-900 border border-neutral-700 rounded-lg">
        <p className="text-sm text-neutral-300">{label}</p>
        <p className="text-lg font-bold text-primary">
          {currencySymbol}
          {(payload[0].value ?? 0).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export const StockChart = ({ data, symbol, currency, indicators, comparisons }: StockChartProps) => {
  const currencySymbol = currencySymbols[currency] || "$";

  const safeData = data.map((d) => ({
    ...d,
    price: d.price ?? 0,
  }));

  // Compute overlays
  let overlays: { sma?: number[]; ema?: number[]; bbUpper?: number[]; bbLower?: number[] } = {};
  try {
    const closes = safeData.map(d => d.price ?? 0);
    if (indicators?.sma) {
      const arr = SMA(closes, 20);
      overlays.sma = Array(safeData.length - arr.length).fill(null).concat(arr);
    }
    if (indicators?.ema) {
      const arr = EMA(closes, 20);
      overlays.ema = arr;
    }
    if (indicators?.bbands) {
      const bb = BB(closes, 20, 2);
      const pad = safeData.length - bb.length;
      overlays.bbUpper = Array(pad).fill(null).concat(bb.map(b => b.upper));
      overlays.bbLower = Array(pad).fill(null).concat(bb.map(b => b.lower));
    }
  } catch {}

  return (
    <Card className="w-full h-[450px] p-6 bg-transparent border-none shadow-none">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={safeData}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.3)" />

          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />

          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(v) => `${currencySymbol}${v}`}
          />

          <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} />} />

          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
          />

          {/* Comparisons */}
          {comparisons?.map((c, idx) => {
            const cd = c.data.map(d => ({ ...d, price: d.price ?? 0 }));
            const color = c.color || (idx % 2 === 0 ? '#22d3ee' : '#f97316');
            return (
              <Line key={c.symbol} type="monotone" dataKey="price" data={cd} stroke={color} dot={false} strokeWidth={1.5} />
            );
          })}

          {/* Indicator overlays */}
          {overlays.sma && (
            <Line type="monotone" dataKey="sma" stroke="#94a3b8" dot={false} strokeWidth={1.25} isAnimationActive={false} data={safeData.map((d, i) => ({ ...d, sma: overlays.sma![i] }))} />
          )}
          {overlays.ema && (
            <Line type="monotone" dataKey="ema" stroke="#22c55e" dot={false} strokeWidth={1.25} isAnimationActive={false} data={safeData.map((d, i) => ({ ...d, ema: overlays.ema![i] }))} />
          )}
          {overlays.bbUpper && overlays.bbLower && (
            <>
              <Line type="monotone" dataKey="bbU" stroke="#fbbf24" dot={false} strokeDasharray="4 4" isAnimationActive={false} data={safeData.map((d, i) => ({ ...d, bbU: overlays.bbUpper![i] }))} />
              <Line type="monotone" dataKey="bbL" stroke="#fbbf24" dot={false} strokeDasharray="4 4" isAnimationActive={false} data={safeData.map((d, i) => ({ ...d, bbL: overlays.bbLower![i] }))} />
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

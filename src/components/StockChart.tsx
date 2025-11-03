import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card } from "@/components/ui/card";

interface ChartDataPoint {
  time: string;
  price: number;
  predicted?: number;
  confidenceHigh?: number;
  confidenceLow?: number;
}

interface StockChartProps {
  data: ChartDataPoint[];
  symbol: string;
  showPrediction?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3">
        <p className="text-xs text-muted-foreground">{payload[0].payload.time}</p>
        <p className="text-sm font-medium text-primary">
          Price: ${payload[0].value.toFixed(2)}
        </p>
        {payload[0].payload.predicted && (
          <p className="text-sm font-medium text-secondary">
            Predicted: ${payload[0].payload.predicted.toFixed(2)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const StockChart = ({ data, symbol, showPrediction = false }: StockChartProps) => {
  return (
    <Card className="glass-card p-6 glow-primary">
      <div className="mb-4">
        <h3 className="text-2xl font-bold gradient-text">{symbol}</h3>
        <p className="text-sm text-muted-foreground">Price Chart with ML Predictions</p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 12 }}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Confidence interval area */}
          {showPrediction && (
            <Area
              type="monotone"
              dataKey="confidenceHigh"
              stroke="none"
              fill="hsl(var(--secondary))"
              fillOpacity={0.1}
            />
          )}
          
          {/* Actual price */}
          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#colorPrice)"
          />
          
          {/* Predicted price */}
          {showPrediction && (
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="url(#colorPredicted)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
import { TrendingUp, Brain, Target } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PredictionData {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  trend: 'up' | 'down';
  targetDate: string;
}

interface PredictionPanelProps {
  prediction: PredictionData;
}

export const PredictionPanel = ({ prediction }: PredictionPanelProps) => {
  const priceChange = prediction.predictedPrice - prediction.currentPrice;
  const percentChange = (priceChange / prediction.currentPrice) * 100;

  return (
    <Card className="glass-card p-6 glow-primary">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold gradient-text">AI Prediction</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Current Price</span>
            <span className="text-xl font-bold text-foreground">
              ${prediction.currentPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Predicted Price</span>
            <span className={`text-xl font-bold ${prediction.trend === 'up' ? 'text-profit' : 'text-loss'}`}>
              ${prediction.predictedPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="p-4 glass rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">Expected Change</span>
          </div>
          <p className={`text-2xl font-bold ${prediction.trend === 'up' ? 'text-profit' : 'text-loss'}`}>
            {prediction.trend === 'up' ? '+' : ''}{priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            by {prediction.targetDate}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Model Confidence</span>
            <span className="text-sm font-bold text-primary">{prediction.confidence}%</span>
          </div>
          <Progress value={prediction.confidence} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Based on technical indicators, market sentiment, and historical patterns
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 glass rounded-lg">
          <TrendingUp className={`h-5 w-5 ${prediction.trend === 'up' ? 'text-profit' : 'text-loss'}`} />
          <span className="text-sm text-foreground">
            {prediction.trend === 'up' 
              ? 'Bullish trend detected - Buy signal' 
              : 'Bearish trend detected - Consider selling'}
          </span>
        </div>
      </div>
    </Card>
  );
};
import React from "react";
import { TrendingUp, Brain, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const currencySymbols: { [key: string]: string } = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

interface PredictionData {
  currentPrice: number;
  predictedPrice: number;
  confidence: number; // 0-100
  trend: "up" | "down";
  targetDate?: string;
  currency?: string;
}

interface PredictionPanelProps {
  prediction: PredictionData;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({ prediction }) => {
  const {
    currentPrice = 0,
    predictedPrice = 0,
    confidence = 0,
    trend = "up",
    targetDate = "7 days",
    currency = "USD",
  } = prediction;

  const currencySymbol = currencySymbols[currency] ?? currency;
  const priceChange = predictedPrice - currentPrice;
  const percentChange = currentPrice > 0 ? (priceChange / currentPrice) * 100 : 0;
  const isPositive = trend === "up";

  return (
    <Card className="w-full p-6 bg-neutral-900/50 border border-neutral-700 rounded-2xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold">AI-Powered Prediction</h3>
      </div>

      <div className="space-y-6">
        {/* Price Comparison */}
        <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-neutral-400">Current</span>
            <span className="text-2xl font-bold text-white">
              {currencySymbol}
              {Number(currentPrice ?? 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-baseline mt-2">
            <span className="text-sm text-neutral-400">AI Predicted</span>
            <span
              className={cn("text-2xl font-bold", isPositive ? "text-green-400" : "text-red-400")}
            >
              {currencySymbol}
              {Number(predictedPrice ?? 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Expected Change */}
        <div className="text-center">
          <p className="text-sm text-neutral-400">Expected Change by {targetDate}</p>
          <div className={cn("flex items-center justify-center gap-2 mt-1", isPositive ? "text-green-400" : "text-red-400")}>
            {isPositive ? <ArrowUp className="h-7 w-7" /> : <ArrowDown className="h-7 w-7" />}
            <p className="text-4xl font-black">
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
            </p>
          </div>
        </div>

        {/* Confidence */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-neutral-300">Model Confidence</span>
            <span className="text-sm font-bold text-primary">{Math.round(confidence)}%</span>
          </div>

          {/* Use Progress with only supported props — className applied to outer, styling inner via CSS */}
          <div className="h-2 bg-neutral-800 rounded overflow-hidden">
            <div
              className={cn("h-full transition-all duration-700", isPositive ? "bg-green-400" : "bg-red-400")}
              style={{ width: `${Math.max(0, Math.min(100, confidence))}%` }}
              aria-hidden
            />
          </div>
        </div>

        {/* Signal */}
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border",
            isPositive ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
          )}
        >
          <TrendingUp className={cn("h-5 w-5", isPositive ? "text-green-400" : "text-red-400")} />
          <span className="text-sm font-medium text-neutral-200">
            {isPositive
              ? "Bullish trend detected — potential buy signal."
              : "Bearish trend detected — potential sell signal."}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PredictionPanel;

import { atr, bollinger, macd, rsi, OHLC } from "./indicators";

export type Prediction = {
  currentPrice: number;
  predictedPrice: number;
  confidence: number; // 0-100
  trend: "up" | "down";
  targetDate: string; // e.g., "7 days"
  currency?: string;
  rationale: string[];
};

// Build a score from multiple indicator signals and project a small move scaled by volatility
export function predictNextClose(ohlc: OHLC, currency = "USD"): Prediction {
  const closes = ohlc.close.filter((v) => v != null) as number[];
  const highs = ohlc.high.filter((v) => v != null) as number[];
  const lows = ohlc.low.filter((v) => v != null) as number[];
  const n = closes.length;
  const rationale: string[] = [];

  const current = closes[n - 1] ?? 0;
  // Allow shorter histories (>=20). If still insufficient, provide a small baseline move
  if (n < 20 || current === 0) {
    return {
      currentPrice: current,
      // apply tiny baseline drift so UI shows a non-zero expectation
      predictedPrice: current * 1.0025, // +0.25%
      confidence: 20,
      trend: "up",
      targetDate: "7 days",
      currency,
      rationale: ["Limited history available — baseline drift applied"],
    };
  }

  // Indicators
  const rsiVals = rsi(closes, 14);
  const lastRSI = rsiVals[rsiVals.length - 1] ?? 50;

  const { macd: macdLine, signal: signalLine, histogram } = macd(closes, 12, 26, 9);
  const lastHist = histogram[histogram.length - 1] ?? 0;
  const prevHist = histogram[histogram.length - 2] ?? 0;

  const bb = bollinger(closes, 20, 2);
  const lastBB = bb[bb.length - 1];
  const distToLower = lastBB ? (current - lastBB.lower) / (lastBB.upper - lastBB.lower) : 0.5;

  const atrVals = atr(highs, lows, closes, 14);
  const lastATR = atrVals[atrVals.length - 1] ?? 0;
  const atrPct = lastATR / current; // volatility proxy

  // Signals and rationale
  let score = 0;
  const maxScore = 6; // sum of weights below

  // RSI contrarian at extremes
  if (lastRSI < 30) {
    score += 2;
    rationale.push(`RSI ${lastRSI.toFixed(1)} (oversold)`);
  } else if (lastRSI > 70) {
    score -= 2;
    rationale.push(`RSI ${lastRSI.toFixed(1)} (overbought)`);
  }

  // MACD momentum and histogram slope
  if (lastHist > 0) {
    score += 1;
    rationale.push("MACD histogram positive (bullish momentum)");
  } else if (lastHist < 0) {
    score -= 1;
    rationale.push("MACD histogram negative (bearish momentum)");
  }
  if (lastHist > prevHist) {
    score += 1; // momentum improving
    rationale.push("MACD momentum improving");
  } else if (lastHist < prevHist) {
    score -= 1; // momentum weakening
    rationale.push("MACD momentum weakening");
  }

  // Bollinger mean reversion: near lower band -> up, near upper -> down
  if (distToLower < 0.1) {
    score += 1;
    rationale.push("Price near lower Bollinger band (reversion up)");
  } else if (distToLower > 0.9) {
    score -= 1;
    rationale.push("Price near upper Bollinger band (reversion down)");
  }

  // Compose trend and magnitude
  const trend: "up" | "down" = score >= 0 ? "up" : "down";
  const confidence = Math.min(100, Math.max(15, Math.round((Math.abs(score) / maxScore) * 100)));

  // Projected move: use ATR% scaled by score (capped) and a small base
  const base = 0.25 / 100; // 0.25%
  const movePct = Math.min(0.02, base + Math.abs(score) * atrPct * 0.5); // cap at 2%
  const signedMove = (trend === "up" ? 1 : -1) * movePct;
  const predictedPrice = current * (1 + signedMove);

  return {
    currentPrice: current,
    predictedPrice,
    confidence,
    trend,
    targetDate: "7 days",
    currency,
    rationale,
  };
}

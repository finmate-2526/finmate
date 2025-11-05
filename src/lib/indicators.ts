// Lightweight technical indicators with safe guards
// Inputs are arrays ordered oldest -> newest

export function sma(values: number[], period: number): number[] {
  if (period <= 0) return [];
  const out: number[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i] ?? 0;
    sum += v;
    if (i >= period) sum -= values[i - period] ?? 0;
    if (i >= period - 1) out.push(sum / period);
  }
  return out;
}

export function ema(values: number[], period: number): number[] {
  if (period <= 0 || values.length === 0) return [];
  const k = 2 / (period + 1);
  const out: number[] = [];
  let prev = values[0] ?? 0;
  for (let i = 0; i < values.length; i++) {
    const v = values[i] ?? prev;
    prev = i === 0 ? v : v * k + prev * (1 - k);
    out.push(prev);
  }
  return out;
}

export function rsi(values: (number | null)[], period = 14): number[] {
  if (period <= 0 || values.length <= period) return [];
  const closes = values.map(v => v ?? 0);
  const gains: number[] = [];
  const losses: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    gains.push(Math.max(0, change));
    losses.push(Math.max(0, -change));
  }
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const rsis: number[] = new Array(period).fill(NaN);
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    const rs = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    rsis.push(rs);
  }
  return rsis.filter((v) => !Number.isNaN(v));
}

export function macd(values: (number | null)[], fast = 12, slow = 26, signal = 9) {
  const closes = values.map(v => v ?? 0);
  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);
  const macdLine: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    macdLine.push((emaFast[i] ?? 0) - (emaSlow[i] ?? 0));
  }
  const signalLine = ema(macdLine, signal);
  const hist: number[] = macdLine.map((m, i) => m - (signalLine[i] ?? 0));
  return { macd: macdLine, signal: signalLine, histogram: hist };
}

export function bollinger(values: (number | null)[], period = 20, mult = 2) {
  const closes = values.map(v => v ?? 0);
  const ma = sma(closes, period);
  const out: { middle: number; upper: number; lower: number }[] = [];
  for (let i = period - 1; i < closes.length; i++) {
    const slice = closes.slice(i - period + 1, i + 1);
    const mean = ma[i - (period - 1)];
    const variance = slice.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / period;
    const sd = Math.sqrt(variance);
    out.push({ middle: mean, upper: mean + mult * sd, lower: mean - mult * sd });
  }
  return out;
}

export function atr(highs: (number | null)[], lows: (number | null)[], closes: (number | null)[], period = 14): number[] {
  const H = highs.map(v => v ?? 0);
  const L = lows.map(v => v ?? 0);
  const C = closes.map(v => v ?? 0);
  const trs: number[] = [];
  for (let i = 0; i < H.length; i++) {
    if (i === 0) trs.push(H[i] - L[i]);
    else trs.push(Math.max(H[i] - L[i], Math.abs(H[i] - C[i - 1]), Math.abs(L[i] - C[i - 1])));
  }
  return ema(trs, period);
}

export type OHLC = {
  close: (number | null)[];
  high: (number | null)[];
  low: (number | null)[];
};

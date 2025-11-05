import axios from 'axios';
import { authHeaders, getToken } from './auth';
import { API_BASE as API_BASE_URL } from './config';

export type Preferences = {
  lastSymbol?: string;
  timeRange?: string;
  indicators?: { sma?: boolean; ema?: boolean; rsi?: boolean; macd?: boolean; bbands?: boolean };
  density?: 'comfortable' | 'compact';
  panelOrder?: string[];
};

// Remove undefined values recursively to avoid accidentally sending undefined
function cleanUndefined<T>(obj: T): T {
  if (obj == null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(cleanUndefined) as unknown as T;
  const out: any = {};
  for (const [k, v] of Object.entries(obj as any)) {
    if (v !== undefined) out[k] = cleanUndefined(v as any);
  }
  return out as T;
}

export async function getPreferences(): Promise<Preferences | null> {
  try {
    // Avoid unnecessary network calls (and noisy 401/500 logs) when not authenticated
    if (!getToken()) return null;
    const res = await axios.get(`${API_BASE_URL}/preferences`, { headers: authHeaders() });
    return res.data || {};
  } catch (e) {
    // Helpful client-side log for debugging
    if (axios.isAxiosError(e)) {
      console.error('getPreferences failed:', e.response?.status, e.response?.data || e.message);
    } else {
      console.error('getPreferences failed:', (e as any)?.message || e);
    }
    return null;
  }
}

export async function updatePreferences(prefs: Preferences): Promise<Preferences | null> {
  try {
    if (!getToken()) return null;
    const payload = cleanUndefined(prefs);
    const res = await axios.put(`${API_BASE_URL}/preferences`, payload, { headers: authHeaders() });
    return res.data || {};
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error('updatePreferences failed:', e.response?.status, e.response?.data || e.message);
    } else {
      console.error('updatePreferences failed:', (e as any)?.message || e);
    }
    return null;
  }
}

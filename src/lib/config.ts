// Centralized client configuration
// Use VITE_API_BASE_URL when provided; otherwise default to same-origin '/api'
const raw = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
// Normalize: remove any trailing slash to avoid double slashes when appending '/api'
export const API_BASE_URL = raw ? raw.replace(/\/+$/, '') : '';

// Runtime safeguard: if env is missing in production on Vercel, point to Render backend
const origin = typeof window !== 'undefined' ? window.location.origin : '';
const isProdVercel = /vercel\.app$/i.test(typeof window !== 'undefined' ? window.location.hostname : '');

export const API_BASE = API_BASE_URL
	? `${API_BASE_URL}/api`
	: (isProdVercel ? 'https://finmate-api.onrender.com/api' : '/api');

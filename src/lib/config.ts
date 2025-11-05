// Centralized client configuration
// Use VITE_API_BASE_URL when provided; otherwise default to same-origin '/api'
const raw = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
export const API_BASE_URL = raw ? raw.replace(/\/$/, '') : '';
export const API_BASE = API_BASE_URL ? `${API_BASE_URL}/api` : '/api';

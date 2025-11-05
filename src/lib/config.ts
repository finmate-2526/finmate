// Centralized client configuration
// Set VITE_API_BASE_URL in your environment (e.g., https://api.yourdomain.com)
// Fallbacks to localhost for local development.
export const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:4001';
export const API_BASE = `${API_BASE_URL}/api`;

import axios from 'axios';
import { API_BASE as API_BASE_URL } from './config';
const TOKEN_KEY = 'finmate_token';
const USER_KEY = 'finmate_user';

export function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

function setSession(token: string, email: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ email }));
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getCurrentUser(): { email: string } | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export async function register(email: string, password: string) {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, { email, password });
  const { token, user } = res.data;
  setSession(token, user.email);
  return { user };
}

export async function login(email: string, password: string) {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  const { token, user } = res.data;
  setSession(token, user.email);
  return { user };
}

export function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

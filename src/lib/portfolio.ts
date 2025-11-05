import axios from 'axios';
import { authHeaders } from './auth';

const API_BASE_URL = 'http://localhost:4001/api';

export type Position = {
  symbol: string;
  quantity: number;
  avgCost: number;
  currency?: string;
  notes?: string;
};

export async function getPortfolio(): Promise<Position[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/portfolio`, { headers: authHeaders() });
    return res.data || [];
  } catch {
    return [];
  }
}

export async function addPosition(pos: Position): Promise<Position | null> {
  try {
    const res = await axios.post(`${API_BASE_URL}/portfolio`, pos, { headers: authHeaders() });
    return res.data || null;
  } catch {
    return null;
  }
}

export async function updatePosition(index: number, pos: Partial<Position>): Promise<Position | null> {
  try {
    const res = await axios.put(`${API_BASE_URL}/portfolio/${index}`, pos, { headers: authHeaders() });
    return res.data || null;
  } catch {
    return null;
  }
}

export async function deletePosition(index: number): Promise<boolean> {
  try {
    await axios.delete(`${API_BASE_URL}/portfolio/${index}`, { headers: authHeaders() });
    return true;
  } catch {
    return false;
  }
}

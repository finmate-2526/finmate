import { useEffect, useMemo, useRef, useState } from 'react';
import { Position, getPortfolio, addPosition, deletePosition, updatePosition } from '@/lib/portfolio';
import { fetchStockData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

function useLatestPrices(symbols: string[]) {
  const [prices, setPrices] = useState<Record<string, { price: number|null; currency: string }>>({});
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(symbols.map(async (sym) => {
        try {
          const data = await fetchStockData(sym);
          const result = data?.chart?.result?.[0];
          const meta = result?.meta ?? {};
          const price = meta.regularMarketPrice ?? meta.previousClose ?? null;
          const currency = meta.currency ?? 'USD';
          return [sym, { price, currency }] as const;
        } catch {
          return [sym, { price: null, currency: 'USD' }] as const;
        }
      }));
      if (!cancelled) {
        setPrices(Object.fromEntries(entries));
      }
    })();
    return () => { cancelled = true; };
  }, [symbols.join(',')]);
  return prices;
}

export default function PortfolioPanel() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [form, setForm] = useState<Position>({ symbol: '', quantity: 0, avgCost: 0, currency: 'USD' });
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Position>>({});
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getPortfolio();
      setPositions(data);
      setLoading(false);
    })();
  }, []);

  const prices = useLatestPrices(positions.map(p => p.symbol));

  const rows = useMemo(() => {
    return positions.map((p, idx) => {
      const last = prices[p.symbol];
      const marketValue = (last?.price ?? 0) * p.quantity;
      const cost = p.avgCost * p.quantity;
      const pnl = marketValue - cost;
      const pnlPct = cost ? (pnl / cost) * 100 : 0;
      return { idx, ...p, last, marketValue, cost, pnl, pnlPct };
    });
  }, [positions, prices]);

  async function onAdd() {
    if (!form.symbol || form.quantity <= 0 || form.avgCost <= 0) {
      toast.error('Please enter symbol, quantity, and average cost');
      return;
    }
    const optimistic = [...positions, { ...form, symbol: form.symbol.toUpperCase() }];
    setPositions(optimistic);
    const created = await addPosition({ ...form, symbol: form.symbol.toUpperCase() });
    if (created) {
      toast.success('Position added');
      setForm({ symbol: '', quantity: 0, avgCost: 0, currency: 'USD' });
    } else {
      toast.error('Failed to add position');
      setPositions(positions);
    }
  }

  async function onDelete(index: number) {
    const optimistic = positions.filter((_, i) => i !== index);
    setPositions(optimistic);
    const ok = await deletePosition(index);
    if (ok) {
      toast.success('Position removed');
    } else {
      toast.error('Failed to remove position');
      setPositions(positions);
    }
  }

  async function onSaveEdit(index: number) {
    const patch: Partial<Position> = {};
    if (editForm.quantity != null) patch.quantity = Number(editForm.quantity);
    if (editForm.avgCost != null) patch.avgCost = Number(editForm.avgCost);
    if (editForm.currency) patch.currency = editForm.currency;
    if (editForm.notes != null) patch.notes = editForm.notes;
    const prev = [...positions];
    const updatedLocal = { ...positions[index], ...patch } as Position;
    const optimistic = prev.map((p, i) => (i === index ? updatedLocal : p));
    setPositions(optimistic);
    const updated = await updatePosition(index, patch);
    if (updated) {
      toast.success('Position updated');
      setEditingIndex(null);
      setEditForm({});
    } else {
      toast.error('Failed to update');
      setPositions(prev);
    }
  }

  function onExportCSV() {
    const header = 'symbol,quantity,avgCost,currency,notes\n';
    const lines = positions.map(p => [p.symbol, p.quantity, p.avgCost, p.currency || '', (p.notes || '').replace(/\n/g, ' ')].join(','));
    const csv = header + lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  async function onImportCSV(file: File) {
    try {
      const text = await file.text();
      const rows = text.split(/\r?\n/).filter(Boolean);
      if (rows.length === 0) return;
      let start = 0;
      const header = rows[0].toLowerCase();
      if (header.includes('symbol') && header.includes('quantity')) start = 1;
      let added = 0;
      for (let i = start; i < rows.length; i++) {
        const cols = rows[i].split(',');
        const [symbolRaw, qtyRaw, costRaw, currency, ...rest] = cols;
        const notes = rest.join(',').trim();
        const symbol = (symbolRaw || '').trim().toUpperCase();
        const quantity = Number(qtyRaw);
        const avgCost = Number(costRaw);
        if (!symbol || !Number.isFinite(quantity) || !Number.isFinite(avgCost)) continue;
        const created = await addPosition({ symbol, quantity, avgCost, currency: (currency || 'USD').trim() || 'USD', notes });
        if (created) {
          setPositions(p => [...p, created]);
          added++;
        }
      }
      if (added > 0) toast.success(`Imported ${added} position(s)`);
      else toast.error('No valid rows found');
    } catch {
      toast.error('Failed to import CSV');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">Manage your positions</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onExportCSV}>Export CSV</Button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onImportCSV(f); e.currentTarget.value = ''; }} />
          <Button onClick={() => fileRef.current?.click()}>Import CSV</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <Input placeholder="Symbol (e.g. AAPL)" value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value }))} />
        <Input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))} />
        <Input type="number" placeholder="Avg Cost" value={form.avgCost} onChange={e => setForm(f => ({ ...f, avgCost: Number(e.target.value) }))} />
        <Input placeholder="Currency" value={form.currency || ''} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} />
        <Button onClick={onAdd}>Add</Button>
      </div>

      <div className="border border-gray-800 rounded overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Avg Cost</TableHead>
              <TableHead className="text-right">Last</TableHead>
              <TableHead className="text-right">Market Value</TableHead>
              <TableHead className="text-right">P&L</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center text-gray-400">Loading...</TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-gray-400">No positions</TableCell></TableRow>
            ) : rows.map(r => (
              <TableRow key={`${r.symbol}-${r.idx}`}>
                <TableCell className="font-medium">{r.symbol}</TableCell>
                <TableCell className="text-right">
                  {editingIndex === r.idx ? (
                    <Input className="text-right" type="number" value={editForm.quantity ?? r.quantity} onChange={e => setEditForm(f => ({ ...f, quantity: Number(e.target.value) }))} />
                  ) : r.quantity}
                </TableCell>
                <TableCell className="text-right">
                  {editingIndex === r.idx ? (
                    <Input className="text-right" type="number" value={editForm.avgCost ?? r.avgCost} onChange={e => setEditForm(f => ({ ...f, avgCost: Number(e.target.value) }))} />
                  ) : r.avgCost.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">{r.last?.price != null ? r.last.price.toFixed(2) : '—'}</TableCell>
                <TableCell className="text-right">{r.marketValue.toFixed(2)}</TableCell>
                <TableCell className={"text-right " + (r.pnl >= 0 ? 'text-green-400' : 'text-red-400')}>{r.pnl.toFixed(2)} ({r.pnlPct.toFixed(2)}%)</TableCell>
                <TableCell className="text-right space-x-2">
                  {editingIndex === r.idx ? (
                    <>
                      <Button size="sm" onClick={() => onSaveEdit(r.idx)}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingIndex(null); setEditForm({}); }}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => { setEditingIndex(r.idx); setEditForm({ quantity: r.quantity, avgCost: r.avgCost, currency: r.last?.currency || 'USD', notes: positions[r.idx]?.notes }); }}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => onDelete(r.idx)}>Remove</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

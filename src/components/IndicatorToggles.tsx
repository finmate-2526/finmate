import { Switch } from '@/components/ui/switch';

export type IndicatorState = {
  sma: boolean;
  ema: boolean;
  rsi: boolean;
  macd: boolean;
  bbands: boolean;
};

export default function IndicatorToggles({ state, onChange }: { state: IndicatorState; onChange: (s: Partial<IndicatorState>) => void; }) {
  const Row = ({ k, label }: { k: keyof IndicatorState; label: string }) => (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-300">{label}</span>
      <Switch checked={state[k]} onCheckedChange={(v) => onChange({ [k]: v } as any)} />
    </div>
  );
  return (
    <div className="grid grid-cols-2 gap-2">
      <Row k="sma" label="SMA" />
      <Row k="ema" label="EMA" />
      <Row k="rsi" label="RSI" />
      <Row k="macd" label="MACD" />
      <Row k="bbands" label="Bollinger" />
    </div>
  );
}

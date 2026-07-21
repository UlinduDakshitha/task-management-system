import { ReactNode } from 'react';
import { Hexagon } from './Hexagon';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  accent: string;
  onClick?: () => void;
  active?: boolean;
}

export function StatCard({ label, value, icon, accent, onClick, active }: StatCardProps) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      className={`relative overflow-hidden rounded-xl border bg-white p-5 text-left shadow-sm transition ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md' : ''
      } ${active ? 'border-amber ring-2 ring-amber' : 'border-slate-200'}`}
    >
      <div className="relative flex items-center gap-4">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
          <Hexagon className="absolute inset-0 h-full w-full" fill={accent} />
          <span className="relative text-white">{icon}</span>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold leading-none text-ink">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </Wrapper>
  );
}

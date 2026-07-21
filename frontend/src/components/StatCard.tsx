import { ReactNode } from 'react';
import { Hexagon } from './Hexagon';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  accent: string;
}

export function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
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
    </div>
  );
}

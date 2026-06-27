import type { ReactNode } from 'react';

interface GearCardProps {
  title: string;
  subtitle?: string;
  status?: 'available' | 'purchased' | 'completed';
  children?: ReactNode;
  compact?: boolean;
}

const statusColorMap: Record<NonNullable<GearCardProps['status']>, string> = {
  available: 'bg-slate-500',
  purchased: 'bg-blue-500',
  completed: 'bg-emerald-500',
};

export const GearCard = ({ title, subtitle, status, children, compact = false }: GearCardProps) => (
  <div
    className={`rounded-lg border border-slate-600 bg-slate-800 transition hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 ${compact ? 'p-2' : 'p-3'}`}
  >
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-slate-100`}>{title}</p>
        {subtitle ? <p className="mt-1 text-xs text-slate-300">{subtitle}</p> : null}
      </div>
      {status ? <span className={`mt-0.5 h-2 w-2 rounded-full ${statusColorMap[status]}`} /> : null}
    </div>
    {children ? <div className="mt-2">{children}</div> : null}
  </div>
);

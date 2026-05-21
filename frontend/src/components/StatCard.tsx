import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  variant?: 'default' | 'income' | 'expense' | 'warning';
  subtitle?: string;
}

export function StatCard({ title, value, icon: Icon, variant = 'default', subtitle }: StatCardProps) {
  const colors = {
    default: 'bg-mosque-50 text-mosque-700 border-mosque-100',
    income: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    expense: 'bg-rose-50 text-rose-700 border-rose-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
  };

  return (
    <div className="card flex items-start gap-4">
      <div className={clsx('rounded-xl border p-3', colors[variant])}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-stone-500">{title}</p>
        <p className="mt-1 truncate text-2xl font-bold text-stone-900">{value}</p>
        {subtitle && <p className="mt-0.5 text-xs text-stone-500">{subtitle}</p>}
      </div>
    </div>
  );
}

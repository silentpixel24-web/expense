'use client';

import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { StatCard } from '@/components/StatCard';
import { IncomePieChart, ExpensePieChart, TrendLineChart, ComparisonBarChart } from '@/components/Charts';
import { api, DashboardData } from '@/lib/api';
import { formatCurrency, INCOME_SOURCES, EXPENSE_CATEGORIES } from '@/lib/constants';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const { t } = useLocale();
  const { user } = useAuth();

  useEffect(() => {
    api<DashboardData>('/dashboard').then(setData).catch(console.error);
  }, []);

  return (
    <ProtectedLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">{t('dashboard')}</h1>
        <p className="text-stone-500">
          {t('welcome')}, {user?.name}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={t('totalBalance')}
          value={formatCurrency(data?.balance ?? 0)}
          icon={Wallet}
        />
        <StatCard
          title={t('monthlyIncome')}
          value={formatCurrency(data?.monthlyIncome ?? 0)}
          icon={TrendingUp}
          variant="income"
        />
        <StatCard
          title={t('monthlyExpense')}
          value={formatCurrency(data?.monthlyExpense ?? 0)}
          icon={TrendingDown}
          variant="expense"
        />
        <StatCard
          title={t('pendingPayments')}
          value={String(data?.pendingPayments ?? 0)}
          icon={Clock}
          variant="warning"
          subtitle="Awaiting approval"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 font-semibold text-stone-900">Income vs Expense Trend</h2>
          <TrendLineChart data={data?.monthlyTrend ?? []} />
        </div>
        <div className="card">
          <h2 className="mb-4 font-semibold text-stone-900">Monthly Comparison</h2>
          <ComparisonBarChart data={data?.monthlyTrend ?? []} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 font-semibold">Income by Source (YTD)</h2>
          <IncomePieChart data={data?.incomeBySource ?? []} />
        </div>
        <div className="card">
          <h2 className="mb-4 font-semibold">Expense by Category (YTD)</h2>
          <ExpensePieChart data={data?.expenseByCategory ?? []} />
        </div>
      </div>

      <div className="card mt-8">
        <h2 className="mb-4 font-semibold">{t('recentTransactions')}</h2>
        <div className="table-wrap border-0">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Reference</th>
                <th>Details</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentTransactions ?? []).map((tx, i) => {
                const isIncome = tx.type === 'income';
                const ref = isIncome
                  ? (tx.receiptNumber as string)
                  : (tx.referenceNumber as string);
                const label = isIncome
                  ? INCOME_SOURCES[tx.source as string] || tx.source
                  : EXPENSE_CATEGORIES[tx.category as string] || tx.category;
                return (
                  <tr key={i}>
                    <td>{format(new Date(tx.date as string), 'dd MMM yyyy')}</td>
                    <td>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          isIncome ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isIncome ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="font-mono text-xs">{ref}</td>
                    <td>{label as string}</td>
                    <td className="text-right font-medium">
                      {formatCurrency(tx.amount as number)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedLayout>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { api, getToken } from '@/lib/api';
import { formatCurrency, INCOME_SOURCES, EXPENSE_CATEGORIES } from '@/lib/constants';
import { IncomePieChart, ExpensePieChart } from '@/components/Charts';
import { useLocale } from '@/context/LocaleContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ReportData {
  period: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeBySource: { _id: string; total: number }[];
  expenseByCategory: { _id: string; total: number }[];
}

export default function ReportsPage() {
  const { t } = useLocale();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<string>(String(new Date().getMonth()));
  const [report, setReport] = useState<ReportData | null>(null);

  useEffect(() => {
    const q = month === 'all' ? `year=${year}` : `year=${year}&month=${month}`;
    api<ReportData>(`/reports?${q}`).then(setReport).catch(console.error);
  }, [year, month]);

  const downloadWithAuth = async (type: 'pdf' | 'excel') => {
    const q = month === 'all' ? `year=${year}` : `year=${year}&month=${month}`;
    const res = await fetch(`${API_URL}/reports/${type}?${q}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mosque-report.${type === 'pdf' ? 'pdf' : 'xlsx'}`;
    a.click();
  };

  return (
    <ProtectedLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t('reports')}</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => downloadWithAuth('pdf')} className="btn-secondary">
            <FileText className="h-4 w-4" /> PDF
          </button>
          <button onClick={() => downloadWithAuth('excel')} className="btn-secondary">
            <Download className="h-4 w-4" /> Excel
          </button>
        </div>
      </div>

      <div className="card mb-6 flex flex-wrap gap-4">
        <div>
          <label className="label">Year</label>
          <select className="input w-32" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))}>
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Month</label>
          <select className="input w-40" value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="all">Full Year</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2000, i, 1).toLocaleString('en', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {report && (
        <>
          <p className="mb-4 text-stone-500">Period: {report.period}</p>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="card text-center">
              <p className="text-sm text-stone-500">Total Income</p>
              <p className="text-2xl font-bold text-emerald-700">{formatCurrency(report.totalIncome)}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-stone-500">Total Expense</p>
              <p className="text-2xl font-bold text-rose-700">{formatCurrency(report.totalExpense)}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-stone-500">Balance</p>
              <p className="text-2xl font-bold text-mosque-800">{formatCurrency(report.balance)}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card">
              <h2 className="mb-4 font-semibold">Income Breakdown</h2>
              <IncomePieChart data={report.incomeBySource} />
              <ul className="mt-4 space-y-1 text-sm">
                {report.incomeBySource.map((s) => (
                  <li key={s._id} className="flex justify-between">
                    <span>{INCOME_SOURCES[s._id] || s._id}</span>
                    <span className="font-medium">{formatCurrency(s.total)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h2 className="mb-4 font-semibold">Expense Breakdown</h2>
              <ExpensePieChart data={report.expenseByCategory} />
              <ul className="mt-4 space-y-1 text-sm">
                {report.expenseByCategory.map((s) => (
                  <li key={s._id} className="flex justify-between">
                    <span>{EXPENSE_CATEGORIES[s._id] || s._id}</span>
                    <span className="font-medium">{formatCurrency(s.total)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </ProtectedLayout>
  );
}

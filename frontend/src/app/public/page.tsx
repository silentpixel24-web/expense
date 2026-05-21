'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Landmark } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { publicApi, PublicSummary, Notice, DonationQr } from '@/lib/api';
import { formatCurrency, INCOME_SOURCES, EXPENSE_CATEGORIES } from '@/lib/constants';
import { IncomePieChart, ExpensePieChart } from '@/components/Charts';
import { useLocale } from '@/context/LocaleContext';

export default function PublicPortalPage() {
  const { t, locale, setLocale } = useLocale();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [summary, setSummary] = useState<PublicSummary | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [qr, setQr] = useState<DonationQr | null>(null);

  useEffect(() => {
    publicApi.summary(year, month).then(setSummary).catch(console.error);
    publicApi.notices().then(setNotices).catch(console.error);
    publicApi.donationQr().then(setQr).catch(console.error);
  }, [year, month]);

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-mosque-200 bg-mosque-900 px-4 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Landmark className="h-8 w-8 text-gold-400" />
            <div>
              <h1 className="text-lg font-bold text-white">{t('transparency')}</h1>
              <p className="text-xs text-mosque-200">Public Financial Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as 'en' | 'ta' | 'ar')}
              className="rounded-lg border border-mosque-600 bg-mosque-800 px-2 py-1 text-sm text-white"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="ar">العربية</option>
            </select>
            <Link href="/login" className="btn-primary text-sm">
              Committee Login
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-4">
          <select className="input w-auto" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))}>
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select className="input w-auto" value={month} onChange={(e) => setMonth(parseInt(e.target.value, 10))}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2000, i, 1).toLocaleString('en', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        {summary && (
          <>
            <p className="mb-4 text-stone-600">{summary.period.label}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="card border-emerald-200 bg-emerald-50 text-center">
                <p className="text-sm text-emerald-700">{t('collections')}</p>
                <p className="text-2xl font-bold text-emerald-900">{formatCurrency(summary.totalCollections)}</p>
              </div>
              <div className="card border-rose-200 bg-rose-50 text-center">
                <p className="text-sm text-rose-700">{t('expenditures')}</p>
                <p className="text-2xl font-bold text-rose-900">{formatCurrency(summary.totalExpenditures)}</p>
              </div>
              <div className="card border-mosque-200 bg-mosque-50 text-center">
                <p className="text-sm text-mosque-700">Balance</p>
                <p className="text-2xl font-bold text-mosque-900">{formatCurrency(summary.balance)}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="card">
                <h2 className="mb-4 font-semibold">Collections by Source</h2>
                <IncomePieChart data={summary.incomeBySource} />
              </div>
              <div className="card">
                <h2 className="mb-4 font-semibold">Spending by Category</h2>
                <ExpensePieChart data={summary.expenseByCategory} />
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="card">
                <h3 className="mb-3 font-semibold">Income Details</h3>
                <ul className="space-y-2 text-sm">
                  {summary.incomeBySource.map((s) => (
                    <li key={s._id} className="flex justify-between border-b border-stone-100 pb-2">
                      <span>{INCOME_SOURCES[s._id] || s._id}</span>
                      <span className="font-medium">{formatCurrency(s.total)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card">
                <h3 className="mb-3 font-semibold">Expense Details</h3>
                <ul className="space-y-2 text-sm">
                  {summary.expenseByCategory.map((s) => (
                    <li key={s._id} className="flex justify-between border-b border-stone-100 pb-2">
                      <span>{EXPENSE_CATEGORIES[s._id] || s._id}</span>
                      <span className="font-medium">{formatCurrency(s.total)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {qr && (
          <div className="card mt-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <QRCodeSVG value={qr.qrData} size={160} level="M" />
            <div>
              <h2 className="text-lg font-semibold">{t('donate')}</h2>
              <p className="mt-1 text-sm text-stone-600">{qr.message}</p>
              <p className="mt-2 font-mono text-mosque-800">UPI: {qr.upiId}</p>
            </div>
          </div>
        )}

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Notice Board</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {notices.map((n) => (
              <article key={n._id} className="card">
                <span className="text-xs font-medium uppercase text-mosque-600">{n.type.replace('_', ' ')}</span>
                <h3 className="mt-1 font-semibold">{n.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{n.content}</p>
                {n.targetAmount != null && (
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{n.progressPercent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                      <div
                        className="h-full rounded-full bg-mosque-600 transition-all"
                        style={{ width: `${n.progressPercent ?? 0}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-stone-500">
                      {formatCurrency(n.raisedAmount || 0)} of {formatCurrency(n.targetAmount)}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <p className="mt-12 text-center text-xs text-stone-400">
          Sensitive admin details are hidden. Only approved public transactions are shown.
        </p>
      </main>
    </div>
  );
}

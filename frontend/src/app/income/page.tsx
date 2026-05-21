'use client';

import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { api, getToken } from '@/lib/api';
import { formatCurrency, INCOME_SOURCES, canWriteFinance } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { format } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface IncomeItem {
  _id: string;
  receiptNumber: string;
  source: string;
  amount: number;
  date: string;
  donorName?: string;
  paymentMethod: string;
}

export default function IncomePage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [items, setItems] = useState<IncomeItem[]>([]);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    source: 'friday_collection',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    donorName: '',
    description: '',
    paymentMethod: 'cash',
  });
  const [file, setFile] = useState<File | null>(null);

  const load = () => {
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (source) q.set('source', source);
    api<{ items: IncomeItem[] }>(`/income?${q}`).then((r) => setItems(r.items));
  };

  useEffect(() => {
    load();
  }, [search, source]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('receipt', file);
    await fetch(`${API_URL}/income`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: fd,
    });
    setShowForm(false);
    setForm({ source: 'friday_collection', amount: '', date: new Date().toISOString().split('T')[0], donorName: '', description: '', paymentMethod: 'cash' });
    setFile(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this income record?')) return;
    await api(`/income/${id}`, { method: 'DELETE' });
    load();
  };

  const canWrite = user && canWriteFinance(user.role);

  return (
    <ProtectedLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t('income')}</h1>
        {canWrite && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Income
          </button>
        )}
      </div>

      {showForm && canWrite && (
        <form onSubmit={submit} className="card mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Source</label>
            <select className="input" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
              {Object.entries(INCOME_SOURCES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Amount (₹)</label>
            <input type="number" className="input" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label className="label">Donor Name</label>
            <input className="input" value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })} />
          </div>
          <div>
            <label className="label">Payment Method</label>
            <select className="input" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div>
            <label className="label">Receipt Image</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea className="input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input className="input pl-10" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">All Sources</option>
          {Object.entries(INCOME_SOURCES).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Date</th>
              <th>Source</th>
              <th>Donor</th>
              <th>Method</th>
              <th className="text-right">Amount</th>
              {canWrite && <th></th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="font-mono text-xs">{item.receiptNumber}</td>
                <td>{format(new Date(item.date), 'dd MMM yyyy')}</td>
                <td>{INCOME_SOURCES[item.source]}</td>
                <td>{item.donorName || '—'}</td>
                <td className="capitalize">{item.paymentMethod}</td>
                <td className="text-right font-medium text-emerald-700">{formatCurrency(item.amount)}</td>
                {canWrite && (
                  <td>
                    <button onClick={() => remove(item._id)} className="text-xs text-rose-600 hover:underline">Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedLayout>
  );
}

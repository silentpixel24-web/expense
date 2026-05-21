'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Check, X } from 'lucide-react';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { api, getToken } from '@/lib/api';
import { formatCurrency, EXPENSE_CATEGORIES, canWriteFinance, canApprove } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { format } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ExpenseItem {
  _id: string;
  referenceNumber: string;
  category: string;
  amount: number;
  date: string;
  vendor?: string;
  status: string;
}

export default function ExpenditurePage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: 'electricity',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    description: '',
    paymentMethod: 'bank',
    isRecurring: false,
  });
  const [file, setFile] = useState<File | null>(null);

  const load = () => {
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (status) q.set('status', status);
    api<{ items: ExpenseItem[] }>(`/expenditure?${q}`).then((r) => setItems(r.items));
  };

  useEffect(() => {
    load();
  }, [search, status]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (file) fd.append('bill', file);
    await fetch(`${API_URL}/expenditure`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: fd,
    });
    setShowForm(false);
    load();
  };

  const approve = async (id: string, newStatus: 'approved' | 'rejected') => {
    await api(`/expenditure/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
    load();
  };

  const canWrite = user && canWriteFinance(user.role);
  const canAppr = user && canApprove(user.role);

  return (
    <ProtectedLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t('expenditure')}</h1>
        {canWrite && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Expense
          </button>
        )}
      </div>

      {showForm && canWrite && (
        <form onSubmit={submit} className="card mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => (
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
            <label className="label">Vendor</label>
            <input className="input" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isRecurring} onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })} />
              Recurring monthly expense
            </label>
          </div>
          <div>
            <label className="label">Bill Attachment</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className="btn-primary">Submit</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input className="input pl-10" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ref #</th>
              <th>Date</th>
              <th>Category</th>
              <th>Vendor</th>
              <th>Status</th>
              <th className="text-right">Amount</th>
              {canAppr && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="font-mono text-xs">{item.referenceNumber}</td>
                <td>{format(new Date(item.date), 'dd MMM yyyy')}</td>
                <td>{EXPENSE_CATEGORIES[item.category]}</td>
                <td>{item.vendor || '—'}</td>
                <td>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      item.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="text-right font-medium text-rose-700">{formatCurrency(item.amount)}</td>
                {canAppr && item.status === 'pending' && (
                  <td className="flex gap-1">
                    <button onClick={() => approve(item._id, 'approved')} className="rounded p-1 text-emerald-600 hover:bg-emerald-50" title="Approve">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => approve(item._id, 'rejected')} className="rounded p-1 text-rose-600 hover:bg-rose-50" title="Reject">
                      <X className="h-4 w-4" />
                    </button>
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

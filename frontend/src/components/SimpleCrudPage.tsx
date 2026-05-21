'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { ProtectedLayout } from './ProtectedLayout';
import { api } from '@/lib/api';
import { canWriteFinance } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';

interface Field {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
}

interface SimpleCrudPageProps {
  title: string;
  endpoint: string;
  fields: Field[];
  columns: { key: string; label: string; render?: (val: unknown, row: Record<string, unknown>) => React.ReactNode }[];
}

export function SimpleCrudPage({ title, endpoint, fields, columns }: SimpleCrudPageProps) {
  const { user } = useAuth();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const load = () => api<Record<string, unknown>[]>(endpoint).then(setItems);

  useEffect(() => {
    load();
    const initial: Record<string, string> = {};
    fields.forEach((f) => { initial[f.key] = ''; });
    setForm(initial);
  }, [endpoint]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: Record<string, unknown> = {};
    fields.forEach((f) => {
      const v = form[f.key];
      body[f.key] = f.type === 'number' ? parseFloat(v) || 0 : v;
    });
    await api(endpoint, { method: 'POST', body: JSON.stringify(body) });
    setShowForm(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await api(`${endpoint}/${id}`, { method: 'DELETE' });
    load();
  };

  const canWrite = user && canWriteFinance(user.role);

  return (
    <ProtectedLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        {canWrite && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add
          </button>
        )}
      </div>

      {showForm && canWrite && (
        <form onSubmit={submit} className="card mb-6 grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <label className="label">{f.label}</label>
              {f.type === 'select' && f.options ? (
                <select className="input" value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea className="input" rows={2} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              ) : (
                <input
                  type={f.type || 'text'}
                  className="input"
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              )}
            </div>
          ))}
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
              {canWrite && <th></th>}
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row._id as string}>
                {columns.map((c) => (
                  <td key={c.key}>
                    {c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '—')}
                  </td>
                ))}
                {canWrite && (
                  <td>
                    <button onClick={() => remove(row._id as string)} className="text-xs text-rose-600 hover:underline">
                      Delete
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

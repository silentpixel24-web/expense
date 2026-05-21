'use client';

import { useEffect, useState } from 'react';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { api } from '@/lib/api';
import { format } from 'date-fns';

interface LogItem {
  _id: string;
  action: string;
  entity: string;
  details?: Record<string, unknown>;
  createdAt: string;
  user?: { name: string; email: string; role: string };
  hash: string;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    api<{ items: LogItem[] }>('/activity-logs').then((r) => setLogs(r.items));
  }, []);

  return (
    <ProtectedLayout>
      <h1 className="mb-6 text-2xl font-bold">Activity Logs</h1>
      <p className="mb-4 text-sm text-stone-500">
        Tamper-proof audit trail with cryptographic hash chaining for accountability.
      </p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Details</th>
              <th>Hash</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td className="whitespace-nowrap text-xs">
                  {format(new Date(log.createdAt), 'dd MMM yyyy HH:mm')}
                </td>
                <td>{log.user?.name || '—'}</td>
                <td>
                  <span className="rounded bg-stone-100 px-2 py-0.5 text-xs font-medium">{log.action}</span>
                </td>
                <td>{log.entity}</td>
                <td className="max-w-[200px] truncate text-xs">
                  {log.details ? JSON.stringify(log.details) : '—'}
                </td>
                <td className="font-mono text-[10px] text-stone-400">{log.hash.slice(0, 12)}…</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedLayout>
  );
}

'use client';

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { INCOME_SOURCES, EXPENSE_CATEGORIES } from '@/lib/constants';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const greenPalette = ['#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#166534', '#14532d'];

export function IncomePieChart({ data }: { data: { _id: string; total: number }[] }) {
  if (!data?.length) return <EmptyChart />;
  return (
    <Pie
      data={{
        labels: data.map((d) => INCOME_SOURCES[d._id] || d._id),
        datasets: [{ data: data.map((d) => d.total), backgroundColor: greenPalette }],
      }}
      options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
    />
  );
}

export function ExpensePieChart({ data }: { data: { _id: string; total: number }[] }) {
  if (!data?.length) return <EmptyChart />;
  return (
    <Pie
      data={{
        labels: data.map((d) => EXPENSE_CATEGORIES[d._id] || d._id),
        datasets: [{ data: data.map((d) => d.total), backgroundColor: ['#be123c', '#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3'] }],
      }}
      options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
    />
  );
}

export function TrendLineChart({ data }: { data: { month: string; income: number; expense: number }[] }) {
  if (!data?.length) return <EmptyChart />;
  return (
    <Line
      data={{
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: 'Income',
            data: data.map((d) => d.income),
            borderColor: '#15803d',
            backgroundColor: 'rgba(21, 128, 61, 0.1)',
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Expense',
            data: data.map((d) => d.expense),
            borderColor: '#be123c',
            backgroundColor: 'rgba(190, 18, 60, 0.05)',
            fill: true,
            tension: 0.3,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } },
      }}
    />
  );
}

export function ComparisonBarChart({ data }: { data: { month: string; income: number; expense: number }[] }) {
  if (!data?.length) return <EmptyChart />;
  return (
    <Bar
      data={{
        labels: data.map((d) => d.month),
        datasets: [
          { label: 'Income', data: data.map((d) => d.income), backgroundColor: '#15803d' },
          { label: 'Expense', data: data.map((d) => d.expense), backgroundColor: '#be123c' },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } },
      }}
    />
  );
}

function EmptyChart() {
  return (
    <div className="flex h-48 items-center justify-center text-sm text-stone-400">
      No chart data available
    </div>
  );
}

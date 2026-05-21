const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export async function api<T>(
  endpoint: string,
  options: RequestInit & { formData?: boolean } = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = options.formData
    ? {}
    : { 'Content-Type': 'application/json' };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
    body: options.formData ? (options.body as FormData) : options.body,
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data as T;
}

export const publicApi = {
  summary: (year?: number, month?: number) =>
    api<PublicSummary>(`/public/summary?year=${year ?? ''}&month=${month ?? ''}`),
  notices: () => api<Notice[]>('/public/notices'),
  donationQr: () => api<DonationQr>('/public/donation-qr'),
};

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'admin' | 'treasurer' | 'accountant' | 'viewer';
}

export interface PublicSummary {
  period: { year: number; month: number; label: string };
  totalCollections: number;
  totalExpenditures: number;
  balance: number;
  incomeBySource: { _id: string; total: number }[];
  expenseByCategory: { _id: string; total: number }[];
}

export interface Notice {
  _id: string;
  title: string;
  content: string;
  type: string;
  targetAmount?: number;
  raisedAmount?: number;
  progressPercent?: number;
  createdAt: string;
}

export interface DonationQr {
  upiId: string;
  upiUrl: string;
  qrData: string;
  message: string;
}

export interface DashboardData {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  monthlyIncome: number;
  monthlyExpense: number;
  pendingPayments: number;
  recentTransactions: Record<string, unknown>[];
  incomeBySource: { _id: string; total: number; count: number }[];
  expenseByCategory: { _id: string; total: number; count: number }[];
  monthlyTrend: { month: string; income: number; expense: number }[];
}

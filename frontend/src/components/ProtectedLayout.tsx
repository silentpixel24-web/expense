'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from './Sidebar';

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-mosque-200 border-t-mosque-700" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-50 lg:pl-64">
      <Sidebar />
      <main className="px-4 py-6 pt-16 lg:px-8 lg:pt-8">{children}</main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Landmark } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { appConfig } from '@/lib/config';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@mosque.local');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-mosque-900 to-mosque-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/20">
            <Landmark className="h-8 w-8 text-gold-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Committee Login</h1>
          <p className="mt-1 text-sm text-mosque-200">{appConfig.mosqueName}</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && (
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
          )}
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-center text-xs text-stone-500">
            Demo: admin@mosque.local / admin123
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-mosque-200">
          <Link href="/public" className="text-gold-400 hover:underline">
            View public transparency portal →
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-mosque-300">
          <Link href="/" className="hover:text-white">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

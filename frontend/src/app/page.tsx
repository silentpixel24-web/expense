import Link from 'next/link';
import { Landmark, Shield, BarChart3, Globe } from 'lucide-react';
import { appConfig } from '@/lib/config';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-mosque-950 via-mosque-900 to-mosque-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20">
            <Landmark className="h-7 w-7 text-gold-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{appConfig.mosqueName}</h1>
            <p className="text-sm text-mosque-200">Financial Transparency Platform</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/public" className="btn-secondary border-mosque-600 bg-transparent text-white hover:bg-mosque-800">
            Public Portal
          </Link>
          <Link href="/login" className="btn-primary bg-gold-500 hover:bg-gold-600">
            Committee Login
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="mb-4 font-arabic text-sm font-medium text-gold-400">بسم الله الرحمن الرحيم</p>
        <h2 className="text-4xl font-bold text-white md:text-5xl">
          Transparent Mosque Financial Management
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-mosque-100">
          Record income, track expenses, and share financial reports with your community.
          Built for trust, accountability, and daily mosque administration.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { icon: Shield, title: 'Secure & Audited', desc: 'Role-based access with tamper-proof activity logs' },
            { icon: BarChart3, title: 'Full Analytics', desc: 'Charts, PDF reports, and Excel exports' },
            { icon: Globe, title: 'Public Transparency', desc: 'Community portal for collections and spending' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-mosque-700 bg-mosque-900/50 p-6 text-left">
              <f.icon className="mb-4 h-10 w-10 text-gold-400" />
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-mosque-200">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-4">
          <Link href="/login" className="btn-primary px-8 py-3 text-base">
            Get Started
          </Link>
          <Link href="/public" className="btn-secondary border-mosque-500 px-8 py-3 text-base text-white hover:bg-mosque-800">
            View Public Reports
          </Link>
        </div>
      </main>

      <footer className="border-t border-mosque-800 py-8 text-center text-sm text-mosque-300">
        © {new Date().getFullYear()} {appConfig.mosqueName}
      </footer>
    </div>
  );
}

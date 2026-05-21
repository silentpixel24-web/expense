'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  FileText,
  Globe,
  Megaphone,
  Package,
  Users,
  Calendar,
  Wrench,
  Boxes,
  History,
  Menu,
  X,
  Landmark,
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, key: 'dashboard', roles: ['admin', 'treasurer', 'accountant', 'viewer'] },
  { href: '/income', icon: TrendingUp, key: 'income', roles: ['admin', 'treasurer', 'accountant', 'viewer'] },
  { href: '/expenditure', icon: TrendingDown, key: 'expenditure', roles: ['admin', 'treasurer', 'accountant', 'viewer'] },
  { href: '/reports', icon: FileText, key: 'reports', roles: ['admin', 'treasurer', 'accountant', 'viewer'] },
  { href: '/notices', icon: Megaphone, key: 'notices', roles: ['admin', 'treasurer', 'accountant', 'viewer'] },
  { href: '/assets', icon: Package, key: 'assets', roles: ['admin', 'treasurer', 'accountant'] },
  { href: '/employees', icon: Users, key: 'employees', roles: ['admin', 'treasurer'] },
  { href: '/events', icon: Calendar, key: 'events', roles: ['admin', 'treasurer', 'accountant'] },
  { href: '/maintenance', icon: Wrench, key: 'maintenance', roles: ['admin', 'treasurer', 'accountant'] },
  { href: '/inventory', icon: Boxes, key: 'inventory', roles: ['admin', 'treasurer', 'accountant'] },
  { href: '/activity-logs', icon: History, key: 'activityLogs', roles: ['admin'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t, locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);

  const filtered = navItems.filter((item) => user && item.roles.includes(user.role));

  const content = (
    <>
      <div className="flex items-center gap-3 border-b border-mosque-800 px-4 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/20">
          <Landmark className="h-6 w-6 text-gold-400" />
        </div>
        <div>
          <p className="font-semibold text-white">{t('appName')}</p>
          <p className="text-xs text-mosque-300">{t('tagline')}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {filtered.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                active ? 'bg-mosque-700 text-white' : 'text-mosque-100 hover:bg-mosque-800'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {t(item.key)}
            </Link>
          );
        })}
        <Link
          href="/public"
          className={clsx(
            'mt-4 flex items-center gap-3 rounded-lg border border-mosque-600 px-3 py-2.5 text-sm font-medium text-gold-400 transition hover:bg-mosque-800'
          )}
        >
          <Globe className="h-5 w-5" />
          {t('publicPortal')}
        </Link>
      </nav>

      <div className="border-t border-mosque-800 p-4">
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as 'en' | 'ta' | 'ar')}
          className="mb-3 w-full rounded-lg border border-mosque-600 bg-mosque-900 px-2 py-1.5 text-sm text-white"
        >
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
          <option value="ar">العربية</option>
        </select>
        <p className="truncate text-sm font-medium text-white">{user?.name}</p>
        <p className="truncate text-xs capitalize text-mosque-300">{user?.role}</p>
        <button onClick={logout} className="mt-3 w-full rounded-lg bg-mosque-700 py-2 text-sm text-white hover:bg-mosque-600">
          {t('logout')}
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-mosque-800 p-2 text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-mosque-950 transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-4 text-white lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
        {content}
      </aside>
    </>
  );
}

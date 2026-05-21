'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Locale, t as translate } from '@/lib/i18n';
import { appConfig, getMosqueName } from '@/lib/config';

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
} | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(appConfig.defaultLocale);
  const t = (key: string) => {
    if (key === 'appName') return getMosqueName(locale);
    return translate(locale, key);
  };
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

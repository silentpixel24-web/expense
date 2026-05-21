import { appConfig } from './config';

export const INCOME_SOURCES: Record<string, string> = {
  friday_collection: 'Friday Collection',
  donation_box: 'Donation Box',
  online_donation: 'Online Donation',
  zakat: 'Zakat',
  sadaqah: 'Sadaqah',
  building_fund: 'Building Fund',
  event_contribution: 'Event Contribution',
  monthly_member: 'Monthly Member',
  ramadan_collection: 'Ramadan Collection',
  other: 'Other',
};

export const EXPENSE_CATEGORIES: Record<string, string> = {
  electricity: 'Electricity',
  water: 'Water',
  imam_salary: 'Imam Salary',
  muazzin_salary: 'Muazzin Salary',
  maintenance: 'Maintenance',
  cleaning: 'Cleaning',
  construction: 'Construction',
  charity: 'Charity Distribution',
  event: 'Event Expenses',
  food: 'Food',
  education: 'Educational Activities',
  other: 'Other',
};

export const ROLES: Record<string, string> = {
  admin: 'Admin',
  treasurer: 'Treasurer',
  accountant: 'Accountant',
  viewer: 'Viewer',
};

const CURRENCY_LOCALES: Record<string, string> = {
  INR: 'en-IN',
  USD: 'en-US',
  GBP: 'en-GB',
  AED: 'ar-AE',
  SAR: 'ar-SA',
  MYR: 'ms-MY',
};

export function formatCurrency(amount: number, locale?: string) {
  const currency = appConfig.currency;
  const fmtLocale = locale || CURRENCY_LOCALES[currency] || 'en-IN';
  return new Intl.NumberFormat(fmtLocale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function canWriteFinance(role: string) {
  return ['admin', 'treasurer', 'accountant'].includes(role);
}

export function canApprove(role: string) {
  return ['admin', 'treasurer'].includes(role);
}

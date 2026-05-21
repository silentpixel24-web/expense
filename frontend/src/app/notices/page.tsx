'use client';

import { SimpleCrudPage } from '@/components/SimpleCrudPage';
import { formatCurrency } from '@/lib/constants';

export default function NoticesPage() {
  return (
    <SimpleCrudPage
      title="Notice Board"
      endpoint="/notices"
      fields={[
        { key: 'title', label: 'Title' },
        { key: 'content', label: 'Content', type: 'textarea' },
        {
          key: 'type',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'general', label: 'General' },
            { value: 'financial_summary', label: 'Financial Summary' },
            { value: 'project', label: 'Project' },
            { value: 'fundraising', label: 'Fundraising' },
            { value: 'donation_need', label: 'Donation Need' },
            { value: 'construction', label: 'Construction' },
          ],
        },
        { key: 'targetAmount', label: 'Target Amount', type: 'number' },
        { key: 'raisedAmount', label: 'Raised Amount', type: 'number' },
        { key: 'progressPercent', label: 'Progress %', type: 'number' },
      ]}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'type', label: 'Type' },
        {
          key: 'targetAmount',
          label: 'Target',
          render: (v) => (v ? formatCurrency(v as number) : '—'),
        },
        { key: 'progressPercent', label: 'Progress', render: (v) => `${v ?? 0}%` },
      ]}
    />
  );
}

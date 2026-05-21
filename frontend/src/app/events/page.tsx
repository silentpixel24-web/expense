'use client';

import { SimpleCrudPage } from '@/components/SimpleCrudPage';
import { formatCurrency } from '@/lib/constants';
import { format } from 'date-fns';

export default function EventsPage() {
  return (
    <SimpleCrudPage
      title="Event Management"
      endpoint="/events"
      fields={[
        { key: 'title', label: 'Event Title' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'eventDate', label: 'Date', type: 'date' },
        { key: 'budget', label: 'Budget', type: 'number' },
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'planned', label: 'Planned' },
            { value: 'ongoing', label: 'Ongoing' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ],
        },
      ]}
      columns={[
        { key: 'title', label: 'Title' },
        {
          key: 'eventDate',
          label: 'Date',
          render: (v) => (v ? format(new Date(v as string), 'dd MMM yyyy') : '—'),
        },
        { key: 'budget', label: 'Budget', render: (v) => formatCurrency((v as number) || 0) },
        { key: 'status', label: 'Status' },
      ]}
    />
  );
}

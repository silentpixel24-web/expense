'use client';

import { SimpleCrudPage } from '@/components/SimpleCrudPage';
import { formatCurrency } from '@/lib/constants';

export default function MaintenancePage() {
  return (
    <SimpleCrudPage
      title="Prayer Hall Maintenance"
      endpoint="/maintenance"
      fields={[
        { key: 'area', label: 'Area' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'cost', label: 'Cost', type: 'number' },
        { key: 'performedBy', label: 'Performed By' },
        { key: 'nextDueDate', label: 'Next Due', type: 'date' },
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'completed', label: 'Completed' },
            { value: 'overdue', label: 'Overdue' },
          ],
        },
      ]}
      columns={[
        { key: 'area', label: 'Area' },
        { key: 'description', label: 'Work Done' },
        { key: 'cost', label: 'Cost', render: (v) => formatCurrency((v as number) || 0) },
        { key: 'status', label: 'Status' },
      ]}
    />
  );
}

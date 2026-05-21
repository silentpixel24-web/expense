'use client';

import { SimpleCrudPage } from '@/components/SimpleCrudPage';
import { formatCurrency } from '@/lib/constants';

export default function EmployeesPage() {
  return (
    <SimpleCrudPage
      title="Employee Management"
      endpoint="/employees"
      fields={[
        { key: 'name', label: 'Name' },
        {
          key: 'role',
          label: 'Role',
          type: 'select',
          options: [
            { value: 'imam', label: 'Imam' },
            { value: 'muazzin', label: 'Muazzin' },
            { value: 'caretaker', label: 'Caretaker' },
            { value: 'admin_staff', label: 'Admin Staff' },
            { value: 'other', label: 'Other' },
          ],
        },
        { key: 'phone', label: 'Phone' },
        { key: 'salary', label: 'Monthly Salary', type: 'number' },
        { key: 'joinDate', label: 'Join Date', type: 'date' },
      ]}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        { key: 'salary', label: 'Salary', render: (v) => formatCurrency((v as number) || 0) },
        { key: 'phone', label: 'Phone' },
      ]}
    />
  );
}

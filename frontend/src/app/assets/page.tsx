'use client';

import { SimpleCrudPage } from '@/components/SimpleCrudPage';
import { formatCurrency } from '@/lib/constants';

export default function AssetsPage() {
  return (
    <SimpleCrudPage
      title="Asset Management"
      endpoint="/assets"
      fields={[
        { key: 'name', label: 'Asset Name' },
        {
          key: 'category',
          label: 'Category',
          type: 'select',
          options: [
            { value: 'furniture', label: 'Furniture' },
            { value: 'equipment', label: 'Equipment' },
            { value: 'building', label: 'Building' },
            { value: 'vehicle', label: 'Vehicle' },
            { value: 'other', label: 'Other' },
          ],
        },
        { key: 'purchaseValue', label: 'Purchase Value', type: 'number' },
        { key: 'currentValue', label: 'Current Value', type: 'number' },
        {
          key: 'condition',
          label: 'Condition',
          type: 'select',
          options: [
            { value: 'excellent', label: 'Excellent' },
            { value: 'good', label: 'Good' },
            { value: 'fair', label: 'Fair' },
            { value: 'poor', label: 'Poor' },
          ],
        },
        { key: 'location', label: 'Location' },
      ]}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'currentValue', label: 'Value', render: (v) => formatCurrency((v as number) || 0) },
        { key: 'condition', label: 'Condition' },
      ]}
    />
  );
}

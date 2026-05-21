'use client';

import { SimpleCrudPage } from '@/components/SimpleCrudPage';

export default function InventoryPage() {
  return (
    <SimpleCrudPage
      title="Inventory Tracking"
      endpoint="/inventory"
      fields={[
        { key: 'itemName', label: 'Item Name' },
        { key: 'category', label: 'Category' },
        { key: 'quantity', label: 'Quantity', type: 'number' },
        { key: 'unit', label: 'Unit' },
        { key: 'minStock', label: 'Min Stock', type: 'number' },
      ]}
      columns={[
        { key: 'itemName', label: 'Item' },
        { key: 'quantity', label: 'Qty' },
        { key: 'unit', label: 'Unit' },
        {
          key: 'minStock',
          label: 'Stock Status',
          render: (_, row) => {
            const qty = (row.quantity as number) || 0;
            const min = (row.minStock as number) || 0;
            return qty <= min ? (
              <span className="text-amber-600 font-medium">Low</span>
            ) : (
              <span className="text-emerald-600">OK</span>
            );
          },
        },
      ]}
    />
  );
}

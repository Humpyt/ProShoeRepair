import React from 'react';
import { ShoppingBag, DollarSign, Tag } from 'lucide-react';

export default function SalesItemsPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Sales Items</h1>
          <p className="text-gray-400">Manage retail items and pricing</p>
        </div>
        <button className="btn-bevel accent-primary px-6 py-3 rounded-lg flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Add Item
        </button>
      </div>

      <div className="card-bevel p-6">
        <h2 className="text-lg font-semibold mb-4 text-indigo-400">Available Items</h2>
        {/* Add your sales items content here */}
      </div>
    </div>
  );
}
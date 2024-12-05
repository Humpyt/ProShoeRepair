import { useState } from 'react';
import { X, ArrowUp, ArrowDown } from 'lucide-react';
import type { StockItem } from '../types';

interface StockTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemId: string, quantity: number, type: 'in' | 'out') => void;
  item: StockItem | null;
}

export function StockTransactionModal({ isOpen, onClose, onSave, item }: StockTransactionModalProps) {
  const [formData, setFormData] = useState({
    type: 'in',
    quantity: '',
    reason: 'restock',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      onSave(
        item.id,
        parseInt(formData.quantity),
        formData.type as 'in' | 'out'
      );
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Stock Quantity</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500">Current quantity: {item.quantity} {item.unit}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <button
              type="button"
              className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-md ${
                formData.type === 'in'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 bg-white text-gray-700'
              }`}
              onClick={() => setFormData({ ...formData, type: 'in' })}
            >
              <ArrowDown className="h-5 w-5 mr-2" />
              Stock In
            </button>
            <button
              type="button"
              className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-md ${
                formData.type === 'out'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 bg-white text-gray-700'
              }`}
              onClick={() => setFormData({ ...formData, type: 'out' })}
            >
              <ArrowUp className="h-5 w-5 mr-2" />
              Stock Out
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity ({item.unit})
            </label>
            <input
              type="number"
              required
              min="1"
              max={formData.type === 'out' ? item.quantity : undefined}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            >
              <option value="restock">Restock</option>
              <option value="used">Used in Repair</option>
              <option value="damaged">Damaged/Expired</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StockTransactionModal;
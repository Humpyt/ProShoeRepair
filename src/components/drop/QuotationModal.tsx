import React, { useState } from 'react';
import { X, Calculator, Clock } from 'lucide-react';
import type { DropItem, Quotation } from '../../types/drop';
import { formatCurrency } from '../../utils/formatCurrency';

interface QuotationModalProps {
  items: DropItem[];
  customerId: string;
  onSave: (quotation: Omit<Quotation, 'id'>) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function QuotationModal({ items, customerId, onSave, onClose, isOpen }: QuotationModalProps) {
  const [validityDays, setValidityDays] = useState(7);
  const estimatedTotal = items.reduce((total, item) => total + calculateItemTotal(item), 0);

  function calculateItemTotal(item: DropItem): number {
    // This is a placeholder - implement actual pricing logic
    return 50000; // Example fixed price
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validityDays);

    const quotation: Omit<Quotation, 'id'> = {
      customerId,
      items,
      estimatedTotal,
      validUntil: validUntil.toISOString(),
      status: 'pending'
    };

    onSave(quotation);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Quotation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Items Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Item {index + 1}:</span>
                    <span className="ml-2 text-gray-600">{item.type}</span>
                    {item.brand && <span className="ml-2 text-gray-500">({item.brand})</span>}
                  </div>
                  <span className="font-medium">{formatCurrency(calculateItemTotal(item))}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center font-medium text-lg">
                  <span>Total Estimate</span>
                  <span>{formatCurrency(estimatedTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Validity Period (Days)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="1"
                max="30"
                value={validityDays}
                onChange={(e) => setValidityDays(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-gray-700 font-medium w-16">{validityDays} days</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">Quotation Validity</p>
                <p>This quote will be valid until {new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
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
              <Calculator className="h-4 w-4 mr-2" />
              Generate Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

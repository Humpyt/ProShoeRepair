import React from 'react';
import { X } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  // Build line 2: compressed comma-separated values
  const line2Parts: string[] = [item.color, item.brand, item.material];
  if (item.shortDescription.trim()) {
    line2Parts.push(item.shortDescription);
  }
  line2Parts.push(...item.memos);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 relative group">
      <button
        onClick={() => onRemove(item.id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Remove item"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Line 1: Category */}
      <div className="font-medium text-gray-900 pr-6">
        {item.category}
      </div>

      {/* Line 2: Compressed values */}
      <div className="text-sm text-gray-600 mt-0.5">
        {line2Parts.join(', ')}
      </div>

      {/* Service lines */}
      {item.services.map((svc, idx) => (
        <div key={idx} className="text-sm text-gray-800 mt-1">
          {svc.service} - {svc.variation}
        </div>
      ))}

      {/* Separator */}
      <div className="border-t border-gray-300 my-2" />

      {/* Price */}
      <div className="text-gray-900 font-semibold">
        {formatCurrency(item.price)}
      </div>
    </div>
  );
};

export default CartItem;

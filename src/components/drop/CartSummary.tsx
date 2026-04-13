import React from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import CartItem from './CartItem';
import { formatCurrency } from '../../utils/formatCurrency';

interface CartSummaryProps {
  items: CartItemType[];
  ticketNumber: string;
  onRemoveItem: (id: string) => void;
  onComplete: () => void;
  disabled?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  ticketNumber,
  onRemoveItem,
  onComplete,
  disabled = false,
}) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.length;
  const isDisabled = disabled || itemCount === 0;

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <ShoppingCart className="w-5 h-5 text-gray-600" />
        <span className="font-semibold text-gray-900">
          CART ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
      </div>

      {/* Ticket number */}
      <div className="text-sm text-gray-500 mb-3">
        Ticket: {ticketNumber}
      </div>

      {/* Items list */}
      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-4">
            No items in cart
          </div>
        ) : (
          items.map((item) => (
            <CartItem key={item.id} item={item} onRemove={onRemoveItem} />
          ))
        )}
      </div>

      {/* Total */}
      <div className="border-t border-gray-300 pt-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Complete button */}
      <button
        onClick={onComplete}
        disabled={isDisabled}
        className={`
          w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold
          transition-colors
          ${isDisabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
          }
        `}
      >
        <Check className="w-5 h-5" />
        COMPLETE DROP
      </button>
    </div>
  );
};

export default CartSummary;

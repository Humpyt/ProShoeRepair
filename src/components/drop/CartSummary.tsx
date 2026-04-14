import React from 'react';
import { ShoppingCart, Check, Package, Sparkles } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import CartItemCard from './CartItemCard';
import { formatCurrency } from '../../utils/formatCurrency';

interface CartSummaryProps {
  items: CartItemType[];
  ticketNumber: string;
  onRemoveItem: (id: string) => void;
  onComplete: () => void;
  disabled?: boolean;
  previewItem?: CartItemType | null;
  onPriceChange?: (price: number) => void;
  onDone?: (item: CartItemType) => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  ticketNumber,
  onRemoveItem,
  onComplete,
  disabled = false,
  previewItem = null,
  onPriceChange,
  onDone,
}) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.length;
  const isDisabled = disabled || itemCount === 0;

  return (
    <div className="bg-white rounded-none shadow-xl border-l border-gray-100 h-full flex flex-col w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-6 py-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xl">Drop Cart</h3>
              <p className="text-slate-400 text-sm">Ticket: {ticketNumber}</p>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl">
            <span className="text-white font-bold text-2xl">{itemCount}</span>
            <span className="text-slate-400 text-sm ml-2">items</span>
          </div>
        </div>
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Preview item */}
        {previewItem && (
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-indigo-200 overflow-hidden">
            <div className="px-4 py-3 bg-indigo-100/50 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-indigo-700 font-semibold text-sm">Now Building</span>
            </div>
            <div className="p-4">
              <CartItemCard
                item={previewItem}
                onEdit={() => {}}
                onRemove={() => {}}
              />
              <div className="mt-4 pt-4 border-t border-indigo-200">
                <label className="text-xs text-indigo-600 font-semibold mb-2 block">Set Price (UGX)</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="0"
                      value={previewItem.price || ''}
                      onChange={(e) => onPriceChange?.(parseInt(e.target.value, 10) || 0)}
                      className="w-full pl-4 pr-16 py-4 bg-white rounded-xl text-gray-800 font-bold text-xl placeholder-gray-300 border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">UGX</span>
                  </div>
                  <button
                    onClick={() => previewItem && onDone?.(previewItem)}
                    disabled={!previewItem.price || previewItem.price === 0}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-lg"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items section */}
        {items.length > 0 && (
          <div>
            <h4 className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-4">Items</h4>
            <div className="space-y-4">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onEdit={() => {}}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 && !previewItem && (
          <div className="py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium text-lg">No items yet</p>
            <p className="text-gray-300 text-sm mt-1">Add items from the form</p>
          </div>
        )}
      </div>

      {/* Footer - totals and action */}
      <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-400">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between items-center bg-gradient-to-r from-emerald-50 to-green-50 px-5 py-4 rounded-xl">
            <span className="text-gray-800 font-bold text-lg">Total</span>
            <span className="text-emerald-600 font-extrabold text-3xl">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
        <button
          onClick={onComplete}
          disabled={isDisabled}
          className={`
            w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg
            ${isDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 active:scale-[0.98] hover:shadow-xl'
            }
          `}
        >
          <Check className="w-6 h-6" />
          COMPLETE DROP
        </button>
      </div>
    </div>
  );
};

export default CartSummary;

import React, { useState } from 'react';
import { ShoppingCart, Check, Package, Sparkles, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface CartSummaryProps {
  items: CartItemType[];
  ticketNumber: string;
  onRemoveItem: (id: string) => void;
  onUpdateItemPrice: (id: string, price: number) => void;
  onComplete: () => void;
  disabled?: boolean;
  previewItem?: CartItemType | null;
  onPriceChange?: (price: number) => void;
  onDone?: (item: CartItemType) => void;
}

interface CartItemRowProps {
  item: CartItemType;
  index: number;
  onRemove: (id: string) => void;
  onUpdatePrice: (id: string, price: number) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, index, onRemove, onUpdatePrice }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(item.price.toString());

  const handlePriceClick = () => {
    setEditPrice(item.price.toString());
    setIsEditing(true);
  };

  const handlePriceBlur = () => {
    const newPrice = parseInt(editPrice, 10);
    if (!isNaN(newPrice) && newPrice >= 0) {
      onUpdatePrice(item.id, newPrice);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePriceBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditPrice(item.price.toString());
    }
  };

  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
      {/* Left: Icon */}
      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
        {item.photoUrl ? (
          <img src={item.photoUrl} alt="" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <Package className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Center: Category, details, service */}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-gray-800 text-sm truncate">{item.category}</div>
        <div className="text-gray-500 text-xs truncate">{item.details || item.description}</div>
        {item.service && <div className="text-indigo-600 text-xs mt-0.5 truncate">{item.service}</div>}
      </div>

      {/* Right: Index, editable price, delete */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-gray-300 text-xs font-medium">#{index + 1}</span>

        {isEditing ? (
          <input
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            onBlur={handlePriceBlur}
            onKeyDown={handleKeyDown}
            className="w-24 px-2 py-1 text-sm font-bold text-right border-2 border-indigo-400 rounded-lg focus:outline-none focus:border-indigo-600"
            autoFocus
          />
        ) : (
          <button
            onClick={handlePriceClick}
            className="px-3 py-1 font-bold text-gray-800 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors min-w-[80px] text-right"
          >
            {formatCurrency(item.price)}
          </button>
        )}

        <button
          onClick={() => onRemove(item.id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  ticketNumber,
  onRemoveItem,
  onUpdateItemPrice,
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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Drop Cart</h3>
              <p className="text-slate-400 text-xs">Ticket: {ticketNumber}</p>
            </div>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-lg">
            <span className="text-white font-bold text-lg">{itemCount}</span>
            <span className="text-slate-400 text-xs ml-1">items</span>
          </div>
        </div>
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Preview item */}
        {previewItem && (
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-indigo-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-indigo-600 font-semibold text-sm">Now Building</span>
            </div>
            <div className="bg-white rounded-xl p-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {previewItem.photoUrl ? (
                    <img src={previewItem.photoUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Package className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 text-sm truncate">{previewItem.category}</div>
                  <div className="text-gray-500 text-xs truncate">{previewItem.details || previewItem.description}</div>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-indigo-200">
              <label className="text-xs text-indigo-600 font-medium mb-1.5 block">Set Price (UGX)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="0"
                    value={previewItem.price || ''}
                    onChange={(e) => onPriceChange?.(parseInt(e.target.value, 10) || 0)}
                    className="w-full pl-4 pr-16 py-3 bg-white rounded-xl text-gray-800 font-bold text-lg placeholder-gray-300 border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">UGX</span>
                </div>
                <button
                  onClick={() => previewItem && onDone?.(previewItem)}
                  disabled={!previewItem.price || previewItem.price === 0}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Items section */}
        {items.length > 0 && (
          <div>
            <h4 className="text-gray-500 font-semibold text-xs uppercase mb-2">Items</h4>
            <div className="space-y-2">
              {items.map((item, index) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  onRemove={onRemoveItem}
                  onUpdatePrice={onUpdateItemPrice}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 && !previewItem && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">No items yet</p>
            <p className="text-gray-300 text-xs mt-1">Add items from the form</p>
          </div>
        )}
      </div>

      {/* Footer - totals and action */}
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Subtotal</span>
            <span className="text-gray-400 text-sm">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between items-center bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-3 rounded-xl">
            <span className="text-gray-800 font-bold">Total</span>
            <span className="text-emerald-600 font-extrabold text-2xl">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
        <button
          onClick={onComplete}
          disabled={isDisabled}
          className={`
            w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-md
            ${isDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 active:scale-[0.98] shadow-lg hover:shadow-xl'
            }
          `}
        >
          <Check className="w-5 h-5" />
          COMPLETE DROP
        </button>
      </div>
    </div>
  );
};

export default CartSummary;

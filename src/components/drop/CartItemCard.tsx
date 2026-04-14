import React from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';

interface CartItemCardProps {
  item: CartItem;
  onEdit: (item: CartItem) => void;
  onRemove: (id: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Women's High Heel": '👠',
  "Women's Flat": '🥿',
  "Women's Dress Boot": '👢',
  "Women's Sneaker": '👟',
  "Men's Dress": '👞',
  "Men's Half Boot": '🥾',
  "Men's Sneaker": '👟',
  "Men's Work": '🥾',
  "Men's Western": '👢',
  "Men's Riding": '🥾',
  "Bag": '👜',
  "Other": '🔧',
};

export const CartItemCard: React.FC<CartItemCardProps> = ({ item, onEdit, onRemove }) => {
  const icon = CATEGORY_ICONS[item.category] || '📦';
  const details = [item.color, item.brand, item.material].filter(Boolean).join(' • ');

  return (
    <div
      onClick={() => onEdit(item)}
      className="bg-white rounded-xl p-3 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all border border-gray-200 group"
    >
      {/* Header with icon */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
          className="p-1.5 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
        </button>
      </div>

      {/* Category */}
      <div className="font-bold text-gray-800 text-sm mb-1 leading-tight">
        {item.category}
      </div>

      {/* Details */}
      {details && (
        <div className="text-xs text-gray-500 mb-2 leading-tight">
          {details}
        </div>
      )}

      {/* Memos preview */}
      {item.memos.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {item.memos.slice(0, 2).map((memo, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-full">
              {memo}
            </span>
          ))}
          {item.memos.length > 2 && (
            <span className="text-[10px] text-gray-400">+{item.memos.length - 2}</span>
          )}
        </div>
      )}

      {/* Separator */}
      <div className="border-t border-gray-100 my-2" />

      {/* Price */}
      <div className="flex items-center justify-between">
        <span className="text-emerald-600 font-bold text-sm">
          {formatCurrency(item.price)}
        </span>
      </div>
    </div>
  );
};

export default CartItemCard;

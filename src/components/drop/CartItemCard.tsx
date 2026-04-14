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

  return (
    <div
      onClick={() => onEdit(item)}
      className="bg-white rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all border border-gray-200 group overflow-hidden"
    >
      <div className="p-4">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <div>
              <div className="font-bold text-gray-800 text-base">{item.category}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold text-lg">{formatCurrency(item.price)}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
              className="p-2 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1.5 text-sm">
          {item.color && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-16">Color:</span>
              <span className="text-gray-700">{item.color}</span>
            </div>
          )}
          {item.brand && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-16">Brand:</span>
              <span className="text-gray-700">{item.brand}</span>
            </div>
          )}
          {item.material && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 w-16">Material:</span>
              <span className="text-gray-700">{item.material}</span>
            </div>
          )}
          {item.shortDescription && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="text-gray-400 text-xs mb-1">Description</div>
              <div className="text-gray-700 italic">{item.shortDescription}</div>
            </div>
          )}
        </div>

        {/* Memos */}
        {item.memos.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.memos.map((memo, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                {memo}
              </span>
            ))}
          </div>
        )}

        {/* Services */}
        {item.services.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
            {item.services.map((svc, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-gray-700">{svc.service}</span>
                {svc.variation && <span className="text-gray-400">• {svc.variation}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItemCard;

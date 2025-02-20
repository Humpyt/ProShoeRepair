import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faBarcode,
  faSort,
  faArrowUp,
  faArrowDown,
  faEye,
  faShoppingCart
} from '@fortawesome/free-solid-svg-icons';

interface SaleItem {
  id: string;
  name: string;
  category: string;
  type: 'product' | 'service';
  price: number;
  stock?: number;
  description: string;
}

interface SaleItemListProps {
  items: SaleItem[];
  selectedItems: string[];
  sortField: keyof SaleItem;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof SaleItem) => void;
  onSelect: (id: string) => void;
  onEdit: (item: SaleItem) => void;
  onDelete: (id: string) => void;
  onAddToCart: (item: SaleItem) => void;
  onViewAnalytics: (id: string) => void;
}

export default function SaleItemList({
  items,
  selectedItems,
  sortField,
  sortDirection,
  onSort,
  onSelect,
  onEdit,
  onDelete,
  onAddToCart,
  onViewAnalytics
}: SaleItemListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="aspect-w-1 aspect-h-1 bg-gray-700">
            {/* Placeholder for item image */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <FontAwesomeIcon icon={faBarcode} size="3x" />
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-white font-medium text-lg mb-1">{item.name}</h3>
            <p className="text-green-500 font-bold text-xl mb-2">
              ${item.price.toFixed(2)}
            </p>
            
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded-full text-xs ${
                item.type === 'product'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-green-500/20 text-green-400'
              }`}>
                {item.type}
              </span>
              
              {item.type === 'product' && (
                <span className={`px-2 py-1 rounded-full text-xs ${
                  (item.stock || 0) > 10
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  Stock: {item.stock || 0}
                </span>
              )}
            </div>
            
            <button
              onClick={() => onAddToCart(item)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center space-x-2"
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

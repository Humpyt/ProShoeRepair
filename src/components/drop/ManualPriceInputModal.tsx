import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { type RetailProduct } from '../contexts/RetailProductContext';

interface ManualPriceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: RetailProduct | null;
  onAddToCart: (price: number, quantity: number) => void;
}

const ManualPriceInputModal: React.FC<ManualPriceInputModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
}) => {
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (isOpen && product) {
      setPrice(product.default_price);
      setQuantity(1);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setPrice(numericValue ? parseInt(numericValue, 10) : 0);
  };

  const handleQuantityChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const qty = numericValue ? parseInt(numericValue, 10) : 1;
    setQuantity(Math.max(1, qty));
  };

  const adjustPriceByPercentage = (percentage: number) => {
    const defaultPrice = product?.default_price || 0;
    const adjustment = defaultPrice * (percentage / 100);
    setPrice(Math.max(0, defaultPrice + adjustment));
  };

  const total = price * quantity;

  const handleAddToCart = () => {
    onAddToCart(price, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 border-t-4 border-t-amber-500">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500 bg-opacity-20 rounded-lg">
              <span className="text-xl">{product.icon || '📦'}</span>
            </div>
            <h2 className="text-xl font-semibold text-white">{product.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Default Price Reference */}
        <div className="bg-gray-700 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Default Price</span>
            <span className="text-gray-300 font-medium">
              {formatCurrency(product.default_price)}
            </span>
          </div>
        </div>

        {/* Manual Price Input */}
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">Custom Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-white text-lg font-medium"
          />
        </div>

        {/* Quick Adjustment Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button
            onClick={() => adjustPriceByPercentage(-10)}
            className="py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-red-400 transition-colors"
          >
            -10%
          </button>
          <button
            onClick={() => adjustPriceByPercentage(-20)}
            className="py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-red-400 transition-colors"
          >
            -20%
          </button>
          <button
            onClick={() => adjustPriceByPercentage(10)}
            className="py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-green-400 transition-colors"
          >
            +10%
          </button>
          <button
            onClick={() => adjustPriceByPercentage(20)}
            className="py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-green-400 transition-colors"
          >
            +20%
          </button>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-2">Quantity</label>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setQuantity(num)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    quantity === num
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="w-20 px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-white text-center"
            />
          </div>
        </div>

        {/* Total Price Display */}
        <div className="bg-amber-500 bg-opacity-10 border border-amber-500 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">Total</span>
            <span className="text-2xl font-bold text-amber-400">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-600 rounded-lg text-white font-medium transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualPriceInputModal;

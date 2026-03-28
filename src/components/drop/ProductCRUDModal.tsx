import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { RetailProduct } from '../contexts/RetailProductContext';

interface ProductCRUDModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: RetailProduct | null;
  onSave: (product: {
    name: string;
    category: string;
    description: string;
    default_price: number;
    icon: string;
  }) => void;
  onDelete?: () => void;
}

interface ProductFormData {
  name: string;
  category: string;
  description: string;
  default_price: number;
  icon: string;
  image_url: string;
}

const ProductCRUDModal: React.FC<ProductCRUDModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
  onDelete,
}) => {
  const isEditMode = product !== null;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    description: '',
    default_price: 0,
    icon: '',
    image_url: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Populate form when product changes (edit mode)
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && product) {
        setFormData({
          name: product.name || '',
          category: product.category || '',
          description: product.description || '',
          default_price: product.default_price || 0,
          icon: product.icon || '',
          image_url: product.image_url || '',
        });
      } else {
        setFormData({
          name: '',
          category: '',
          description: '',
          default_price: 0,
          icon: '',
          image_url: '',
        });
      }
    }
  }, [isOpen, isEditMode, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }

    if (formData.default_price < 0) {
      alert('Price must be 0 or greater');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      onDelete();
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">
            {isEditMode ? 'Edit Product' : 'Add Product'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Leather Polish"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., Polish, Accessories"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Optional description"
              rows={3}
            />
          </div>

          {/* Default Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Default Price (UGX) *
            </label>
            <input
              type="number"
              value={formData.default_price}
              onChange={(e) => handleInputChange('default_price', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., 15000"
              min="0"
              required
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Icon (emoji)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => handleInputChange('icon', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., 🧴"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Image URL
            </label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="https://example.com/image.png"
            />
            <p className="text-xs text-gray-400 mt-1">Enter a URL to product image</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            {isEditMode && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={isLoading}
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors
                disabled:bg-gray-600 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCRUDModal;

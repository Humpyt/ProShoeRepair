import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface SaleItem {
  id: string;
  name: string;
  category: string;
  type: 'product' | 'service';
  price: number;
  stock?: number;
  description: string;
}

interface EditItemModalProps {
  item: SaleItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: SaleItem) => void;
}

const categories = [
  'Shoe Repair',
  'Cleaning',
  'Accessories',
  'Custom Work',
  'Maintenance',
  'Other'
];

export default function EditItemModal({
  item,
  isOpen,
  onClose,
  onSave
}: EditItemModalProps) {
  const [formData, setFormData] = useState<SaleItem>({
    id: '',
    name: '',
    category: categories[0],
    type: 'product',
    price: 0,
    stock: 0,
    description: ''
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        id: '',
        name: '',
        category: categories[0],
        type: 'product',
        price: 0,
        stock: 0,
        description: ''
      });
    }
  }, [item]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {item ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-400 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-gray-400 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'product' | 'service' })}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
              >
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-400 mb-2">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full bg-gray-800 text-white pl-8 pr-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Stock (only for products) */}
            {formData.type === 'product' && (
              <div>
                <label className="block text-gray-400 mb-2">Stock</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-400 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none h-32 resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            >
              {item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

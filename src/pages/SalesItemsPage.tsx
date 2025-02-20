import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Tag, Search, Edit2, Trash2, Package } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { TextField, Select, MenuItem, InputAdornment } from '@mui/material';
import { formatCurrency } from '../utils/formatCurrency';

interface SalesItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface Category {
  id: string;
  name: string;
}

export default function SalesItemsPage() {
  const [items, setItems] = useState<SalesItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SalesItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    image_url: ''
  });

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/supplies');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/supplies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          image_url: formData.image_url || null
        })
      });
      if (response.ok) {
        setIsAddModalOpen(false);
        fetchItems();
        resetForm();
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const response = await fetch(`/api/supplies/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          image_url: formData.image_url
        })
      });
      if (response.ok) {
        setIsEditModalOpen(false);
        fetchItems();
        resetForm();
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/supplies/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
      image_url: ''
    });
    setSelectedItem(null);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openEditModal = (item: SalesItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
      image_url: item.image_url || ''
    });
    setIsEditModalOpen(true);
  };

  const totalValue = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = filteredItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Items List */}
        <div className="col-span-8 space-y-6">
          {/* Search and Stats */}
          <div className="card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items by name..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-700/50 rounded-xl border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-6 ml-6">
                <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-3">
                  <Package className="h-5 w-5 text-indigo-400" />
                  <span className="text-gray-300 font-medium">{totalItems}</span>
                </div>
                <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-3">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300 font-medium">{formatCurrency(totalValue)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="min-w-[200px] bg-gray-800/50"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-bevel accent-primary px-6 py-3 rounded-lg flex items-center"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add Item
              </button>
            </div>
          </div>

          {/* Items Table */}
          <div className="card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              <table className="w-full">
                <thead className="bg-gray-800/80 backdrop-blur-sm sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Item</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Category</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Stock</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Price</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="group hover:bg-gray-800/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {item.image_url && (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="h-10 w-10 rounded object-cover mr-3"
                            />
                          )}
                          <div className="text-sm font-medium text-gray-200">{item.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                          {categories.find(c => c.id === item.category)?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-sm font-medium ${
                          item.quantity > 10 ? 'text-green-400' : 
                          item.quantity > 5 ? 'text-yellow-400' : 
                          'text-red-400'
                        }`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-200">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 rounded-lg hover:bg-gray-700"
                          >
                            <Edit2 className="h-4 w-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 rounded-lg hover:bg-gray-700"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel - Category Overview */}
        <div className="col-span-4 space-y-6">
          <div className="card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900">
            <h2 className="text-xl font-semibold text-gray-200 mb-6">Category Overview</h2>
            <div className="space-y-4">
              {categories.map(category => {
                const categoryItems = items.filter(item => item.category === category.id);
                const categoryValue = categoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const itemCount = categoryItems.reduce((sum, item) => sum + item.quantity, 0);
                
                return (
                  <div
                    key={category.id}
                    className="bg-gray-800/50 p-4 rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">{category.name}</span>
                      <span className="text-gray-400">{itemCount} items</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Total Value</span>
                      <span className="text-green-400 font-medium">{formatCurrency(categoryValue)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <Dialog.Title className="text-xl font-semibold text-white mb-4">
              Add New Item
            </Dialog.Title>
            <form onSubmit={handleAddItem} className="space-y-4">
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Select
                fullWidth
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Add Item
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Item Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <Dialog.Title className="text-xl font-semibold text-white mb-4">
              Edit Item
            </Dialog.Title>
            <form onSubmit={handleEditItem} className="space-y-4">
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Select
                fullWidth
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
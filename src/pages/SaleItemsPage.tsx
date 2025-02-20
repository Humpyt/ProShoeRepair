import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faFileExport,
  faFileImport,
  faBarcode,
  faPrint,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../contexts/CartContext';
import ShoppingCart from '../components/ShoppingCart';
import SaleItemList from '../components/SaleItemList';
import ItemAnalytics from '../components/ItemAnalytics';
import AddProductModal from '../components/AddProductModal';
import toast from 'react-hot-toast';

interface SaleItem {
  id: string;
  name: string;
  category: string;
  type: 'product' | 'service';
  price: number;
  stock?: number;
  description: string;
}

const categories = [
  'Shoe Repair',
  'Cleaning',
  'Accessories',
  'Custom Work',
  'Maintenance',
  'Other'
];

export default function SaleItemsPage() {
  const [items, setItems] = useState<SaleItem[]>([
    {
      id: '1',
      name: 'Shoe Repair Service',
      category: 'Shoe Repair',
      type: 'service',
      price: 49.99,
      description: 'Complete shoe repair service including sole replacement and stitching'
    },
    {
      id: '2',
      name: 'Shoe Polish',
      category: 'Accessories',
      type: 'product',
      price: 9.99,
      stock: 50,
      description: 'Premium shoe polish for leather shoes'
    }
  ]);

  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<'all' | 'product' | 'service'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof SaleItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedItemForAnalytics, setSelectedItemForAnalytics] = useState<SaleItem | null>(null);

  const handleSort = (field: keyof SaleItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesType = selectedType === 'all' || item.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      return 0;
    });

  const handleAddToCart = (item: SaleItem) => {
    if (item.type === 'product' && item.stock === 0) {
      toast.error('This item is out of stock');
      return;
    }
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      type: item.type,
      stock: item.stock
    });
    toast.success('Added to cart');
  };

  const handleItemSelection = (id: string) => {
    setSelectedItems(prev => {
      if (id === '') {
        return [];
      }
      return prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id];
    });
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Item deleted successfully');
    }
  };

  const handleBulkExport = () => {
    const selectedData = items.filter(item => selectedItems.includes(item.id));
    const jsonStr = JSON.stringify(selectedData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sale-items-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Items exported successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Top Header */}
      <div className="bg-blue-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="ShoeMax" className="h-8" />
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-blue-600 text-white pl-10 pr-4 py-2 rounded-lg border border-blue-500 focus:border-blue-400 focus:outline-none placeholder-blue-300"
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Item</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
              <span>Cart (3)</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Quantity
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Discount
            </button>
          </div>
        </div>
      </div>

      {/* Subtotal Bar */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <div className="flex space-x-8">
            <div>
              <span className="text-gray-400 text-sm">Subtotal</span>
              <p className="text-white font-medium">$123.91</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Discount/Upcharge</span>
              <p className="text-white font-medium">$0.00</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Tax</span>
              <p className="text-white font-medium">$8.67</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Total</span>
              <p className="text-green-500 font-bold">$132.58</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
              Taxable
            </button>
            <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
              Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <SaleItemList
          items={filteredItems}
          selectedItems={selectedItems}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onSelect={handleItemSelection}
          onEdit={(item) => {
            // setEditingItem(item);
            // setIsModalOpen(true);
          }}
          onDelete={handleDeleteItem}
          onAddToCart={handleAddToCart}
          onViewAnalytics={(id) => {
            const item = items.find(item => item.id === id);
            if (item) {
              setSelectedItemForAnalytics(item);
              setShowAnalytics(true);
            }
          }}
        />
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onSave={(product) => {
          setItems(prev => [...prev, {
            ...product,
            id: String(prev.length + 1),
            type: 'product'
          }]);
          setIsModalOpen(false);
          toast.success('Product added successfully');
        }}
      />

      {selectedItemForAnalytics && (
        <ItemAnalytics
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
          itemId={selectedItemForAnalytics.id}
          itemName={selectedItemForAnalytics.name}
        />
      )}

      <ShoppingCart />
    </div>
  );
}

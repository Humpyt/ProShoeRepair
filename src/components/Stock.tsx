import React, { useState } from 'react';
import { Package, Search, Plus, AlertTriangle, ArrowDown, ArrowUp, Filter, Download } from 'lucide-react';
import type { StockItem } from '../types';
import StockModal from './StockModal';
import StockTransactionModal from './StockTransactionModal';
import { Pagination } from './Pagination';

const ITEMS_PER_PAGE = 10;

const mockStock: StockItem[] = [
  {
    id: '1',
    name: 'Premium Leather',
    category: 'leather',
    description: 'High-quality leather for shoe and bag repairs',
    quantity: 50,
    unit: 'meters',
    minQuantity: 20,
    price: 45.00,
    supplier: 'LeatherCo Inc',
    lastRestocked: '2024-03-01',
    location: 'Shelf A1'
  },
  {
    id: '2',
    name: 'Rubber Soles',
    category: 'soles',
    description: 'Durable rubber soles for shoe repairs',
    quantity: 100,
    unit: 'pairs',
    minQuantity: 30,
    price: 15.00,
    supplier: 'SoleMakers Ltd',
    lastRestocked: '2024-03-05',
    location: 'Shelf B2'
  },
  {
    id: '3',
    name: 'YKK Zippers',
    category: 'zippers',
    description: 'Premium quality zippers for bags',
    quantity: 200,
    unit: 'pieces',
    minQuantity: 50,
    price: 2.50,
    supplier: 'ZipSupply Co',
    lastRestocked: '2024-03-10',
    location: 'Drawer C3'
  },
  {
    id: '4',
    name: 'Waxed Thread',
    category: 'thread',
    description: 'Heavy-duty waxed thread for leather stitching',
    quantity: 300,
    unit: 'rolls',
    minQuantity: 40,
    price: 8.00,
    supplier: 'ThreadWorks',
    lastRestocked: '2024-03-12',
    location: 'Shelf D4'
  },
  {
    id: '5',
    name: 'Leather Adhesive',
    category: 'adhesive',
    description: 'Professional-grade leather adhesive',
    quantity: 75,
    unit: 'liters',
    minQuantity: 15,
    price: 25.00,
    supplier: 'GlueMax Industries',
    lastRestocked: '2024-03-08',
    location: 'Cabinet E5'
  },
  {
    id: '6',
    name: 'Shoe Laces',
    category: 'laces',
    description: 'Assorted shoe laces in various lengths',
    quantity: 500,
    unit: 'pairs',
    minQuantity: 100,
    price: 1.50,
    supplier: 'LaceMaster Co',
    lastRestocked: '2024-03-15',
    location: 'Bin F6'
  },
  {
    id: '7',
    name: 'Metal Buckles',
    category: 'other',
    description: 'Decorative metal buckles for bags',
    quantity: 150,
    unit: 'pieces',
    minQuantity: 30,
    price: 3.00,
    supplier: 'MetalCraft Ltd',
    lastRestocked: '2024-03-07',
    location: 'Drawer G7'
  },
  {
    id: '8',
    name: 'Leather Dye',
    category: 'other',
    description: 'Professional leather dye in various colors',
    quantity: 40,
    unit: 'liters',
    minQuantity: 10,
    price: 35.00,
    supplier: 'ColorTech Inc',
    lastRestocked: '2024-03-14',
    location: 'Cabinet H8'
  },
  {
    id: '9',
    name: 'Heel Tips',
    category: 'soles',
    description: 'Replacement heel tips for shoes',
    quantity: 400,
    unit: 'pairs',
    minQuantity: 80,
    price: 2.00,
    supplier: 'HeelPro Supply',
    lastRestocked: '2024-03-11',
    location: 'Bin I9'
  },
  {
    id: '10',
    name: 'Bag Handles',
    category: 'other',
    description: 'Leather bag handles in various styles',
    quantity: 80,
    unit: 'pairs',
    minQuantity: 20,
    price: 12.00,
    supplier: 'HandleCraft Co',
    lastRestocked: '2024-03-09',
    location: 'Shelf J10'
  },
  {
    id: '11',
    name: 'Suede Leather',
    category: 'leather',
    description: 'Premium suede leather for repairs',
    quantity: 35,
    unit: 'meters',
    minQuantity: 15,
    price: 55.00,
    supplier: 'LeatherCo Inc',
    lastRestocked: '2024-03-13',
    location: 'Shelf K11'
  },
  {
    id: '12',
    name: 'Nylon Thread',
    category: 'thread',
    description: 'Strong nylon thread for stitching',
    quantity: 250,
    unit: 'rolls',
    minQuantity: 45,
    price: 6.00,
    supplier: 'ThreadWorks',
    lastRestocked: '2024-03-16',
    location: 'Drawer L12'
  },
  {
    id: '13',
    name: 'Brass Rivets',
    category: 'other',
    description: 'Decorative brass rivets for bags',
    quantity: 300,
    unit: 'pieces',
    minQuantity: 60,
    price: 0.75,
    supplier: 'MetalCraft Ltd',
    lastRestocked: '2024-03-04',
    location: 'Bin M13'
  },
  {
    id: '14',
    name: 'Leather Cleaner',
    category: 'other',
    description: 'Professional leather cleaning solution',
    quantity: 45,
    unit: 'liters',
    minQuantity: 12,
    price: 18.00,
    supplier: 'CleanPro Inc',
    lastRestocked: '2024-03-06',
    location: 'Cabinet N14'
  },
  {
    id: '15',
    name: 'Elastic Band',
    category: 'other',
    description: 'Durable elastic band for repairs',
    quantity: 180,
    unit: 'meters',
    minQuantity: 40,
    price: 1.25,
    supplier: 'ElasticWorks Co',
    lastRestocked: '2024-03-02',
    location: 'Shelf O15'
  },
  {
    id: '16',
    name: 'Patent Leather',
    category: 'leather',
    description: 'High-gloss patent leather',
    quantity: 25,
    unit: 'meters',
    minQuantity: 10,
    price: 65.00,
    supplier: 'LeatherCo Inc',
    lastRestocked: '2024-03-17',
    location: 'Shelf P16'
  },
  {
    id: '17',
    name: 'Magnetic Snaps',
    category: 'other',
    description: 'Strong magnetic closures for bags',
    quantity: 220,
    unit: 'pieces',
    minQuantity: 50,
    price: 1.80,
    supplier: 'MetalCraft Ltd',
    lastRestocked: '2024-03-03',
    location: 'Drawer Q17'
  },
  {
    id: '18',
    name: 'Cork Soles',
    category: 'soles',
    description: 'Natural cork soles for shoes',
    quantity: 85,
    unit: 'pairs',
    minQuantity: 25,
    price: 22.00,
    supplier: 'SoleMakers Ltd',
    lastRestocked: '2024-03-18',
    location: 'Bin R18'
  },
  {
    id: '19',
    name: 'Leather Conditioner',
    category: 'other',
    description: 'Premium leather conditioning cream',
    quantity: 60,
    unit: 'liters',
    minQuantity: 15,
    price: 28.00,
    supplier: 'LeatherCare Pro',
    lastRestocked: '2024-03-19',
    location: 'Cabinet S19'
  },
  {
    id: '20',
    name: 'Metal Chain',
    category: 'other',
    description: 'Decorative metal chain for bags',
    quantity: 120,
    unit: 'meters',
    minQuantity: 30,
    price: 4.50,
    supplier: 'MetalCraft Ltd',
    lastRestocked: '2024-03-20',
    location: 'Drawer T20'
  }
];

export function Stock() {
  const [stock, setStock] = useState<StockItem[]>(mockStock);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<StockItem['category'] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredStock = stock.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredStock.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStock = filteredStock.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddStock = (stockItem: Omit<StockItem, 'id'>) => {
    const newItem: StockItem = {
      ...stockItem,
      id: (stock.length + 1).toString()
    };
    setStock([...stock, newItem]);
    setIsModalOpen(false);
  };

  const handleUpdateStock = (updatedItem: StockItem) => {
    setStock(stock.map(item => item.id === updatedItem.id ? updatedItem : item));
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleTransaction = (itemId: string, quantity: number, type: 'in' | 'out') => {
    setStock(stock.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: type === 'in' ? item.quantity + quantity : item.quantity - quantity
        };
      }
      return item;
    }));
    setIsTransactionModalOpen(false);
    setSelectedItem(null);
  };

  const exportStock = () => {
    const csv = [
      ['Name', 'Category', 'Quantity', 'Unit', 'Min Quantity', 'Price', 'Supplier', 'Location', 'Last Restocked'],
      ...filteredStock.map(item => [
        item.name,
        item.category,
        item.quantity.toString(),
        item.unit,
        item.minQuantity.toString(),
        item.price.toString(),
        item.supplier,
        item.location,
        item.lastRestocked
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-500 mt-1">
            {stock.filter(item => item.quantity <= item.minQuantity).length} items below minimum quantity
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setSelectedItem(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </button>
          <button
            onClick={exportStock}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search stock items..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as StockItem['category'] | 'all')}
          >
            <option value="all">All Categories</option>
            <option value="leather">Leather</option>
            <option value="soles">Soles</option>
            <option value="laces">Laces</option>
            <option value="zippers">Zippers</option>
            <option value="thread">Thread</option>
            <option value="adhesive">Adhesive</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedStock.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    item.quantity <= item.minQuantity ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {item.quantity} {item.unit}
                    {item.quantity <= item.minQuantity && (
                      <AlertTriangle className="h-4 w-4 inline ml-1" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Min: {item.minQuantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsTransactionModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Update Stock
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsModalOpen(true);
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStock.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredStock.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      <StockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onSave={selectedItem ? handleUpdateStock : handleAddStock}
        item={selectedItem}
      />

      <StockTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleTransaction}
        item={selectedItem}
      />
    </div>
  );
}

export default Stock;
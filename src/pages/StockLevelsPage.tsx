import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Eye
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { formatCurrency } from '../utils/formatCurrency';

interface SupplyItem {
  id: string;
  name: string;
  category: string;
  on_hand: number;
  min_stock: number;
  cost: number;
  unit: string;
}

type SortField = 'name' | 'category' | 'on_hand' | 'min_stock' | 'cost' | 'value';
type SortDirection = 'asc' | 'desc';

const StockLevelsPage: React.FC = () => {
  const [supplies, setSupplies] = useState<SupplyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    const fetchSupplies = async () => {
      try {
        const response = await fetch('/api/supplies');
        if (response.ok) {
          const data = await response.json();
          setSupplies(data);
        }
      } catch (error) {
        console.error('Error fetching supplies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplies();
  }, []);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalItems = supplies.length;
    const lowStockAlerts = supplies.filter(s => s.on_hand > 0 && s.on_hand < s.min_stock).length;
    const outOfStock = supplies.filter(s => s.on_hand === 0).length;
    const totalValue = supplies.reduce((sum, s) => sum + (s.on_hand * s.cost), 0);

    return { totalItems, lowStockAlerts, outOfStock, totalValue };
  }, [supplies]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(supplies.map(s => s.category))].sort();
    return cats;
  }, [supplies]);

  // Filter and sort supplies
  const filteredSupplies = useMemo(() => {
    let result = [...supplies];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(query));
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Handle special fields
      if (sortField === 'value') {
        aVal = a.on_hand * a.cost;
        bVal = b.on_hand * b.cost;
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [supplies, searchQuery, selectedCategory, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStockStatus = (onHand: number, minStock: number) => {
    if (onHand === 0) return { label: 'Out', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    if (onHand < minStock) return { label: 'Low', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    return { label: 'OK', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc'
      ? <ChevronUp size={16} className="inline ml-1" />
      : <ChevronDown size={16} className="inline ml-1" />;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-2">
            Stock Levels
          </h1>
          <p className="text-gray-400">Monitor inventory and low stock alerts</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Items"
          value={metrics.totalItems}
          icon={<Package size={24} />}
          type="default"
          loading={loading}
        />
        <MetricCard
          title="Low Stock Alerts"
          value={metrics.lowStockAlerts}
          icon={<AlertTriangle size={24} />}
          type="actions"
          loading={loading}
        />
        <MetricCard
          title="Out of Stock"
          value={metrics.outOfStock}
          icon={<XCircle size={24} />}
          type="tickets"
          loading={loading}
        />
        <MetricCard
          title="Total Stock Value"
          value={formatCurrency(metrics.totalValue)}
          icon={<DollarSign size={24} />}
          type="revenue"
          loading={loading}
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-11 pr-8 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors min-w-[160px]"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-gray-800/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Item Name <SortIcon field="name" />
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('category')}
                >
                  Category <SortIcon field="category" />
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('on_hand')}
                >
                  On Hand <SortIcon field="on_hand" />
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('min_stock')}
                >
                  Min Stock <SortIcon field="min_stock" />
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Unit
                </th>
                <th
                  className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('value')}
                >
                  Value <SortIcon field="value" />
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    Loading stock data...
                  </td>
                </tr>
              ) : filteredSupplies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No items found
                  </td>
                </tr>
              ) : (
                filteredSupplies.map((item) => {
                  const status = getStockStatus(item.on_hand, item.min_stock);
                  const value = item.on_hand * item.cost;
                  const isLow = item.on_hand < item.min_stock && item.on_hand > 0;
                  const isOut = item.on_hand === 0;

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{item.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400 text-sm">{item.category}</span>
                      </td>
                      <td className={`px-6 py-4 text-right font-mono ${isOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-white'}`}>
                        {item.on_hand}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-400 font-mono">
                        {item.min_stock}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400 text-sm">
                        {item.unit}
                      </td>
                      <td className="px-6 py-4 text-right text-white font-mono">
                        {formatCurrency(value)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      {!loading && filteredSupplies.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Showing {filteredSupplies.length} of {supplies.length} items
        </div>
      )}
    </div>
  );
};

export default StockLevelsPage;

import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, ShoppingBag, DollarSign, ArrowUpDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Cell,
} from 'recharts';
import { formatCurrency } from '../utils/formatCurrency';
import MetricCard from '../components/MetricCard';
import { ChartCard } from '../components/ui/ChartCard';

interface ServicePerformance {
  serviceId: string;
  serviceName: string;
  category: string;
  totalRevenue: number;
  orderCount: number;
}

interface CategoryBreakdown {
  category: string;
  totalRevenue: number;
  orderCount: number;
}

interface ServicePerformanceResponse {
  byRevenue: ServicePerformance[];
  byOrders: ServicePerformance[];
  categoryBreakdown: CategoryBreakdown[];
}

type ViewMode = 'revenue' | 'orders';

// Color palette for categories
const CATEGORY_COLORS: Record<string, string> = {
  'Cleaning': '#10B981',
  'Heel': '#3B82F6',
  'Sole': '#F97316',
  'Dyeing': '#8B5CF6',
  'Stitching': '#EC4899',
  'Repair': '#6366F1',
  'Conditioning': '#14B8A6',
  'Uncategorized': '#64748B',
  'Default': '#9CA3AF',
};

// Get color for a category
const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Default;
};

// Custom tooltip for bar chart
const BarChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800/95 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold mb-1">{data.serviceName}</p>
        <p className="text-gray-400 text-sm">Category: {data.category}</p>
        <p className="text-emerald-400 font-bold mt-2">
          Revenue: {formatCurrency(data.totalRevenue)}
        </p>
        <p className="text-blue-400 text-sm">
          Orders: {data.orderCount}
        </p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for pie chart
const PieChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800/95 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold mb-1">{data.category}</p>
        <p className="text-emerald-400 font-bold">
          Revenue: {formatCurrency(data.totalRevenue)}
        </p>
        <p className="text-blue-400 text-sm">
          Orders: {data.orderCount}
        </p>
        <p className="text-gray-400 text-sm">
          % of Total: {data.percentage}%
        </p>
      </div>
    );
  }
  return null;
};

export default function MostPerformingPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ServicePerformanceResponse | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('revenue');
  const [sortColumn, setSortColumn] = useState<'revenue' | 'orders'>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchServicePerformance = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/analytics/service-performance');
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching service performance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServicePerformance();
  }, []);

  // Get current services based on view mode
  const currentServices = viewMode === 'revenue' ? data?.byRevenue : data?.byOrders;

  // Get top 10 services for chart
  const top10Services = currentServices?.slice(0, 10) || [];

  // Prepare chart data (reversed for horizontal bar - lowest at bottom)
  const chartData = [...top10Services].reverse();

  // Prepare category chart data
  const totalCategoryRevenue = data?.categoryBreakdown.reduce((sum, c) => sum + c.totalRevenue, 0) || 0;
  const categoryChartData = data?.categoryBreakdown.map(cat => ({
    ...cat,
    percentage: totalCategoryRevenue > 0 ? Math.round((cat.totalRevenue / totalCategoryRevenue) * 100) : 0,
  })) || [];

  // Calculate metrics
  const topServiceRevenue = data?.byRevenue[0];
  const uniqueServicesCount = data?.byRevenue.filter(s => s.orderCount > 0).length || 0;
  const busiestService = data?.byOrders[0];
  const mostProfitableCategory = data?.categoryBreakdown[0];

  // Handle sort toggle
  const handleSort = (column: 'revenue' | 'orders') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Sort services for table
  const sortedServices = [...(currentServices || [])].sort((a, b) => {
    const aValue = sortColumn === 'revenue' ? a.totalRevenue : a.orderCount;
    const bValue = sortColumn === 'revenue' ? b.totalRevenue : b.orderCount;
    return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 animate-pulse text-lg">Loading Service Performance...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center gap-4 mb-2">
              <Trophy className="text-yellow-500" size={36} />
              Most Performing Services
            </h1>
            <p className="text-gray-400 font-medium max-w-2xl">
              Analyze service performance metrics to identify top performers and optimize your offerings.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-gray-800/60 backdrop-blur-sm rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setViewMode('revenue')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                viewMode === 'revenue'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              By Revenue
            </button>
            <button
              onClick={() => setViewMode('orders')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                viewMode === 'orders'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              By Orders
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Top Service Revenue"
            value={topServiceRevenue ? formatCurrency(topServiceRevenue.totalRevenue) : 'UGX 0'}
            icon={<DollarSign size={24} />}
            type="revenue"
            trend={topServiceRevenue?.serviceName}
            trendUp={true}
          />
          <MetricCard
            title="Total Services Offered"
            value={uniqueServicesCount}
            icon={<ShoppingBag size={24} />}
            type="tickets"
          />
          <MetricCard
            title="Busiest Service"
            value={busiestService?.serviceName || 'N/A'}
            icon={<TrendingUp size={24} />}
            type="actions"
            trend={busiestService ? `${busiestService.orderCount} orders` : ''}
            trendUp={true}
          />
          <MetricCard
            title="Most Profitable Category"
            value={mostProfitableCategory?.category || 'N/A'}
            icon={<Trophy size={24} />}
            type="revenue"
            trend={mostProfitableCategory ? formatCurrency(mostProfitableCategory.totalRevenue) : ''}
            trendUp={true}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Services Bar Chart */}
          <ChartCard
            title="Top 10 Services by Revenue"
            action={
              <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                Horizontal bars
              </span>
            }
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" />
                  <XAxis
                    type="number"
                    stroke="#9CA3AF"
                    tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                  />
                  <YAxis
                    type="category"
                    dataKey="serviceName"
                    stroke="#9CA3AF"
                    width={95}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<BarChartTooltip />} />
                  <Bar
                    dataKey="totalRevenue"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={25}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Category Breakdown Pie Chart */}
          <ChartCard title="Revenue by Category">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="totalRevenue"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryChartData.slice(0, 6).map((cat) => (
                <div key={cat.category} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getCategoryColor(cat.category) }}
                  />
                  <span className="text-xs text-gray-300 truncate">{cat.category}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Services Table */}
        <ChartCard title="All Services Performance">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th
                    className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Total Revenue
                      <ArrowUpDown size={14} className={sortColumn === 'revenue' ? 'text-emerald-400' : ''} />
                    </div>
                  </th>
                  <th
                    className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('orders')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Order Count
                      <ArrowUpDown size={14} className={sortColumn === 'orders' ? 'text-emerald-400' : ''} />
                    </div>
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Average Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedServices.map((service) => {
                  const avgPrice = service.orderCount > 0 ? service.totalRevenue / service.orderCount : 0;
                  return (
                    <tr
                      key={service.serviceId}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-white font-medium">
                        {service.serviceName}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: `${getCategoryColor(service.category)}20`,
                            color: getCategoryColor(service.category),
                          }}
                        >
                          {service.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-400 font-semibold">
                        {formatCurrency(service.totalRevenue)}
                      </td>
                      <td className="py-3 px-4 text-right text-blue-400 font-semibold">
                        {service.orderCount}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-300">
                        {formatCurrency(avgPrice)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Percent, TrendingDown, Tag, Award } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import MetricCard from '../components/MetricCard';
import { ChartCard } from '../components/ui/ChartCard';
import { formatCurrency } from '../utils/formatCurrency';

interface DiscountSummary {
  totalDiscounts: number;
  averageDiscountPercent: number;
  operationsWithDiscount: number;
}

interface PeriodData {
  date: string;
  total: number;
  count: number;
}

interface TopDiscounted {
  id: string;
  customerName: string;
  totalAmount: number;
  discount: number;
  date: string;
}

interface DiscountAnalytics {
  summary: DiscountSummary;
  byPeriod: PeriodData[];
  topDiscounted: TopDiscounted[];
}

type PeriodToggle = 'day' | 'week' | 'month';

const DiscountsPage: React.FC = () => {
  const [data, setData] = useState<DiscountAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodToggle, setPeriodToggle] = useState<PeriodToggle>('day');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/analytics/discounts');
        if (!response.ok) {
          throw new Error('Failed to fetch discount analytics');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching discount analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Aggregate data for week/month view
  const getAggregatedData = () => {
    if (!data?.byPeriod) return [];

    if (periodToggle === 'day') {
      return data.byPeriod.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: item.total,
        count: item.count
      }));
    }

    // Group by week
    if (periodToggle === 'week') {
      const grouped: Record<string, { total: number; count: number }> = {};
      data.byPeriod.forEach(item => {
        const date = new Date(item.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        if (!grouped[weekKey]) {
          grouped[weekKey] = { total: 0, count: 0 };
        }
        grouped[weekKey].total += item.total;
        grouped[weekKey].count += item.count;
      });
      return Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, values]) => ({
          date: `Week of ${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          total: values.total,
          count: values.count
        }));
    }

    // Group by month
    if (periodToggle === 'month') {
      const grouped: Record<string, { total: number; count: number }> = {};
      data.byPeriod.forEach(item => {
        const monthKey = item.date.substring(0, 7); // YYYY-MM
        if (!grouped[monthKey]) {
          grouped[monthKey] = { total: 0, count: 0 };
        }
        grouped[monthKey].total += item.total;
        grouped[monthKey].count += item.count;
      });
      return Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, values]) => ({
          date: new Date(date + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          total: values.total,
          count: values.count
        }));
    }

    return [];
  };

  // Find highest single discount from topDiscounted
  const highestDiscount = data?.topDiscounted && data.topDiscounted.length > 0
    ? Math.max(...data.topDiscounted.map(t => t.discount))
    : 0;

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/95 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-white font-semibold">{formatCurrency(payload[0].value)}</p>
          <p className="text-gray-400 text-xs">{payload[0].payload.count} operation(s)</p>
        </div>
      );
    }
    return null;
  };

  const chartData = getAggregatedData();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="relative rounded-2xl bg-gray-800/60 backdrop-blur-xl border border-white/10 p-6">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-rose-500/20 border border-emerald-500/20 flex items-center justify-center">
              <Percent size={28} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Discount Analytics</h1>
              <p className="text-gray-400 text-sm">Track and analyze discount trends</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Discounts Given"
          value={formatCurrency(data?.summary?.totalDiscounts || 0)}
          icon={<TrendingDown size={24} />}
          loading={loading}
          type="default"
        />
        <MetricCard
          title="Average Discount %"
          value={`${(data?.summary?.averageDiscountPercent || 0).toFixed(1)}%`}
          icon={<Percent size={24} />}
          loading={loading}
          type="actions"
        />
        <MetricCard
          title="Operations with Discounts"
          value={data?.summary?.operationsWithDiscount || 0}
          icon={<Tag size={24} />}
          loading={loading}
          type="tickets"
        />
        <MetricCard
          title="Highest Single Discount"
          value={formatCurrency(highestDiscount)}
          icon={<Award size={24} />}
          loading={loading}
          type="revenue"
        />
      </div>

      {/* Chart Section */}
      <ChartCard
        title="Discount Trends"
        action={
          <div className="flex items-center gap-1 bg-gray-900/50 rounded-lg p-1">
            <button
              onClick={() => setPeriodToggle('day')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                periodToggle === 'day'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setPeriodToggle('week')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                periodToggle === 'week'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriodToggle('month')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                periodToggle === 'month'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Month
            </button>
          </div>
        }
      >
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-400">Loading chart data...</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-gray-400">No discount data available</div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="total"
                  fill="url(#emeraldGradient)"
                  radius={[4, 4, 0, 0]}
                  name="Discount Total"
                />
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      {/* Top Discounted Operations Table */}
      <div className="bg-gray-800/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">Top Discounted Operations</h3>
          <p className="text-sm text-gray-400">Operations with the highest discounts</p>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <div className="text-red-400">Error: {error}</div>
          </div>
        ) : !data?.topDiscounted || data.topDiscounted.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-gray-400">No discounted operations found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900/50 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-right">Original Total</th>
                  <th className="px-6 py-3 text-right">Discount</th>
                  <th className="px-6 py-3 text-right">Final Total</th>
                  <th className="px-6 py-3 text-right">Discount %</th>
                  <th className="px-6 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.topDiscounted.map((item) => {
                  const discountPercent = item.totalAmount > 0
                    ? ((item.discount / item.totalAmount) * 100).toFixed(1)
                    : '0.0';
                  const finalTotal = item.totalAmount - item.discount;

                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-rose-500/20 flex items-center justify-center mr-3">
                            <span className="text-emerald-400 text-sm font-semibold">
                              {item.customerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-white font-medium">{item.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-300">
                        {formatCurrency(item.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-rose-400 font-semibold">
                          -{formatCurrency(item.discount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-emerald-400 font-semibold">
                        {formatCurrency(finalTotal)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-2 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-semibold">
                          {discountPercent}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-400 text-sm">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountsPage;

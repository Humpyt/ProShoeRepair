import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { Users, TrendingUp, Calendar, UserPlus, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import MetricCard from '../components/MetricCard';
import { ChartCard } from '../components/ui/ChartCard';

interface NewCustomersData {
  summary: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    today: number;
  };
  trend: {
    date: string;
    count: number;
  }[];
  recentCustomers: {
    id: string;
    name: string;
    phone: string;
    createdAt: string;
    totalOrders: number;
  }[];
}

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899'];

export default function NewCustomersPage() {
  const [data, setData] = useState<NewCustomersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_ENDPOINTS['analytics/new-customers']);
        if (!res.ok) {
          throw new Error('Failed to fetch new customers data');
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching new customers:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-gray-400 animate-pulse text-lg">Loading new customers data...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-red-400">Error: {error || 'No data available'}</div>
      </div>
    );
  }

  const { summary, trend, recentCustomers } = data;

  // Calculate new vs returning ratio (mock for now - would need total customers from API)
  const returningCustomers = summary.total > 0 ? Math.max(0, summary.total - summary.thisMonth) : 0;
  const pieData = [
    { name: 'New Customers', value: summary.thisMonth, color: '#10B981' },
    { name: 'Returning', value: returningCustomers, color: '#6366F1' }
  ].filter(d => d.value > 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="relative rounded-2xl bg-gray-800/60 backdrop-blur-xl border border-white/10 p-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-emerald-500/20 flex items-center justify-center">
              <UserPlus size={28} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">New Customers</h1>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <Calendar size={14} />
                Customer acquisition analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
            <Sparkles size={18} />
            <span className="font-semibold">Live Tracking</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total New Customers"
          value={summary.total}
          icon={<Users size={24} />}
          type="default"
          loading={loading}
        />
        <MetricCard
          title="New This Month"
          value={summary.thisMonth}
          icon={<Calendar size={24} />}
          type="tickets"
          loading={loading}
        />
        <MetricCard
          title="New This Week"
          value={summary.thisWeek}
          icon={<TrendingUp size={24} />}
          type="actions"
          loading={loading}
        />
        <MetricCard
          title="New Today"
          value={summary.today}
          icon={<UserPlus size={24} />}
          type="revenue"
          loading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Trends Chart */}
        <ChartCard
          title="Registration Trends (Last 30 Days)"
          className="lg:col-span-2"
          action={
            <span className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
              Daily registrations
            </span>
          }
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1F2937',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  labelFormatter={(value) => format(new Date(value), 'MMMM dd, yyyy')}
                  formatter={(value: number) => [`${value} customers`, 'New Customers']}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fill="url(#colorCount)"
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* New vs Returning Pie Chart */}
        <ChartCard
          title="New vs Returning"
          className="lg:col-span-1"
          action={
            <span className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
              This month
            </span>
          }
        >
          <div className="h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1F2937',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: number, name: string) => [`${value}`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-3xl font-bold text-white">{summary.thisMonth}</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">New</p>
            </div>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent New Customers Table */}
      <ChartCard title="Recent New Customers" className="w-full">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Registered Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total Orders at Registration
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentCustomers.length > 0 ? (
                recentCustomers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      index === 0 ? 'bg-emerald-500/5' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          index === 0
                            ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border border-emerald-500/20'
                            : 'bg-gray-700/50'
                        }`}>
                          <span className={`text-sm font-bold ${
                            index === 0 ? 'text-emerald-400' : 'text-gray-400'
                          }`}>
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {customer.name}
                            {index === 0 && (
                              <span className="ml-2 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase font-bold">
                                Newest
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300 font-mono text-sm">{customer.phone}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-400 text-sm">
                        {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-300">{customer.totalOrders}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                        NEW CUSTOMER
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No new customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}

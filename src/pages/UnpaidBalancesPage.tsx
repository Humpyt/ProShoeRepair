import React, { useState, useEffect } from 'react';
import { AlertCircle, DollarSign, Clock, Users } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import MetricCard from '../components/MetricCard';

interface AgingBucket {
  balance: number;
  count: number;
}

interface UnpaidOperation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  createdAt: string;
  daysOutstanding: number;
}

interface UnpaidBalancesData {
  summary: {
    totalUnpaid: number;
    overdueCount: number;
    partialPaymentCount: number;
  };
  agingAnalysis: {
    current: AgingBucket;
    aging30: AgingBucket;
    aging60: AgingBucket;
    overdue: AgingBucket;
  };
  unpaidOperations: UnpaidOperation[];
}

type SortKey = 'customerName' | 'totalAmount' | 'paidAmount' | 'balance' | 'daysOutstanding' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function UnpaidBalancesPage() {
  const [data, setData] = useState<UnpaidBalancesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('daysOutstanding');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    fetchUnpaidBalances();
  }, []);

  const fetchUnpaidBalances = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/unpaid-balances');
      if (!response.ok) {
        throw new Error('Failed to fetch unpaid balances');
      }
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const getSortedOperations = () => {
    if (!data?.unpaidOperations) return [];

    return [...data.unpaidOperations].sort((a, b) => {
      let aVal: string | number = a[sortKey];
      let bVal: string | number = b[sortKey];

      if (sortKey === 'createdAt') {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }

      return sortOrder === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
    });
  };

  const getDaysBadgeColor = (days: number): string => {
    if (days < 30) return 'bg-green-900/50 text-green-400';
    if (days < 60) return 'bg-amber-900/50 text-amber-400';
    if (days < 90) return 'bg-orange-900/50 text-orange-400';
    return 'bg-red-900/50 text-red-400';
  };

  const getAgingCardStyles = (type: 'current' | 'aging30' | 'aging60' | 'overdue'): {
    borderColor: string;
    glowColor: string;
    gradientFrom: string;
    gradientTo: string;
  } => {
    switch (type) {
      case 'current':
        return { borderColor: '#10B981', glowColor: 'rgba(16, 185, 129, 0.3)', gradientFrom: '#059669', gradientTo: '#34D399' };
      case 'aging30':
        return { borderColor: '#F59E0B', glowColor: 'rgba(245, 158, 11, 0.3)', gradientFrom: '#D97706', gradientTo: '#FBBF24' };
      case 'aging60':
        return { borderColor: '#F97316', glowColor: 'rgba(249, 115, 22, 0.3)', gradientFrom: '#EA580C', gradientTo: '#FB923C' };
      case 'overdue':
        return { borderColor: '#EF4444', glowColor: 'rgba(239, 68, 68, 0.5)', gradientFrom: '#DC2626', gradientTo: '#F87171' };
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-UG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const averageBalance = data?.summary.totalUnpaid && data?.unpaidOperations?.length
    ? Math.round(data.summary.totalUnpaid / data.unpaidOperations.length)
    : 0;

  const sortedOperations = getSortedOperations();

  if (error) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen">
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Data</h3>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={fetchUnpaidBalances}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Unpaid Balances</h1>
          <p className="text-gray-400">Analytics and aging analysis of outstanding balances</p>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Unpaid Amount"
            value={loading ? '...' : formatCurrency(data?.summary.totalUnpaid || 0)}
            icon={<DollarSign className="h-6 w-6" />}
            type="revenue"
            loading={loading}
          />
          <MetricCard
            title="Overdue Count"
            value={loading ? '...' : (data?.summary.overdueCount || 0)}
            icon={<AlertCircle className="h-6 w-6" />}
            type="actions"
            loading={loading}
          />
          <MetricCard
            title="Partial Payments"
            value={loading ? '...' : (data?.summary.partialPaymentCount || 0)}
            icon={<Clock className="h-6 w-6" />}
            type="tickets"
            loading={loading}
          />
          <MetricCard
            title="Average Balance"
            value={loading ? '...' : formatCurrency(averageBalance)}
            icon={<Users className="h-6 w-6" />}
            type="default"
            loading={loading}
          />
        </div>

        {/* Aging Analysis Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Aging Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current (0-30 days) - Green */}
            <div
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 transition-all duration-300 hover:scale-[1.02]"
              style={{
                borderColor: getAgingCardStyles('current').borderColor,
                boxShadow: `0 0 20px ${getAgingCardStyles('current').glowColor}`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Current</span>
                <div
                  className="p-2 rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${getAgingCardStyles('current').gradientFrom}, ${getAgingCardStyles('current').gradientTo})` }}
                >
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">0-30 days</p>
              {loading ? (
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse mt-2" />
              ) : (
                <>
                  <p className="text-xl font-bold" style={{ color: getAgingCardStyles('current').borderColor }}>
                    {formatCurrency(data?.agingAnalysis.current.balance || 0)}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {data?.agingAnalysis.current.count || 0} operation{(data?.agingAnalysis.current.count || 0) !== 1 ? 's' : ''}
                  </p>
                </>
              )}
            </div>

            {/* 30-60 days - Amber */}
            <div
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 transition-all duration-300 hover:scale-[1.02]"
              style={{
                borderColor: getAgingCardStyles('aging30').borderColor,
                boxShadow: `0 0 20px ${getAgingCardStyles('aging30').glowColor}`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Aging</span>
                <div
                  className="p-2 rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${getAgingCardStyles('aging30').gradientFrom}, ${getAgingCardStyles('aging30').gradientTo})` }}
                >
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">30-60 days</p>
              {loading ? (
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse mt-2" />
              ) : (
                <>
                  <p className="text-xl font-bold" style={{ color: getAgingCardStyles('aging30').borderColor }}>
                    {formatCurrency(data?.agingAnalysis.aging30.balance || 0)}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {data?.agingAnalysis.aging30.count || 0} operation{(data?.agingAnalysis.aging30.count || 0) !== 1 ? 's' : ''}
                  </p>
                </>
              )}
            </div>

            {/* 60-90 days - Orange */}
            <div
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 transition-all duration-300 hover:scale-[1.02]"
              style={{
                borderColor: getAgingCardStyles('aging60').borderColor,
                boxShadow: `0 0 20px ${getAgingCardStyles('aging60').glowColor}`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Aging</span>
                <div
                  className="p-2 rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${getAgingCardStyles('aging60').gradientFrom}, ${getAgingCardStyles('aging60').gradientTo})` }}
                >
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">60-90 days</p>
              {loading ? (
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse mt-2" />
              ) : (
                <>
                  <p className="text-xl font-bold" style={{ color: getAgingCardStyles('aging60').borderColor }}>
                    {formatCurrency(data?.agingAnalysis.aging60.balance || 0)}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {data?.agingAnalysis.aging60.count || 0} operation{(data?.agingAnalysis.aging60.count || 0) !== 1 ? 's' : ''}
                  </p>
                </>
              )}
            </div>

            {/* 90+ days (Overdue) - Red with pulsing glow */}
            <div
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 transition-all duration-300 hover:scale-[1.02] animate-pulse"
              style={{
                borderColor: getAgingCardStyles('overdue').borderColor,
                boxShadow: `0 0 30px ${getAgingCardStyles('overdue').glowColor}`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Overdue</span>
                <div
                  className="p-2 rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${getAgingCardStyles('overdue').gradientFrom}, ${getAgingCardStyles('overdue').gradientTo})` }}
                >
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">90+ days</p>
              {loading ? (
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse mt-2" />
              ) : (
                <>
                  <p className="text-xl font-bold" style={{ color: getAgingCardStyles('overdue').borderColor }}>
                    {formatCurrency(data?.agingAnalysis.overdue.balance || 0)}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {data?.agingAnalysis.overdue.count || 0} operation{(data?.agingAnalysis.overdue.count || 0) !== 1 ? 's' : ''}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Unpaid Operations Table */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Unpaid Operations</h2>
            <p className="text-sm text-gray-400 mt-1">Outstanding balances sorted by days outstanding</p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading unpaid balances...</p>
            </div>
          ) : sortedOperations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-gray-400" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Unpaid Balances</h3>
              <p className="text-gray-400">All customers have paid in full</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-750 sticky top-0">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('customerName')}
                    >
                      Customer Name {sortKey === 'customerName' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Phone
                    </th>
                    <th
                      className="px-4 py-3 text-right text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('totalAmount')}
                    >
                      Total Amount {sortKey === 'totalAmount' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      className="px-4 py-3 text-right text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('paidAmount')}
                    >
                      Paid Amount {sortKey === 'paidAmount' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      className="px-4 py-3 text-right text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('balance')}
                    >
                      Balance {sortKey === 'balance' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      className="px-4 py-3 text-center text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('daysOutstanding')}
                    >
                      Days Outstanding {sortKey === 'daysOutstanding' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th
                      className="px-4 py-3 text-center text-sm font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('createdAt')}
                    >
                      Date Created {sortKey === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sortedOperations.map((operation) => (
                    <tr key={operation.id} className="hover:bg-gray-750/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Users className="text-gray-400 mr-2" size={16} />
                          <span className="text-sm text-white font-medium">
                            {operation.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-300">
                          {operation.customerPhone || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-gray-300">
                          {formatCurrency(operation.totalAmount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-green-400">
                          {formatCurrency(operation.paidAmount)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-red-400">
                          {formatCurrency(operation.balance)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDaysBadgeColor(operation.daysOutstanding)}`}>
                          {operation.daysOutstanding} days
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-gray-300">
                          {formatDate(operation.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-850 border-t-2 border-gray-700">
                  <tr>
                    <td colSpan={2} className="px-4 py-3 text-sm font-semibold text-white">
                      Total ({sortedOperations.length} operation{sortedOperations.length !== 1 ? 's' : ''})
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-white">
                      {formatCurrency(sortedOperations.reduce((sum, op) => sum + op.totalAmount, 0))}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-green-400">
                      {formatCurrency(sortedOperations.reduce((sum, op) => sum + op.paidAmount, 0))}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-red-400">
                      {formatCurrency(sortedOperations.reduce((sum, op) => sum + op.balance, 0))}
                    </td>
                    <td colSpan={2} className="px-4 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

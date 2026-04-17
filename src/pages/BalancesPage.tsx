import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { Printer, User, Phone, DollarSign, Calendar, Search, Filter, ChevronDown, TrendingUp, Package } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { useOperation } from '../contexts/OperationContext';
import { PaymentModal } from '../components/PaymentModal';
import { useAuthStore } from '../store/authStore';

interface BalanceRecord {
  id: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  } | null;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: string;
  createdAt: string;
  shoes: Array<{
    description: string;
    services: Array<{ name: string; price: number }>;
  }>;
}

export default function BalancesPage() {
  const { operations, refreshOperations } = useOperation();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'partial'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBalance, setSelectedBalance] = useState<BalanceRecord | null>(null);

  // Listen for drop-completed event to refresh data
  useEffect(() => {
    const handleDropCompleted = () => {
      refreshOperations();
    };
    window.addEventListener('drop-completed', handleDropCompleted);
    return () => window.removeEventListener('drop-completed', handleDropCompleted);
  }, [refreshOperations]);

  // Filter and process operations with balances
  const balanceRecords: BalanceRecord[] = operations
    .filter(op => {
      // Only include operations with partial or no payment
      const hasBalance = op.totalAmount > (op.paidAmount || 0);
      if (!hasBalance) return false;

      // Filter by payment status using new fields
      const paymentStatus = op.paymentStatus || 'unpaid';
      if (statusFilter === 'pending' && paymentStatus !== 'unpaid') return false;
      if (statusFilter === 'partial' && paymentStatus !== 'partial') return false;

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const customerName = op.customer?.name?.toLowerCase() || '';
        const customerPhone = op.customer?.phone?.includes(searchTerm) || '';
        const ticketId = op.id.toLowerCase().includes(searchLower);
        return customerName.includes(searchLower) || customerPhone || ticketId;
      }

      return true;
    })
    .map(op => ({
      id: op.id,
      customer: op.customer,
      totalAmount: op.totalAmount,
      paidAmount: op.paidAmount || 0,
      balance: op.totalAmount - (op.paidAmount || 0),
      status: op.paymentStatus || 'unpaid',
      createdAt: op.createdAt,
      shoes: (op as any).shoes || []
    }))
    .sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.balance - a.balance;
        case 'lowest':
          return a.balance - b.balance;
        default:
          return 0;
      }
    });

  // Calculate totals
  const totalBalance = balanceRecords.reduce((sum, record) => sum + record.balance, 0);
  const totalOriginal = balanceRecords.reduce((sum, record) => sum + record.totalAmount, 0);
  const totalPaid = balanceRecords.reduce((sum, record) => sum + record.paidAmount, 0);
  const recordCount = balanceRecords.length;

  const handlePrint = () => {
    window.print();
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

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Customer Balances</h1>
            <p className="text-gray-400">Track customers with outstanding payments</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2 text-gray-400 bg-gray-800 px-3 py-2 rounded-lg">
              <Package className="h-4 w-4" />
              <span className="text-sm">{recordCount}</span>
              <DollarSign className="h-4 w-4 ml-2" />
              <span className="text-sm">{formatCurrency(totalBalance)}</span>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all"
            >
              <Printer size={16} />
              Print
            </button>
          </div>
        </div>

        {/* Summary Cards - Gradient Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* Total Customers */}
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-4 border border-blue-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-xs font-medium flex items-center gap-1">
                <User size={12} />
                TOTAL CUSTOMERS
              </span>
              <User size={16} className="text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {recordCount}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-blue-300">
                {statusFilter === 'all' ? 'All customers' : statusFilter === 'pending' ? 'Unpaid only' : 'Partial payments'}
              </span>
            </div>
          </div>

          {/* Total Balance */}
          <div className="bg-gradient-to-br from-rose-900/50 to-rose-800/30 rounded-xl p-4 border border-rose-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-rose-300 text-xs font-medium flex items-center gap-1">
                <DollarSign size={12} />
                TOTAL BALANCE
              </span>
              <DollarSign size={16} className="text-rose-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {formatCurrency(totalBalance)}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-rose-300">
                Outstanding
              </span>
            </div>
          </div>

          {/* Amount Paid */}
          <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-xl p-4 border border-emerald-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-300 text-xs font-medium flex items-center gap-1">
                <TrendingUp size={12} />
                AMOUNT PAID
              </span>
              <DollarSign size={16} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {formatCurrency(totalPaid)}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-emerald-300">
                Of {formatCurrency(totalOriginal)} original
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card-bevel p-4 mb-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or ticket ID..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="btn-bevel px-4 py-2 rounded-lg appearance-none pr-8"
                >
                  <option value="all">All</option>
                  <option value="pending">Unpaid</option>
                  <option value="partial">Partial</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              {/* Sort Order */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="btn-bevel px-4 py-2 rounded-lg appearance-none pr-8"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest</option>
                  <option value="lowest">Lowest</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="card-bevel overflow-hidden">
          {balanceRecords.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <User className="text-gray-400" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Balances Found</h3>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'All customers have paid in full'}
              </p>
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              <table className="w-full">
                <thead className="bg-gray-800/80 backdrop-blur-sm sticky top-0">
                  <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Ticket</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Original</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Paid</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Balance</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {balanceRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} hover:bg-gray-700 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        #{record.id.slice(-6)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <User className="text-gray-400 mr-2" size={16} />
                        <span className="text-sm font-medium text-white">
                          {record.customer?.name || 'Walk-in'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Phone className="text-gray-400 mr-2" size={16} />
                        <span className="text-sm text-gray-300">
                          {record.customer?.phone || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Calendar className="text-gray-400 mr-2" size={16} />
                        <span className="text-sm text-gray-300">
                          {formatDate(record.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-sm text-gray-300">
                        {formatCurrency(record.totalAmount)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-sm text-green-400">
                        {formatCurrency(record.paidAmount)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-sm font-bold text-red-400">
                        {formatCurrency(record.balance)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {record.paidAmount === 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Unpaid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Partial
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => { setSelectedBalance(record); setPaymentModalOpen(true); }}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                      >
                        Record Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-800 border-t-2 border-gray-700">
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-white">
                    Total ({recordCount} records)
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-white">
                    {formatCurrency(totalOriginal)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-green-400">
                    {formatCurrency(totalPaid)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-red-400">
                    {formatCurrency(totalBalance)}
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3"></td>
                </tr>
              </tfoot>
            </table>
            </div>
          )}
        </div>

        {/* Print Styles */}
        <style>{`
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              background: white !important;
            }
            .card-bevel {
              box-shadow: none !important;
              border: 1px solid #ddd !important;
            }
          }
        `}</style>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => { setPaymentModalOpen(false); setSelectedBalance(null); }}
          totalAmount={selectedBalance?.balance || 0}
          customer={selectedBalance?.customer || null}
          onComplete={async (payments) => {
            if (!selectedBalance) return;
            try {
              const token = localStorage.getItem('auth_token');
              const response = await fetch(`${API_ENDPOINTS.operations}/${selectedBalance.id}/payments`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({ payments })
              });
              if (!response.ok) {
                throw new Error('Payment failed');
              }
              setPaymentModalOpen(false);
              setSelectedBalance(null);
              // Refresh operations to update the balance list
              if (refreshOperations) {
                await refreshOperations();
              }
            } catch (error) {
              console.error('Failed to record payment:', error);
              alert('Failed to record payment');
            }
          }}
          allowPartialPayments={true}
        />
      </div>
    </div>
  );
}

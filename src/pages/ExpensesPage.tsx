import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Filter,
  ChevronDown,
  Receipt,
  Package,
  Trash2,
  Edit,
  X,
  Calendar,
  ArrowRightLeft
} from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';
import { ExpenseModal } from '../components/expenses/ExpenseModal';
import { formatCurrency } from '../utils/formatCurrency';
import { CreateExpenseInput, UpdateExpenseInput, EXPENSE_CATEGORIES } from '../types/expense';
import { useAuthStore } from '../store/authStore';

const CATEGORY_COLORS: Record<string, string> = {
  'Supplies & Materials': '#6366f1',
  'Rent & Utilities': '#ec4899',
  'Salaries & Wages': '#f59e0b',
  'Marketing & Advertising': '#10b981',
  'Equipment & Maintenance': '#8b5cf6',
  'Transportation': '#3b82f6',
  'Insurance': '#ef4444',
  'Taxes & Fees': '#14b8a6',
  'Office Supplies': '#84cc16',
  'Miscellaneous': '#6b7280'
};

const ExpensesPage: React.FC = () => {
  const {
    expenses,
    loading,
    analytics,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    fetchAnalytics
  } = useExpenses();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'year'>('month');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });

  useEffect(() => {
    fetchExpenses();
    fetchAnalytics();
  }, [fetchExpenses, fetchAnalytics]);

  // Filter expenses by date range
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      if (filterCategory && exp.category !== filterCategory) return false;
      if (filterStatus && exp.status !== filterStatus) return false;

      if (dateRange.start || dateRange.end) {
        const expDate = new Date(exp.date);
        if (dateRange.start && expDate < dateRange.start) return false;
        if (dateRange.end) {
          const endOfDay = new Date(dateRange.end);
          endOfDay.setHours(23, 59, 59);
          if (expDate > endOfDay) return false;
        }
      }
      return true;
    });
  }, [expenses, filterCategory, filterStatus, dateRange]);

  // Transform analytics data for charts
  const categoryChartData = useMemo(() => {
    if (!analytics?.categoryBreakdown) return [];
    return analytics.categoryBreakdown.map(cat => ({
      name: cat.category.split(' ')[0],
      value: cat.amount,
      color: CATEGORY_COLORS[cat.category] || '#6b7280'
    }));
  }, [analytics]);

  const topCategory = useMemo(() => {
    if (!analytics?.categoryBreakdown || analytics.categoryBreakdown.length === 0) return null;
    return analytics.categoryBreakdown[0];
  }, [analytics]);

  const dailyAverage = useMemo(() => {
    if (!analytics?.totalThisMonth) return 0;
    const daysInMonth = new Date().getDate();
    return analytics.totalThisMonth / daysInMonth;
  }, [analytics]);

  const handleSaveExpense = async (data: CreateExpenseInput | UpdateExpenseInput) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, data as UpdateExpenseInput);
    } else {
      await addExpense({ ...data, createdBy: user?.id } as CreateExpenseInput);
    }
    await fetchExpenses();
    await fetchAnalytics();
    setEditingExpense(null);
  };

  const handleDeleteExpense = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
      await fetchExpenses();
      await fetchAnalytics();
    }
  };

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Supplies') || category.includes('Materials')) return <Package size={14} />;
    if (category.includes('Rent') || category.includes('Utilities')) return <Calendar size={14} />;
    if (category.includes('Marketing') || category.includes('Advertising')) return <TrendingUp size={14} />;
    return <Receipt size={14} />;
  };

  const clearDateFilter = () => {
    setDateRange({ start: null, end: null });
  };

  return (
    <div className="h-full bg-gray-900 p-4 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Expense Analytics</h1>
          <p className="text-gray-400 text-sm">Track and manage operational costs</p>
        </div>
        <button
          onClick={() => { setEditingExpense(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Calendar size={14} />
          <span>Filter by date:</span>
        </div>
        <div className="flex items-center gap-2">
          <DatePicker
            selected={dateRange.start}
            onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
            selectsStart
            startDate={dateRange.start}
            endDate={dateRange.end}
            placeholderText="Start date"
            className="w-32 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            dateFormat="MMM d, yyyy"
          />
          <span className="text-gray-500">-</span>
          <DatePicker
            selected={dateRange.end}
            onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
            selectsEnd
            startDate={dateRange.start}
            endDate={dateRange.end}
            minDate={dateRange.start || undefined}
            placeholderText="End date"
            className="w-32 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            dateFormat="MMM d, yyyy"
          />
        </div>
        {(dateRange.start || dateRange.end) && (
          <button
            onClick={clearDateFilter}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Summary Cards - Compact Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Total This Month */}
        <div className="bg-gray-800 rounded-xl p-3 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">This Month</span>
            <Wallet size={14} className="text-indigo-400" />
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(analytics?.totalThisMonth || 0)}</p>
        </div>

        {/* Top Category */}
        <div className="bg-gray-800 rounded-xl p-3 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">Top Category</span>
            <TrendingUp size={14} className="text-emerald-400" />
          </div>
          <p className="text-sm font-bold text-white truncate">
            {topCategory ? topCategory.category.split('&')[0].trim() : 'N/A'}
          </p>
          <p className="text-xs text-gray-400">{topCategory ? formatCurrency(topCategory.amount) : ''}</p>
        </div>

        {/* Daily Average */}
        <div className="bg-gray-800 rounded-xl p-3 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">Daily Avg</span>
            <ArrowRightLeft size={14} className="text-amber-400" />
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(dailyAverage)}</p>
        </div>

        {/* Status */}
        <div className="bg-gray-800 rounded-xl p-3 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">Pending</span>
            <Calendar size={14} className="text-rose-400" />
          </div>
          <p className="text-xl font-bold text-white">
            {formatCurrency(analytics?.statusBreakdown?.find(s => s.status === 'pending')?.amount || 0)}
          </p>
        </div>
      </div>

      {/* Filters & Transaction List */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="flex justify-between items-center p-3 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-200">Recent Expenses</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-lg transition-colors ${showFilters ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Filter size={14} />
            </button>
          </div>
        </div>

        {/* Filter Row */}
        {showFilters && (
          <div className="flex gap-3 p-3 border-b border-gray-700 bg-gray-750/50">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm"
            >
              <option value="">All Categories</option>
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white text-sm"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            {(filterCategory || filterStatus) && (
              <button
                onClick={() => { setFilterCategory(''); setFilterStatus(''); }}
                className="text-gray-400 hover:text-white text-xs flex items-center gap-1 px-2"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        )}

        {/* Expense List */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
              Loading...
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Receipt className="text-gray-500 mb-2" size={24} />
              <p className="text-gray-400 text-sm">No expenses found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-750/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      exp.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' :
                      exp.status === 'overdue' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {getCategoryIcon(exp.category)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{exp.title}</p>
                      <p className="text-xs text-gray-500">
                        {exp.category} • {format(new Date(exp.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{formatCurrency(exp.amount)}</p>
                      <p className={`text-[10px] font-medium uppercase ${
                        exp.status === 'paid' ? 'text-emerald-500' :
                        exp.status === 'overdue' ? 'text-rose-500' :
                        'text-amber-500'
                      }`}>{exp.status}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditExpense(exp)}
                        className="p-1.5 text-gray-400 hover:text-indigo-400 transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expense Modal */}
      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingExpense(null); }}
        onSave={handleSaveExpense}
        expense={editingExpense}
        mode={editingExpense ? 'edit' : 'create'}
      />
    </div>
  );
};

export default ExpensesPage;

import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Wallet, 
  TrendingUp, 
  Plus, 
  Filter, 
  MoreVertical,
  ChevronRight,
  PieChart as PieChartIcon,
  Calendar,
  Receipt,
  Package
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const categoryData = [
  { name: 'Supplies', value: 12500, color: '#6366f1' },
  { name: 'Rent & Utilities', value: 8000, color: '#ec4899' },
  { name: 'Salaries', value: 15000, color: '#10b981' },
  { name: 'Marketing', value: 3000, color: '#f59e0b' },
  { name: 'Misc', value: 1500, color: '#64748b' },
];

const weeklyData = [
  { day: 'Mon', amount: 1200 },
  { day: 'Tue', amount: 2100 },
  { day: 'Wed', amount: 800 },
  { day: 'Thu', amount: 1600 },
  { day: 'Fri', amount: 2400 },
  { day: 'Sat', amount: 1100 },
  { day: 'Sun', amount: 400 },
];

const recentExpenses = [
  { id: 1, title: 'Premium Leather Sheets', category: 'Supplies', amount: 450.00, date: '2026-03-25', status: 'Paid' },
  { id: 2, title: 'Monthly Shop Rent', category: 'Rent', amount: 2100.00, date: '2026-03-24', status: 'Paid' },
  { id: 3, title: 'Facebook Ads - Spring', category: 'Marketing', amount: 150.00, date: '2026-03-23', status: 'Pending' },
  { id: 4, title: 'Utility Bill - Water', category: 'Utilities', amount: 85.50, date: '2026-03-22', status: 'Overdue' },
  { id: 5, title: 'Machine Maintenance', category: 'Maintenance', amount: 320.00, date: '2026-03-21', status: 'Paid' },
];

const ExpensesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');

  const totalMonthly = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-full bg-gray-900 p-8 overflow-y-auto no-scrollbar">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-2">
            Expense Analytics
          </h1>
          <p className="text-gray-400">Track and manage your operational costs with precision.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
          <Plus size={20} />
          Add New Expense
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* Hero Card: Total Spending */}
        <div className="md:col-span-2 lg:col-span-2 relative flex flex-col justify-between rounded-3xl bg-gray-800/60 backdrop-blur-xl border border-white/10 p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <Wallet className="text-indigo-400" size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <TrendingUp size={14} />
                +2.4%
              </div>
            </div>
            
            <p className="text-gray-400 font-medium mb-1">Total Expenses this Month</p>
            <h2 className="text-5xl font-black text-white tracking-tight mb-8">
              ${totalMonthly.toLocaleString()}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-gray-500 text-xs mb-1">Highest Category</p>
                <p className="text-white font-bold">Salaries ($15k)</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <p className="text-gray-500 text-xs mb-1">Daily Average</p>
                <p className="text-white font-bold">$1,330</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="md:col-span-1 lg:col-span-2 rounded-3xl bg-gray-800/40 backdrop-blur-md border border-white/5 p-8 flex flex-col shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-200 flex items-center gap-2">
              <PieChartIcon size={18} className="text-pink-500" />
              Allocation
            </h3>
            <button className="text-gray-500 hover:text-white transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total</p>
              <p className="text-xl font-bold text-white">${(totalMonthly/1000).toFixed(1)}k</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-3 mt-4">
            {categoryData.slice(0, 4).map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-gray-400 truncate">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend Bar Chart */}
        <div className="md:col-span-3 lg:col-span-4 rounded-3xl bg-gray-800/40 backdrop-blur-md border border-white/5 p-8 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-lg text-gray-200">Spending Trends</h3>
              <p className="text-xs text-gray-500">Weekly operational cost fluctuation</p>
            </div>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
              {['Week', 'Month', 'Year'].map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ background: '#111', border: '1px solid #333', borderRadius: '8px' }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="md:col-span-3 lg:col-span-4 mt-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-white">Recent Transactions</h3>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-white border border-white/5 rounded-lg bg-gray-800/50">
                <Filter size={18} />
              </button>
              <button className="text-indigo-400 text-sm font-bold hover:underline">View All</button>
            </div>
          </div>

          <div className="space-y-3">
            {recentExpenses.map((exp) => (
              <div 
                key={exp.id} 
                className="group flex items-center justify-between p-4 rounded-2xl bg-gray-800/30 border border-white/5 hover:bg-gray-800/50 hover:border-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110 duration-300 ${
                    exp.status === 'Paid' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    exp.status === 'Overdue' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                    'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {exp.category === 'Supplies' ? <Package size={20} /> :
                     exp.category === 'Rent' || exp.category === 'Utilities' ? <Calendar size={20} /> :
                     <Receipt size={20} />}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{exp.title}</h4>
                    <p className="text-gray-500 text-xs">{exp.category} • {format(new Date(exp.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-white font-mono font-bold">${exp.amount.toFixed(2)}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-tighter ${
                      exp.status === 'Paid' ? 'text-emerald-500' :
                      exp.status === 'Overdue' ? 'text-rose-500' :
                      'text-amber-500'
                    }`}>{exp.status}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-600 group-hover:text-gray-300 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExpensesPage;

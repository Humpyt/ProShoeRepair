import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { format, startOfMonth } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getProfitSummary, getDailyBalance } from '../api/expenses';
import {
  faTicket, faSearch, faBoxesStacked, faWarehouse, faHandshake,
  faTruckFast, faMoneyBillTransfer,
  faCheckCircle,
  faTriangleExclamation, faCoins, faChartLine,
  faPercent, faUserPlus, faTrophy, faStar, faCreditCard, faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';

// Target thresholds - module level constants
const ADMIN_MONTHLY = { red: 30000000, orange: 80000000, green: 104000000 };
const ADMIN_DAILY = { red: 1500000, orange: 2500000, green: 4000000 };
const STAFF_MONTHLY = { red: 8000000, orange: 18000000, green: 26000000 };

export default function StorePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    monthlyCollected: 0,
    dailyCollected: 0,
    jobsMonthly: 0,
    jobsToday: 0,
    jobsPending: 0,
    jobsCollectedMonth: 0
  });

  const canSeeAllData = user?.role === 'admin' || user?.role === 'manager';

  // Determine targets based on user role
  const isAdmin = user?.role === 'admin';
  const monthlyThresholds = isAdmin ? ADMIN_MONTHLY : STAFF_MONTHLY;
  const dailyThresholds = ADMIN_DAILY;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');

        // Fetch profit summary for monthly revenue
        const profitData = await getProfitSummary();

        // Fetch daily balance for today's revenue
        const dailyData = await getDailyBalance(today);

        // Fetch operations (filtered by staff if needed)
        const operationsUrl = canSeeAllData
          ? `${API_ENDPOINTS.operations}`
          : `${API_ENDPOINTS.operations}?created_by=${user?.id}`;
        const opsResponse = await fetch(operationsUrl);
        const operations = await opsResponse.json();

        // Filter operations by date
        const jobsThisMonth = Array.isArray(operations) ? operations.filter((op: any) =>
          op.createdAt && op.createdAt >= monthStart
        ) : [];
        const jobsToday = Array.isArray(operations) ? operations.filter((op: any) =>
          op.createdAt && op.createdAt.startsWith(today)
        ) : [];

        setDashboardStats({
          monthlyCollected: profitData.salesThisMonth || 0,
          dailyCollected: dailyData.sales?.total || 0,
          jobsMonthly: jobsThisMonth.length,
          jobsToday: jobsToday.length,
          jobsPending: jobsThisMonth.filter((op: any) => op.status === 'pending').length,
          jobsCollectedMonth: jobsThisMonth.filter((op: any) => op.status === 'completed').length,
        });
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [user, canSeeAllData]);

  const handleQuickAction = (path: string) => navigate(path);

  // Segmented progress bar with threshold colors
  const SegmentedProgressBar = ({ value, thresholds }: { value: number, thresholds: { red: number, orange: number, green: number } }) => {
    const max = thresholds.green;
    const redWidth = (thresholds.red / max) * 100;
    const orangeWidth = ((thresholds.orange - thresholds.red) / max) * 100;
    const greenWidth = ((thresholds.green - thresholds.orange) / max) * 100;

    // Calculate fill percentages for each segment
    const redFill = Math.min(100, (value / thresholds.red) * 100);
    const orangeFill = Math.min(100, Math.max(0, (value - thresholds.red) / (thresholds.orange - thresholds.red)) * 100);
    const greenFill = Math.min(100, Math.max(0, (value - thresholds.orange) / (thresholds.green - thresholds.orange)) * 100);

    const isOverRed = value > thresholds.red;
    const isOverOrange = value > thresholds.orange;
    const isOverGreen = value > thresholds.green;

    return (
      <div className="flex w-full gap-x-0.5 h-4 rounded-full overflow-hidden shadow-inner">
        {/* Red segment */}
        <div className="h-full bg-gray-800 relative" style={{ width: `${redWidth}%` }}>
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-700 ease-out rounded-l-full"
            style={{ width: `${isOverRed ? 100 : redFill}%` }}
          />
        </div>
        {/* Orange segment */}
        <div className="h-full bg-gray-800 relative" style={{ width: `${orangeWidth}%` }}>
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-700 ease-out"
            style={{ width: `${isOverOrange ? 100 : orangeFill}%` }}
          />
        </div>
        {/* Green segment */}
        <div className="h-full bg-gray-800 relative" style={{ width: `${greenWidth}%` }}>
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-700 ease-out rounded-r-full"
            style={{ width: `${isOverGreen ? 100 : greenFill}%` }}
          />
        </div>
      </div>
    );
  };

  // Revenue card with segmented progress bar
  const RevenueCard = ({
    title,
    value,
    thresholds,
    period
  }: {
    title: string;
    value: number;
    thresholds: { red: number; orange: number; green: number };
    period: string;
  }) => {
    const max = thresholds.green;
    const percent = Math.min(100, (value / max) * 100);
    const balance = Math.max(0, max - value);

    // Determine current zone color
    let zoneColor = 'text-red-400';
    if (value >= thresholds.orange) zoneColor = 'text-orange-400';
    if (value >= thresholds.green) zoneColor = 'text-emerald-400';

    return (
      <div className="group relative flex flex-col justify-between rounded-2xl bg-gray-900/40 border border-white/5 p-6 shadow-xl transition-all duration-500 hover:bg-gray-800/50 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-purple-500/5 blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-300 text-sm font-medium flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${value >= thresholds.green ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : value >= thresholds.orange ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}></span>
              {title}
            </p>
            <span className={`text-sm font-bold ${zoneColor}`}>{percent.toFixed(1)}%</span>
          </div>

          <SegmentedProgressBar value={value} thresholds={thresholds} />

          {/* Zone labels */}
          <div className="flex justify-between mt-1 text-[9px] text-gray-500 font-mono">
            <span>0-{thresholds.red.toLocaleString()}</span>
            <span>{thresholds.red.toLocaleString()}-{thresholds.orange.toLocaleString()}</span>
            <span>{thresholds.orange.toLocaleString()}-{thresholds.green.toLocaleString()}</span>
          </div>
        </div>

        <div className="relative z-10 mt-4 pt-4 border-t border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Collected</span>
            <span className="text-sm font-bold text-emerald-400">{value.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-400">Target</span>
            <span className="text-sm text-gray-300">{max.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-400">Balance</span>
            <span className="text-sm font-medium text-amber-400">{balance.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  };

  const operations = [
    { label: 'Code Payment', icon: faMoneyBillTransfer, path: '/cod-payment', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500/20' },
    { label: 'Total Discounts', icon: faPercent, path: '/discounts', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:border-purple-500 hover:bg-purple-500/20' },
    { label: 'New Customers', icon: faUserPlus, path: '/new-customers', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:border-indigo-500 hover:bg-indigo-500/20' },
    { label: 'Stock Levels', icon: faBoxesStacked, path: '/stock-levels', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/20' },
    { label: 'Customer Rankings', icon: faTrophy, path: '/customer-rankings', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:border-amber-500 hover:bg-amber-500/20' },
    { label: 'Most Performing Service', icon: faStar, path: '/most-performing', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:border-rose-500 hover:bg-rose-500/20' },
    { label: 'Credit List', icon: faCreditCard, path: '/credit-list', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:border-cyan-500 hover:bg-cyan-500/20' },
    { label: 'Unpaid Balances', icon: faMoneyBillWave, path: '/unpaid-balances', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:border-orange-500 hover:bg-orange-500/20' }
  ];

  const actionNeeded = [
    { label: 'Overdue', icon: faTriangleExclamation, path: '/balances', count: 12, color: 'from-red-500 to-rose-600' },
    { label: 'Ready pick today', icon: faCheckCircle, path: '/ready-to-pick', count: 8, color: 'from-emerald-500 to-green-600' },
    { label: 'Low stock', icon: faBoxesStacked, path: '/supplies', count: 5, color: 'from-orange-500 to-amber-600' },
    { label: 'Expenses', icon: faMoneyBillTransfer, path: '/expenses', count: 3, color: 'from-blue-500 to-cyan-600' },
    { label: 'Staff performance', icon: faChartLine, path: '/business-targets', count: 4, color: 'from-purple-500 to-fuchsia-600' },
    { label: 'Commissions', icon: faCoins, path: '/business-targets', count: 2, color: 'from-yellow-500 to-orange-600' }
  ];

  return (
    <div className="h-full bg-gray-900 p-8 overflow-y-auto">
      {/* Top Header - Glassmorphic Hero */}
      <div className="relative mb-8 rounded-3xl bg-gray-800/60 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
              {user?.name ? `${user.name}'s Dashboard` : 'Store Dashboard'}
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              {user?.name ? `Welcome back, ${user.name}!` : 'Good to see you!'} Here's today's overview at a glance.
            </p>
          </div>

          <div className="flex flex-col items-end bg-black/30 px-6 py-4 rounded-xl border border-white/5 shadow-inner backdrop-blur-md">
            <span className="font-mono text-3xl md:text-4xl font-light text-indigo-300 tracking-wider">
              {format(currentTime, 'hh:mm:ss a')}
            </span>
            <span className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-widest mt-1">
              {format(currentTime, 'MMMM dd, yyyy')}
            </span>
          </div>
        </div>

        {/* New Advanced Stats Grid under Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 relative z-10">

          {/* Card 1: Monthly Revenue */}
          <RevenueCard
            title={`Monthly Revenue - ${format(currentTime, 'MMM yyyy')}`}
            value={dashboardStats.monthlyCollected}
            thresholds={monthlyThresholds}
            period="monthly"
          />

          {/* Card 2: Daily Revenue */}
          <RevenueCard
            title={`Daily Revenue - ${format(currentTime, 'MMM dd')}`}
            value={dashboardStats.dailyCollected}
            thresholds={dailyThresholds}
            period="daily"
          />

          {/* Card 3: Jobs Status */}
          <div className="group relative flex flex-col justify-between rounded-2xl bg-gray-900/40 border border-white/5 p-6 shadow-xl transition-all duration-500 hover:bg-gray-800/50 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-purple-500/5 blur-2xl"></div>

            <div className="relative z-10 flex flex-col gap-3">
              <p className="text-gray-300 text-sm font-medium border-b border-white/5 pb-3 flex items-center">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                Total Monthly Jobs Recieved- {format(currentTime, 'MMM')} - 
                <span className="text-white font-bold ml-1">{dashboardStats.jobsMonthly.toLocaleString()}</span>
              </p>
              
              <p className="text-gray-200 font-semibold text-sm">
                Total Jobs Recieved today: <span className="text-emerald-400 ml-1 font-mono">{dashboardStats.jobsToday}</span>
              </p>
              
              <p className="text-gray-300 text-sm">
                Total jobs collected by customer today: 
                <span className="text-gray-500 ml-1">---</span>
              </p>
            </div>
            
            <div className="relative z-10 flex justify-between items-end mt-4 pt-4 border-t border-white/5 text-xs text-gray-400">
              <span className="font-semibold text-gray-300 italic">Total jobs pending: {dashboardStats.jobsPending}</span>
              <span>monthly jobs collected by customer: {dashboardStats.jobsCollectedMonth.toLocaleString()}</span>
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Operations - 7 columns span */}
        <div className="lg:col-span-7 flex flex-col gap-5 bg-gray-800/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl">
          <div className="flex items-center justify-between xl:mb-2 px-1">
            <h2 className="text-xl font-bold text-white tracking-wide">Daily Operations</h2>
            <div className="h-px bg-gradient-to-r from-white/20 to-transparent flex-1 ml-6"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {operations.map((op, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(op.path)}
                className={`group flex flex-col items-center justify-center text-center p-5 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-lg ${op.color}`}
              >
                <div className="mb-3 transform group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300">
                  <FontAwesomeIcon icon={op.icon} className="text-3xl" />
                </div>
                <span className="text-sm font-semibold tracking-wide">{op.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Needed / Alerts - 5 columns span */}
        <div className="lg:col-span-5 flex flex-col gap-5 bg-gray-800/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/5 shadow-xl">
          <div className="flex items-center justify-between xl:mb-2 px-1">
            <h2 className="text-xl font-bold text-white tracking-wide">Action Needed</h2>
            <div className="h-px bg-gradient-to-r from-red-500/40 to-transparent flex-1 ml-6"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {actionNeeded.map((action, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(action.path)}
                className="group relative flex items-center justify-between p-4 rounded-xl bg-gray-900/50 border border-white/5 hover:border-white/20 hover:bg-gray-800 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${action.color}`}></div>
                <div className="flex items-center ml-2 z-10">
                  <div className={`flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <FontAwesomeIcon icon={action.icon} className="text-white text-sm md:text-base" />
                  </div>
                  <span className="ml-3 text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                </div>
                {action.count > 0 && (
                  <div className="z-10 bg-gray-900 border border-white/10 text-white min-w-[28px] h-[28px] flex items-center justify-center rounded-full text-xs font-bold shadow-inner">
                    {action.count}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
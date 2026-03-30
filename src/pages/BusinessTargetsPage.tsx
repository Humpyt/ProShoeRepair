import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { Target, TrendingUp, TrendingDown, Calendar, BarChart3, Activity, Users, Trophy, Award, Zap } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { useAuthStore } from '../store/authStore';

interface BusinessSummary {
  period: {
    start: string;
    end: string;
    currentMonth: string;
  };
  targets: {
    businessMonthly: number;
  };
  current: {
    totalSales: number;
    operationsTotal: number;
    retailTotal: number;
  };
  progress: {
    percentage: number;
    remaining: number;
    color: string;
  };
}

interface StaffPerformance {
  period: {
    start: string;
    end: string;
    currentMonth: string;
    today: string;
  };
  targets: {
    daily: number;
    monthly: number;
  };
  dailyPerformance: {
    total: number;
    target: number;
    percentage: number;
    color: string;
    deficit: number | null;
    surplus: number | null;
  };
  monthlyPerformance: {
    total: number;
    target: number;
    percentage: number;
    color: string;
    deficit: number | null;
    surplus: number | null;
  };
  commission: {
    currentTier: number;
    rate: number;
    rateDisplay: string;
    estimatedCommission: number;
    progressToNextTier: number | null;
    nextTierThreshold: number | null;
  };
}

interface DailyData {
  period: {
    start: string;
    end: string;
    currentMonth: string;
  };
  dailyTarget: number;
  dailyBreakdown: Array<{
    date: string;
    total: number;
    target: number;
    percentage: number;
    color: string;
    deficit: number | null;
    surplus: number | null;
  }>;
  statistics: {
    totalDays: number;
    totalMonthlySales: number;
    averageDailySales: number;
    daysAtTarget: number;
    daysBelowTarget: number;
    percentageOfTarget: number;
  };
}

interface StaffMemberPerformance {
  id: string;
  name: string;
  email: string;
  today_sales: number;
  monthly_sales: number;
  daily_target: number;
  monthly_target: number;
  daily_percentage: number;
  monthly_percentage: number;
  daily_color: string;
  monthly_color: string;
  commission_tier: number;
  estimated_commission: number;
}

// Staff Performance Dashboard Component
const StaffPerformanceDashboard: React.FC<{
  staffPerformance: StaffPerformance;
  dailyData: DailyData;
}> = ({ staffPerformance, dailyData }) => {
  // Add comprehensive safety checks
  if (!staffPerformance || !dailyData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading performance data...</div>
      </div>
    );
  }

  // Recalculate with hardcoded rules:
  // Daily: 1,000,000. Red (0-300k), Orange (300k-800k), Green (800k+)
  // Monthly: 26,000,000. Red (0-10m), Orange (10m-20m), Green (20m+)
  const dTotal = staffPerformance?.dailyPerformance?.total || 0;
  const mTotal = staffPerformance?.monthlyPerformance?.total || 0;
  
  const dailyTarget = 1000000;
  const dPercentage = (dTotal / dailyTarget) * 100;
  const dailyColor = dTotal < 300000 ? 'red' : dTotal < 800000 ? 'orange' : 'green';

  const monthlyTarget = 26000000;
  const mPercentage = (mTotal / monthlyTarget) * 100;
  const monthlyColor = mTotal < 10000000 ? 'red' : mTotal < 20000000 ? 'orange' : 'green';

  const dailyPerf = {
    total: dTotal,
    target: dailyTarget,
    percentage: dPercentage,
    color: dailyColor,
    deficit: dTotal < dailyTarget ? dailyTarget - dTotal : null,
    surplus: dTotal > dailyTarget ? dTotal - dailyTarget : null,
  };

  const monthlyPerf = {
    total: mTotal,
    target: monthlyTarget,
    percentage: mPercentage,
    color: monthlyColor,
    deficit: mTotal < monthlyTarget ? monthlyTarget - mTotal : null,
    surplus: mTotal > monthlyTarget ? mTotal - monthlyTarget : null,
  };
  
  const commission = staffPerformance.commission || { currentTier: 1, rateDisplay: '1%', estimatedCommission: 0, nextTierThreshold: null, progressToNextTier: null };
  const dailyStats = dailyData?.statistics || { averageDailySales: 0, daysAtTarget: 0, totalDays: 0, totalMonthlySales: 0, percentageOfTarget: 0 };
  const dailyBreakdown = dailyData?.dailyBreakdown || [];

  const dailyColors = getColorClasses(dailyPerf.color);
  const monthlyColors = getColorClasses(monthlyPerf.color);

  const getMotivationalMessage = () => {
    const monthlyPercentage = monthlyPerf.percentage;
    const dailyPercentage = dailyPerf.percentage;

    if (monthlyPercentage >= 100 && dailyPercentage >= 100) {
      return {
        message: "🔥 Outstanding! You're crushing both daily and monthly targets!",
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-300'
      };
    } else if (monthlyPercentage >= 80) {
      return {
        message: "💪 Great progress! You're on track to meet your monthly target!",
        bgColor: 'bg-blue-500/20',
        textColor: 'text-blue-300'
      };
    } else if (dailyPercentage >= 100) {
      return {
        message: "⭐ Excellent work today! Keep the momentum going!",
        bgColor: 'bg-purple-500/20',
        textColor: 'text-purple-300'
      };
    } else if (monthlyPercentage >= 50) {
      return {
        message: "📈 Making steady progress. Push through to reach your goals!",
        bgColor: 'bg-yellow-500/20',
        textColor: 'text-yellow-300'
      };
    } else {
      return {
        message: "🚀 Let's accelerate! Every sale counts towards your success!",
        bgColor: 'bg-orange-500/20',
        textColor: 'text-orange-300'
      };
    }
  };

  const motivationalContent = getMotivationalMessage();

  return (
    <div className="space-y-6">
      {/* Motivational Banner - Elegant Glassmorphic */}
      <div className={`relative rounded-2xl p-4 overflow-hidden ${motivationalContent.bgColor}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="relative flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${motivationalContent.bgColor}`}>
            <Zap className={`w-5 h-5 ${motivationalContent.textColor}`} />
          </div>
          <p className={`text-sm font-medium ${motivationalContent.textColor}`}>
            {motivationalContent.message}
          </p>
        </div>
      </div>

      {/* Main Dashboard Grid - Compact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Progress - Compact Circular */}
        <div className="relative rounded-2xl bg-gray-800/60 backdrop-blur-xl border border-white/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className={monthlyColors.text} size={18} />
            <h3 className="text-sm font-semibold text-white">Monthly</h3>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-700/50" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.min(staffPerformance?.monthlyPerformance?.percentage || 0, 100) / 100)}`}
                  className={`${monthlyColors.text} transition-all duration-1000`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{monthlyPerf.percentage.toFixed(0)}%</span>
                <span className="text-[10px] text-gray-400">{formatCurrency(monthlyPerf.total)}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-400">Target: {formatCurrency(monthlyPerf.target)}</p>
          </div>
        </div>

        {/* Daily Progress Card - Compact */}
        <div className="relative rounded-2xl bg-gray-800/60 backdrop-blur-xl border border-white/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className={dailyColors.text} size={18} />
            <h3 className="text-sm font-semibold text-white">Today</h3>
            <span className={`ml-auto text-xs font-bold ${dailyColors.text}`}>{dailyPerf.percentage.toFixed(0)}%</span>
          </div>

          <div className="text-center mb-3">
            <p className={`text-2xl font-bold ${dailyColors.text}`}>{formatCurrency(dailyPerf.total)}</p>
            <p className="text-xs text-gray-400">of {formatCurrency(dailyPerf.target)}</p>
          </div>

          <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full transition-all ${dailyColors.bg}`} style={{ width: `${Math.min(dailyPerf.percentage, 100)}%` }} />
          </div>

          {dailyPerf.deficit !== null && (
            <div className="flex items-center justify-center gap-1 text-xs text-red-400">
              <TrendingDown size={12} />
              <span>Need {formatCurrency(dailyPerf.deficit)}</span>
            </div>
          )}
          {dailyPerf.surplus !== null && (
            <div className="flex items-center justify-center gap-1 text-xs text-emerald-400">
              <TrendingUp size={12} />
              <span>+{formatCurrency(dailyPerf.surplus)}</span>
            </div>
          )}
        </div>

        {/* Commission - Compact */}
        <div className="relative rounded-2xl bg-gray-800/60 backdrop-blur-xl border border-white/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="text-yellow-400" size={18} />
            <h3 className="text-sm font-semibold text-white">Commission</h3>
          </div>

          <div className="text-center mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-2">
              <Award size={14} className="text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">Tier {commission.currentTier}</span>
            </div>
            <p className="text-xl font-bold text-white">{commission.rateDisplay}</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Est. Earnings</p>
            <p className="text-xl font-bold text-emerald-400">{formatCurrency(commission.estimatedCommission)}</p>
          </div>
        </div>
      </div>

      {/* Statistics Row - Compact */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl bg-gray-800/60 backdrop-blur-xl border border-white/10 p-3 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Avg Daily</p>
          <p className="text-sm font-bold text-white">{formatCurrency(dailyStats.averageDailySales)}</p>
        </div>
        <div className="rounded-xl bg-gray-800/60 backdrop-blur-xl border border-white/10 p-3 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Days Hit</p>
          <p className="text-sm font-bold text-emerald-400">{dailyStats.daysAtTarget}/{dailyStats.totalDays}</p>
        </div>
        <div className="rounded-xl bg-gray-800/60 backdrop-blur-xl border border-white/10 p-3 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Total</p>
          <p className="text-sm font-bold text-white">{formatCurrency(dailyStats.totalMonthlySales)}</p>
        </div>
        <div className="rounded-xl bg-gray-800/60 backdrop-blur-xl border border-white/10 p-3 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">% Target</p>
          <p className={`text-sm font-bold ${dailyStats.percentageOfTarget >= 100 ? 'text-emerald-400' : dailyStats.percentageOfTarget >= 80 ? 'text-orange-400' : 'text-red-400'}`}>
            {dailyStats.percentageOfTarget.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Daily Breakdown - Minimal Bars */}
      <div className="relative rounded-2xl bg-gray-800/60 backdrop-blur-xl border border-white/10 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <BarChart3 className="text-indigo-400" size={16} />
            Daily Breakdown
          </h3>
        </div>
        <div className="max-h-64 overflow-y-auto custom-scrollbar">
          {dailyBreakdown.map((day, index) => {
            const colors = getColorClasses(day.color);
            const date = new Date(day.date);
            const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            return (
              <div key={index} className="flex items-center gap-3 px-5 py-2 hover:bg-white/5 transition-colors">
                <span className="w-20 text-xs text-gray-400">{formattedDate}</span>
                <div className="flex-1 h-2 bg-gray-700/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${colors.bg}`}
                    style={{ width: `${Math.min(day.percentage, 100)}%` }}
                  />
                </div>
                <span className="w-20 text-xs font-medium text-right text-gray-300">{formatCurrency(day.total)}</span>
                <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const getColorClasses = (color: string) => {
  switch (color) {
    case 'red':
      return {
        bg: 'bg-red-500',
        bgLight: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500',
      };
    case 'orange':
      return {
        bg: 'bg-orange-500',
        bgLight: 'bg-orange-500/20',
        text: 'text-orange-400',
        border: 'border-orange-500',
      };
    case 'green':
      return {
        bg: 'bg-green-500',
        bgLight: 'bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500',
      };
    default:
      return {
        bg: 'bg-gray-500',
        bgLight: 'bg-gray-500/20',
        text: 'text-gray-400',
        border: 'border-gray-500',
      };
  }
};

const BusinessTargetsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [businessSummary, setBusinessSummary] = useState<BusinessSummary | null>(null);
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformance | null>(null);
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [allStaffPerformance, setAllStaffPerformance] = useState<StaffMemberPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data based on user role
        if (user?.role === 'admin' || user?.role === 'manager') {
          // Admin/Manager: Fetch business summary, all staff performance, and personal daily data
          const [summaryRes, allStaffRes] = await Promise.all([
            fetch(API_ENDPOINTS['business/targets/summary']),
            fetch(API_ENDPOINTS['business/targets/staff/all'], {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
              }
            })
          ]);

          if (!summaryRes.ok || !allStaffRes.ok) {
            throw new Error('Failed to fetch business targets data');
          }

          const [summary, allStaff] = await Promise.all([
            summaryRes.json(),
            allStaffRes.json(),
          ]);

          setBusinessSummary(summary);
          setAllStaffPerformance(allStaff);
        } else {
          // Staff: Fetch only personal performance data
          const staffRes = await fetch(`${API_ENDPOINTS['business/targets/staff']}/${user?.id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          });

          if (!staffRes.ok) {
            throw new Error('Failed to fetch performance data');
          }

          const staff = await staffRes.json();

          // Transform staff response to match frontend expectations
          // The individual staff endpoint returns nested structure
          const transformedStaff: StaffPerformance = {
            ...staff.staff,
            dailyPerformance: staff.todayPerformance,
            monthlyPerformance: staff.monthlyPerformance,
            commission: staff.commission,
            targets: staff.targets
          };

          // Use dailyBreakdown from staff endpoint, not separate /daily call
          const transformedDaily = {
            dailyBreakdown: staff.dailyBreakdown || [],
            statistics: {
              averageDailySales: staff.dailyBreakdown?.length > 0
                ? staff.dailyBreakdown.reduce((sum: number, day: any) => sum + day.total, 0) / staff.dailyBreakdown.length
                : 0,
              daysAtTarget: staff.dailyBreakdown?.filter((day: any) => day.total >= staff.targets.daily).length || 0,
              totalDays: staff.dailyBreakdown?.length || 0,
              totalMonthlySales: staff.monthlyPerformance?.total || 0,
              percentageOfTarget: staff.monthlyPerformance?.percentage || 0
            }
          };

          setStaffPerformance(transformedStaff);
          setDailyData(transformedDaily);
        }
      } catch (err) {
        console.error('Error fetching business targets:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading business targets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header - Glassmorphic */}
      <div className="relative rounded-2xl bg-gray-800/60 backdrop-blur-xl border border-white/10 p-6">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-purple-600/10 blur-3xl pointer-events-none"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
              <Target size={28} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user?.role === 'admin' || user?.role === 'manager' ? 'Business Targets' : 'My Performance'}
              </h1>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <Calendar size={14} />
                {businessSummary?.period?.currentMonth || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-white/10 text-white rounded-xl flex items-center gap-2 transition-all backdrop-blur-sm"
          >
            <Activity size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Admin/Manager View: All Staff Performance */}
      {(user?.role === 'admin' || user?.role === 'manager') && businessSummary && allStaffPerformance && (
        <>
          {/* Overall Business Target - Glassmorphic Card */}
          <div className="relative rounded-2xl bg-gray-800/60 backdrop-blur-xl border border-white/10 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              {/* Circular Progress - Elegant */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-700/50"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - (businessSummary?.progress?.percentage || 0) / 100)}`}
                      className={`${getColorClasses(businessSummary.progress.color).text} transition-all duration-1000`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {(businessSummary?.progress?.percentage || 0).toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Progress</span>
                  </div>
                </div>
              </div>

              {/* Stats - Compact Pills */}
              <div className="md:col-span-2 flex flex-col justify-center gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-900/50 rounded-xl border border-white/5 p-4">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Target</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(104000000)}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl border border-white/5 p-4">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Achieved</p>
                    <p className="text-xl font-bold text-emerald-400">{formatCurrency(businessSummary.current.totalSales)}</p>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl border border-white/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Remaining</p>
                    <p className={`text-sm font-bold ${getColorClasses(businessSummary.progress.color).text}`}>
                      {formatCurrency(businessSummary.progress.remaining)}
                    </p>
                  </div>
                  <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getColorClasses(businessSummary.progress.color).bg}`}
                      style={{ width: `${businessSummary.progress.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Staff Performance - Compact Elegant Table */}
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-800/80 to-gray-800/40 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                    <Users size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Staff Performance</h2>
                    <p className="text-xs text-gray-400">{allStaffPerformance?.length || 0} team members</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-900/50 text-xs font-medium text-gray-400 uppercase tracking-wider">
              <div className="col-span-3">Staff</div>
              <div className="col-span-2 text-center">Tier</div>
              <div className="col-span-3 text-center">Today</div>
              <div className="col-span-3 text-center">Month</div>
              <div className="col-span-1 text-right">Commission</div>
            </div>

            {/* Staff Rows */}
            <div className="divide-y divide-white/5">
              {allStaffPerformance && allStaffPerformance.length > 0 ? allStaffPerformance.map(staff => {
                const curDSales = staff.today_sales || 0;
                const dColor = curDSales < 300000 ? 'red' : curDSales < 800000 ? 'orange' : 'green';
                const dailyColors = getColorClasses(dColor);

                const curMSales = staff.monthly_sales || 0;
                const mColor = curMSales < 10000000 ? 'red' : curMSales < 20000000 ? 'orange' : 'green';
                const monthlyColors = getColorClasses(mColor);

                const dailyPct = Math.min(((curDSales) / 1000000) * 100, 100);
                const monthlyPct = Math.min(((curMSales) / 26000000) * 100, 100);

                return (
                  <div key={staff.id} className="grid grid-cols-12 gap-4 px-6 py-3 items-center hover:bg-white/5 transition-colors">
                    {/* Staff Info */}
                    <div className="col-span-3">
                      <p className="text-sm font-medium text-white">{staff.name}</p>
                      <p className="text-xs text-gray-500 truncate">{staff.email}</p>
                    </div>

                    {/* Tier Badge */}
                    <div className="col-span-2 flex justify-center">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        staff.commission_tier === 3 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        staff.commission_tier === 2 ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' :
                        'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      }`}>
                        T{staff.commission_tier}
                      </div>
                    </div>

                    {/* Daily Progress */}
                    <div className="col-span-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">{formatCurrency(curDSales)}</span>
                        <span className={`text-xs font-bold ${dailyColors.text}`}>{dailyPct.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${dailyColors.bg}`}
                          style={{ width: `${dailyPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Monthly Progress */}
                    <div className="col-span-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">{formatCurrency(curMSales)}</span>
                        <span className={`text-xs font-bold ${monthlyColors.text}`}>{monthlyPct.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${monthlyColors.bg}`}
                          style={{ width: `${monthlyPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Commission */}
                    <div className="col-span-1 text-right">
                      <span className="text-sm font-semibold text-emerald-400">{formatCurrency(staff.estimated_commission)}</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center text-gray-400 py-8">
                  No staff performance data available
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Staff View: Personal Performance Dashboard */}
      {user?.role === 'staff' && staffPerformance && dailyData && (
        <StaffPerformanceDashboard
          staffPerformance={staffPerformance}
          dailyData={dailyData}
        />
      )}

      {/* No data available message */}
      {user && !loading && !businessSummary && !staffPerformance && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No performance data available yet.</p>
          <p className="text-gray-500 text-sm mt-2">Start making sales or processing operations to see your performance data here.</p>
        </div>
      )}
    </div>
  );
};

export default BusinessTargetsPage;
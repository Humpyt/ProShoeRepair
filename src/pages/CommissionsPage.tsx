import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { formatCurrency } from '../utils/formatCurrency';
import { Trophy, Award, TrendingUp, Users, Wallet, ShieldOff } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface StaffMemberPerformance {
  id: string;
  name: string;
  email: string;
  monthly_sales: number;
  monthly_target: number;
}

export default function CommissionsPage() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [allStaff, setAllStaff] = useState<StaffMemberPerformance[]>([]);
  const [mySales, setMySales] = useState<number>(0);
  const [viewingStaffId, setViewingStaffId] = useState<string | null>(searchParams.get('staff'));
  const [viewingStaffName, setViewingStaffName] = useState<string | null>(searchParams.get('name'));

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        setLoading(true);
        // If admin, don't show commission data - only staff earn commissions
        if (user?.role === 'admin') {
          setLoading(false);
          return;
        }
        // If manager viewing a specific staff member's commissions
        if (viewingStaffId && (user?.role === 'manager' || user?.role === 'admin')) {
          const res = await fetch(`http://localhost:3000/api/business/targets/staff/${viewingStaffId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
          });
          const data = await res.json();
          setMySales(data?.monthlyPerformance?.total || 0);
          setLoading(false);
          return;
        }
        if (user?.role === 'manager') {
          const res = await fetch('http://localhost:3000/api/business/targets/staff/all', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
          });
          const data = await res.json();
          setAllStaff(Array.isArray(data) ? data : []);
        } else {
          // staff - fetch personal
          const res = await fetch(`http://localhost:3000/api/business/targets/staff/${user?.id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
          });
          const data = await res.json();
          setMySales(data?.monthlyPerformance?.total || 0);
        }
      } catch (err) {
        console.error('Failed to fetch commission data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, [user, viewingStaffId]);

  // Commission Calculation Rules
  // 0-10,000,000 (1%)
  // 10,000,000 - 20,000,000 (2%)
  // 20,000,000 - 26,000,000 (3%)
  const calculateCommission = (sales: number) => {
    let rate = 0.01;
    let rateStr = '1%';
    let tierColor = 'text-gray-400';
    let progressMax = 10000000;

    if (sales > 20000000) {
      rate = 0.03;
      rateStr = '3%';
      tierColor = 'text-green-400';
      progressMax = 26000000;
    } else if (sales > 10000000) {
      rate = 0.02;
      rateStr = '2%';
      tierColor = 'text-orange-400';
      progressMax = 20000000;
    }

    return {
      commission: sales * rate,
      rate,
      rateStr,
      tierColor,
      progressMax
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-gray-400 animate-pulse text-lg">Loading Commissions...</div>
      </div>
    );
  }

  const renderCommissionCard = (name: string, sales: number, isPersonal: boolean = false) => {
    const { commission, rateStr, tierColor, progressMax } = calculateCommission(sales);
    const progressPercentage = Math.min(100, (sales / progressMax) * 100);
    const deficitToNextTier = progressMax - sales;

    const chartData = [
      { name: 'Achieved', value: sales, color: '#10B981' },
      { name: 'Remaining to Next Tier', value: Math.max(0, deficitToNextTier), color: '#374151' }
    ];

    return (
      <div className={`card-bevel bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 rounded-2xl p-6 shadow-xl ${isPersonal ? 'md:col-span-2 lg:col-span-3' : ''}`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className={tierColor} size={24} />
              {name}
            </h3>
            <p className="text-gray-400 text-sm mt-1">Monthly Sales: <strong className="text-gray-200">{formatCurrency(sales)}</strong></p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Current Tier Rate</p>
            <span className={`px-4 py-1.5 rounded-full font-bold text-lg bg-gray-800/80 border border-white/10 shadow-inner ${tierColor}`}>
              {rateStr}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 relative flex-shrink-0 drop-shadow-lg">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(val: number) => formatCurrency(val)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-sm font-bold text-gray-300">{Math.round(progressPercentage)}%</span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-5">
            <div className="bg-gray-800/60 rounded-xl p-4 border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Estimated Commission</p>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  {formatCurrency(commission)}
                </p>
              </div>
              <Wallet className="text-emerald-500/50 w-12 h-12" />
            </div>

            {deficitToNextTier > 0 && sales < 26000000 && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex items-start gap-3">
                <TrendingUp className="text-orange-400 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-orange-200 font-medium">
                  Earn <strong className="text-orange-400">{formatCurrency(deficitToNextTier)}</strong> more to reach the next tier threshold ({formatCurrency(progressMax)}) and boost your rate!
                </p>
              </div>
            )}
            {sales >= 26000000 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-3">
                <Trophy className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-emerald-200 font-medium">
                  Maximum top tier unlocked! You are earning an outstanding 3% commission.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center gap-4 mb-2">
              <Trophy className="text-yellow-500" size={36} />
              Staff Commissions
            </h1>
            <p className="text-gray-400 font-medium max-w-2xl">
              Commission rates increase based on monthly sales milestones.
              Break through thresholds to maximize your earnings.
            </p>
          </div>

          <div className="flex gap-2 text-xs font-mono font-bold self-start md:self-auto">
            <span className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400">1% &lt; 10M</span>
            <span className="px-3 py-1.5 rounded-lg bg-gray-800 border border-orange-500/30 text-orange-400">2% &lt; 20M</span>
            <span className="px-3 py-1.5 rounded-lg bg-gray-800 border border-green-500/30 text-emerald-400">3% &gt;= 20M</span>
          </div>
        </div>

        {/* Admin: Commissions don't apply */}
        {user?.role === 'admin' && !viewingStaffId ? (
          <div className="card-bevel bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 rounded-2xl p-12 shadow-xl text-center">
            <ShieldOff className="text-gray-500 w-20 h-20 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">Commissions Not Applicable</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Commissions are earned by staff members based on their monthly sales performance.
              As an administrator, you manage the team but do not earn commissions on sales.
            </p>
          </div>
        ) : viewingStaffId && viewingStaffName ? (
          // Manager viewing a specific staff member's commissions
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <Users className="text-indigo-400" size={24} />
              {decodeURIComponent(viewingStaffName)}'s Commission
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderCommissionCard(decodeURIComponent(viewingStaffName), mySales)}
            </div>
          </div>
        ) : user?.role === 'manager' ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
              <Users className="text-indigo-400" size={24} />
              Team Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allStaff.map(staff => renderCommissionCard(staff.name, staff.monthly_sales || 0))}
              {allStaff.length === 0 && <p className="text-gray-500 col-span-3">No staff data available.</p>}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {renderCommissionCard(user?.name || 'My Performance', mySales, true)}
          </div>
        )}

      </div>
    </div>
  );
}

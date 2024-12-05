import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';

const data = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 }
];

const stats = [
  {
    icon: DollarSign,
    label: 'Today\'s Sales',
    value: '$2,845',
    change: '+12.5%',
    color: 'text-green-500'
  },
  {
    icon: Package,
    label: 'Ticket Pieces',
    value: '156',
    change: '+8.2%',
    color: 'text-blue-500'
  },
  {
    icon: Users,
    label: 'New Customers',
    value: '24',
    change: '+4.6%',
    color: 'text-purple-500'
  },
  {
    icon: TrendingUp,
    label: 'Avg. Ticket Value',
    value: '$45.20',
    change: '+6.8%',
    color: 'text-yellow-500'
  }
];

export default function BusinessStatus() {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
              <span className={`text-xs font-medium ${stat.color}`}>{stat.change}</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-white">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-4">Weekly Sales Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="sales" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
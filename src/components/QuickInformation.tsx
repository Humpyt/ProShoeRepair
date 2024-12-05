import React from 'react';
import { Clock, DollarSign, Package, AlertCircle, CreditCard, TrendingUp, Truck, Search } from 'lucide-react';

export default function QuickInformation() {
  const quickActions = [
    {
      icon: Clock,
      label: 'Hold & Quick drop',
      count: 5,
      color: 'text-yellow-500'
    },
    {
      icon: AlertCircle,
      label: 'Tickets Not Ready',
      count: 12,
      color: 'text-red-500'
    },
    {
      icon: DollarSign,
      label: 'No charge & Do over',
      count: 3,
      color: 'text-blue-500'
    },
    {
      icon: Package,
      label: 'Ready by today',
      count: 8,
      color: 'text-green-500'
    },
    {
      icon: CreditCard,
      label: 'Credit List',
      count: 4,
      color: 'text-purple-500'
    },
    {
      icon: Truck,
      label: 'Delivery',
      count: 6,
      color: 'text-indigo-500'
    },
    {
      icon: TrendingUp,
      label: 'Adjusted payment',
      count: 2,
      color: 'text-pink-500'
    },
    {
      icon: Search,
      label: 'Search Orders',
      color: 'text-cyan-500'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {quickActions.map((action, index) => (
        <button
          key={index}
          className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <action.icon className={`h-6 w-6 ${action.color}`} />
            {action.count !== undefined && (
              <span className={`${action.color} font-semibold`}>
                {action.count}
              </span>
            )}
          </div>
          <div className="text-sm font-medium text-gray-200">{action.label}</div>
          {action.count !== undefined && (
            <div className="mt-2 w-full bg-gray-600 h-1 rounded-full overflow-hidden">
              <div 
                className={`h-full ${action.color.replace('text-', 'bg-')}`}
                style={{ width: `${(action.count / 12) * 100}%` }}
              />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
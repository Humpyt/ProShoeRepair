import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, DollarSign, Package, AlertCircle, CreditCard, TrendingUp, Truck } from 'lucide-react';

export default function QuickInformation() {
  const navigate = useNavigate();

  const handleClick = (route: string) => {
    console.log('Navigating to:', route); // Debug log
    navigate(route);
  };

  const quickActions = [
    {
      icon: Clock,
      label: 'Hold & Quick drop',
      count: 5,
      color: '#4CAF50',
      route: '/hold-quick-drop'
    },
    {
      icon: DollarSign,
      label: 'No charge & Do over',
      count: 3,
      color: '#2196F3',
      route: '/no-charge-do-over'
    },
    {
      icon: Package,
      label: 'Ready by today',
      count: 8,
      color: '#00BCD4',
      route: '/ready-by-today'
    },
    {
      icon: CreditCard,
      label: 'Credit List',
      count: 4,
      color: '#9C27B0',
      route: '/credit-list'
    },
    {
      icon: AlertCircle,
      label: 'Overdue',
      count: 12,
      color: '#F44336',
      route: '/overdue'
    },
    {
      icon: Truck,
      label: 'Delivery',
      count: 6,
      color: '#3F51B5',
      route: '/delivery'
    },
    {
      icon: TrendingUp,
      label: 'Adjusted payment',
      count: 2,
      color: '#FF9800',
      route: '/adjusted-payment'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {quickActions.map((action, index) => (
        <button
          key={index}
          onClick={() => handleClick(action.route)}
          className="bg-gray-900 hover:bg-gray-800 p-5 rounded-xl text-left transition-all duration-300 group border border-gray-700 hover:border-indigo-500 backdrop-blur-sm bg-opacity-50"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div 
                className="p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform" 
                style={{ backgroundColor: `${action.color}20` }}
              >
                <action.icon 
                  className="w-5 h-5" 
                  style={{ color: action.color }}
                />
              </div>
              <div>
                <span className="text-white font-medium block">{action.label}</span>
                <span className="text-gray-500 text-sm">View details</span>
              </div>
            </div>
            {action.count > 0 && (
              <span 
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium group-hover:bg-indigo-500 transition-colors"
              >
                {action.count}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
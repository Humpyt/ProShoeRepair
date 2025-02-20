import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faShoppingCart,
  faMoneyBill,
  faClock,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

interface ItemAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemName: string;
}

export default function ItemAnalytics({
  isOpen,
  onClose,
  itemId,
  itemName
}: ItemAnalyticsProps) {
  if (!isOpen) return null;

  // Mock data for demonstration
  const analytics = {
    sales: {
      daily: 5,
      weekly: 32,
      monthly: 128,
      trend: '+12%'
    },
    revenue: {
      daily: 249.95,
      weekly: 1599.68,
      monthly: 6399.72,
      trend: '+8%'
    },
    popular_times: [
      { hour: '9AM', value: 30 },
      { hour: '10AM', value: 45 },
      { hour: '11AM', value: 60 },
      { hour: '12PM', value: 80 },
      { hour: '1PM', value: 70 },
      { hour: '2PM', value: 55 },
      { hour: '3PM', value: 40 },
      { hour: '4PM', value: 35 }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Analytics for {itemName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Sales Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Sales</h3>
              <FontAwesomeIcon icon={faShoppingCart} className="text-blue-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Today</span>
                <span className="text-white font-medium">{analytics.sales.daily}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">This Week</span>
                <span className="text-white font-medium">{analytics.sales.weekly}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">This Month</span>
                <span className="text-white font-medium">{analytics.sales.monthly}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                <span className="text-gray-400">Trend</span>
                <span className="text-green-400">{analytics.sales.trend}</span>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Revenue</h3>
              <FontAwesomeIcon icon={faMoneyBill} className="text-green-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Today</span>
                <span className="text-white font-medium">${analytics.revenue.daily}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">This Week</span>
                <span className="text-white font-medium">${analytics.revenue.weekly}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">This Month</span>
                <span className="text-white font-medium">${analytics.revenue.monthly}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                <span className="text-gray-400">Trend</span>
                <span className="text-green-400">{analytics.revenue.trend}</span>
              </div>
            </div>
          </div>

          {/* Popular Times Card */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Popular Times</h3>
              <FontAwesomeIcon icon={faClock} className="text-purple-400" />
            </div>
            <div className="h-32 flex items-end space-x-2">
              {analytics.popular_times.map((time, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-purple-500/20 rounded-t"
                    style={{ height: `${time.value}%` }}
                  />
                  <span className="text-gray-400 text-xs mt-1">{time.hour}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Analytics Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-gray-400 mb-2">Top Selling Periods</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-white">Weekdays</span>
                  <span className="text-green-400">Monday, Wednesday</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white">Time of Day</span>
                  <span className="text-green-400">12 PM - 2 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white">Season</span>
                  <span className="text-green-400">Summer</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-400 mb-2">Customer Insights</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-white">Repeat Purchases</span>
                  <span className="text-green-400">45%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white">Average Rating</span>
                  <span className="text-green-400">4.8/5.0</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white">Customer Retention</span>
                  <span className="text-green-400">78%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

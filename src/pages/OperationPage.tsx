import React, { useState } from 'react';
import { Calendar, Clock, Filter, Search, Package, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

interface WorkItem {
  ticketNo: string;
  custNo: string;
  name: string;
  pair: number;
  createDate: string;
  createTime: string;
  readyDate: string;
  readyTime: string;
  amount: number;
  repair?: string;
  repairTime?: string;
  repairStatus?: string;
  alteration?: string;
  cleaning?: string;
  shining?: string;
}

export default function OperationPage() {
  const [timeFilter, setTimeFilter] = useState<'today' | 'tomorrow' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [workItems] = useState<WorkItem[]>([
    {
      ticketNo: '100112',
      custNo: '104',
      name: 'David, V',
      pair: 1,
      createDate: '04/26/2016',
      createTime: '04:17 PM',
      readyDate: '04/29/2016',
      readyTime: '05:00 PM',
      amount: 108.00,
      repair: '10/21/2016',
      repairTime: '03:35 PM',
      repairStatus: 'DEF'
    },
    {
      ticketNo: '100151',
      custNo: '104',
      name: 'David, V',
      pair: 2,
      createDate: '10/21/2016',
      createTime: '03:34 PM',
      readyDate: '10/23/2016',
      readyTime: '01:00 PM',
      amount: 85.68
    }
  ]);

  const stats = {
    tickets: 2,
    totalAmount: 193.68,
    repair: 2,
    alteration: 0,
    cleaning: 1,
    shining: 0
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Operations</h1>
          <p className="text-gray-400">Manage daily repair operations and workflow</p>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Package className="h-5 w-5" />
            <span>Total Items: {stats.tickets}</span>
            <DollarSign className="h-5 w-5 ml-4" />
            <span>Value: {formatCurrency(stats.totalAmount)}</span>
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
              placeholder="Search operations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button 
              className={`btn-bevel px-6 py-2 rounded-lg flex items-center ${
                timeFilter === 'today' ? 'accent-primary' : 'accent-secondary'
              }`}
              onClick={() => setTimeFilter('today')}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Today
            </button>
            <button 
              className={`btn-bevel px-6 py-2 rounded-lg flex items-center ${
                timeFilter === 'tomorrow' ? 'accent-primary' : 'accent-secondary'
              }`}
              onClick={() => setTimeFilter('tomorrow')}
            >
              <Clock className="h-5 w-5 mr-2" />
              Tomorrow
            </button>
            <button 
              className={`btn-bevel px-6 py-2 rounded-lg flex items-center ${
                timeFilter === 'all' ? 'accent-primary' : 'accent-secondary'
              }`}
              onClick={() => setTimeFilter('all')}
            >
              <Filter className="h-5 w-5 mr-2" />
              All
            </button>
          </div>
        </div>
      </div>

      {/* Work Table */}
      <div className="card-bevel overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Ticket No</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Cust No</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Pairs</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Created</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Ready By</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {workItems.map((item) => (
              <tr key={item.ticketNo} className="hover:bg-gray-800">
                <td className="px-4 py-3 text-sm">{item.ticketNo}</td>
                <td className="px-4 py-3 text-sm">{item.custNo}</td>
                <td className="px-4 py-3 text-sm">{item.name}</td>
                <td className="px-4 py-3 text-sm">{item.pair}</td>
                <td className="px-4 py-3 text-sm">
                  <div>{item.createDate}</div>
                  <div className="text-gray-400">{item.createTime}</div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>{item.readyDate}</div>
                  <div className="text-gray-400">{item.readyTime}</div>
                </td>
                <td className="px-4 py-3 text-sm">{formatCurrency(item.amount)}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.repairStatus ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}>
                    {item.repairStatus || 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
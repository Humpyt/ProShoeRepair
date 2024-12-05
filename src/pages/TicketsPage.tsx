import React, { useState } from 'react';
import { Tag, Search, Filter, Plus, Package, Clock, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

interface Ticket {
  id: string;
  tagNumber: string;
  customerName: string;
  itemType: 'shoe' | 'bag' | 'other';
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'ready';
  dateReceived: string;
  estimatedCompletion: string;
  price: number;
  priority: 'normal' | 'rush' | 'express';
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    tagNumber: 'A1234',
    customerName: 'John Smith',
    itemType: 'shoe',
    description: 'Black leather shoes - heel repair',
    status: 'in-progress',
    dateReceived: '2024-03-15',
    estimatedCompletion: '2024-03-17',
    price: 85.00,
    priority: 'rush'
  },
  {
    id: '2',
    tagNumber: 'B5678',
    customerName: 'Sarah Johnson',
    itemType: 'bag',
    description: 'Brown leather handbag - zipper repair',
    status: 'pending',
    dateReceived: '2024-03-15',
    estimatedCompletion: '2024-03-18',
    price: 45.00,
    priority: 'normal'
  }
];

export default function TicketsPage() {
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Ticket['status']>('all');

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-600';
      case 'in-progress':
        return 'bg-indigo-600';
      case 'completed':
        return 'bg-emerald-600';
      case 'ready':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Tickets & Tags</h1>
          <p className="text-gray-400">Manage repair tickets and tags</p>
        </div>
        <div className="flex space-x-4">
          <button className="btn-bevel accent-primary px-6 py-3 rounded-lg flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Ticket
          </button>
          <button className="btn-bevel accent-secondary px-6 py-3 rounded-lg flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Print Tags
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Search and Filters */}
        <div className="card-bevel p-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-48">
              <select
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | Ticket['status'])}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="ready">Ready</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="card-bevel p-4">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tag #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 text-indigo-400 mr-2" />
                      <span className="font-medium">{ticket.tagNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{ticket.customerName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{ticket.description}</div>
                    <div className="text-xs text-gray-400 mt-1">{ticket.itemType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{ticket.estimatedCompletion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{formatCurrency(ticket.price)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
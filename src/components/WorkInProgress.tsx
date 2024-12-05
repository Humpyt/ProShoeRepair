import React, { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, LayoutGrid, LayoutList, Check } from 'lucide-react';
import type { RepairItem, Staff } from '../types';
import { mockStaff, mockRepairs, mockPickups as initialPickups } from '../data/mockData';
import { Pagination } from './Pagination';
import { formatCurrency } from '../utils/formatCurrency';

const ITEMS_PER_PAGE = 10;

export function WorkInProgress() {
  const [repairs, setRepairs] = useState<RepairItem[]>(mockRepairs);
  const [pickups, setPickups] = useState<RepairItem[]>(initialPickups);
  const [staff] = useState<Staff[]>(mockStaff);
  const [viewMode, setViewMode] = useState<'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(repairs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRepairs = repairs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStaffName = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.name || 'Unassigned';
  };

  const getStatusColor = (daysLeft: number) => {
    if (daysLeft < 0) return 'text-red-600';
    if (daysLeft === 0) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getDaysLeft = (estimatedCompletion: string) => {
    const today = new Date();
    const completion = new Date(estimatedCompletion);
    const diffTime = completion.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleCompleteRepair = (repairId: string) => {
    const completedRepair = repairs.find(repair => repair.id === repairId);
    
    if (completedRepair) {
      // Create pickup item with balance due
      const pickupItem: RepairItem = {
        ...completedRepair,
        status: 'ready-for-pickup',
        balanceDue: completedRepair.price / 2 // Example: Set balance due as half the total price
      };

      // Add to pickups list
      setPickups(prevPickups => [...prevPickups, pickupItem]);

      // Remove from repairs list
      setRepairs(prevRepairs => prevRepairs.filter(repair => repair.id !== repairId));

      // Store updated pickups in localStorage or send to backend
      localStorage.setItem('pickups', JSON.stringify([...pickups, pickupItem]));
    }
  };

  const renderListView = () => (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Staff
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timeline
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedRepairs.map((repair) => {
            const daysLeft = getDaysLeft(repair.estimatedCompletion);
            return (
              <tr key={repair.id}>
                <td className="px-6 py-4">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      repair.type === 'shoe' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {repair.type.charAt(0).toUpperCase() + repair.type.slice(1)}
                    </span>
                    <p className="mt-1 text-sm text-gray-500">{repair.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{repair.customerName}</div>
                  <div className="text-sm text-gray-500">{repair.contactNumber}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{getStaffName(repair.assignedStaffId || '')}</div>
                </td>
                <td className="px-6 py-4">
                  <div className={`flex items-center ${getStatusColor(daysLeft)}`}>
                    {daysLeft < 0 ? (
                      <AlertTriangle className="h-4 w-4 mr-1" />
                    ) : daysLeft === 0 ? (
                      <Clock className="h-4 w-4 mr-1" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm">
                      {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : 
                       daysLeft === 0 ? 'Due today' : 
                       `${daysLeft}d remaining`}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Due: {new Date(repair.estimatedCompletion).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(repair.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleCompleteRepair(repair.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Complete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work in Progress</h1>
          <p className="text-sm text-gray-500 mt-1">
            {repairs.length} orders being processed
          </p>
        </div>
      </div>

      {renderListView()}
      
      {repairs.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={repairs.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default WorkInProgress;
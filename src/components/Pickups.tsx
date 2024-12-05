import React, { useState } from 'react';
import { Phone, Mail, DollarSign, User, CheckCircle, Clock, LayoutGrid, LayoutList, Calendar as CalendarIcon } from 'lucide-react';
import type { RepairItem } from '../types';
import Calendar from 'react-calendar';
import { Pagination } from './Pagination';
import 'react-calendar/dist/Calendar.css';

const ITEMS_PER_PAGE = 10;

export const mockPickups: RepairItem[] = [
  {
    id: '1',
    type: 'shoe',
    customerName: 'William Taylor',
    contactNumber: '555-0129',
    description: 'Heel replacement and polishing',
    status: 'ready-for-pickup',
    dateReceived: '2024-03-08',
    estimatedCompletion: '2024-03-10',
    price: 55.00,
    assignedStaffId: '1',
    selectedServices: ['1'],
    balanceDue: 25.00
  },
  {
    id: '2',
    type: 'bag',
    customerName: 'Elizabeth Anderson',
    contactNumber: '555-0130',
    description: 'Complete leather restoration',
    status: 'ready-for-pickup',
    dateReceived: '2024-03-09',
    estimatedCompletion: '2024-03-11',
    price: 120.00,
    assignedStaffId: '2',
    selectedServices: ['3', '4'],
    balanceDue: 60.00
  }
];

export function Pickups() {
  const [pickups] = useState<RepairItem[]>(mockPickups);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPickups = pickups.filter(pickup =>
    pickup.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pickup.contactNumber.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredPickups.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPickups = filteredPickups.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedPickups.map((pickup) => (
        <div key={pickup.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{pickup.customerName}</h3>
              <p className="text-sm text-gray-500">{pickup.description}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              pickup.type === 'shoe' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {pickup.type}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Phone className="h-4 w-4 mr-2" />
              {pickup.contactNumber}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <DollarSign className="h-4 w-4 mr-2" />
              Balance Due: ${pickup.balanceDue?.toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Balance Due
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ready Since
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedPickups.map((pickup) => (
            <tr key={pickup.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{pickup.customerName}</div>
                <div className="text-sm text-gray-500">{pickup.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  pickup.type === 'shoe' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {pickup.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pickup.contactNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${pickup.balanceDue?.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(pickup.estimatedCompletion).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCalendarView = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        className="w-full"
      />
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Pickups for {selectedDate.toLocaleDateString()}
        </h3>
        <div className="space-y-4">
          {filteredPickups
            .filter(pickup => pickup.estimatedCompletion === selectedDate.toISOString().split('T')[0])
            .map((pickup) => (
              <div key={pickup.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{pickup.customerName}</h4>
                    <p className="text-sm text-gray-500">{pickup.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pickup.type === 'shoe' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {pickup.type}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ready for Pickup</h1>
        <div className="flex items-center space-x-2 border border-gray-300 rounded-md">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-500'}`}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-500'}`}
          >
            <LayoutList className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`p-2 ${viewMode === 'calendar' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-500'}`}
          >
            <CalendarIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? renderGridView() : viewMode === 'list' ? renderListView() : renderCalendarView()}
      
      {filteredPickups.length > ITEMS_PER_PAGE && viewMode !== 'calendar' && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPickups.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default Pickups;
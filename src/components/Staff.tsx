import React, { useState } from 'react';
import { Users, PlusCircle, Briefcase, Mail, Target, TrendingUp, AlertCircle, LayoutGrid, LayoutList } from 'lucide-react';
import type { Staff } from '../types';
import StaffModal from './StaffModal';
import StaffTargetModal from './StaffTargetModal';
import { Pagination } from './Pagination';

const ITEMS_PER_PAGE = 10;
const DAILY_TARGET = 750000;

const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'Mike Johnson',
    email: 'mike@repairpro.com',
    role: 'technician',
    specialization: ['shoe', 'bag'],
    active: true,
    currentWorkload: 3,
    dailyTarget: DAILY_TARGET,
    currentProgress: 680000
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@repairpro.com',
    role: 'technician',
    specialization: ['shoe'],
    active: true,
    currentWorkload: 2,
    dailyTarget: DAILY_TARGET,
    currentProgress: 725000
  }
];

export function Staff() {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(staff.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStaff = staff.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddStaff = (staffMember: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
      ...staffMember,
      id: (staff.length + 1).toString(),
      dailyTarget: DAILY_TARGET,
      currentProgress: 0
    };
    setStaff([...staff, newStaff]);
  };

  const handleEditStaff = (staffMember: Staff) => {
    setStaff(staff.map(s => s.id === staffMember.id ? staffMember : s));
  };

  const handleUpdateTarget = (staffId: string, newProgress: number) => {
    setStaff(staff.map(s => s.id === staffId ? { ...s, currentProgress: newProgress } : s));
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedStaff.map((member) => {
        const progressPercentage = Math.round((member.currentProgress / member.dailyTarget) * 100);
        return (
          <div key={member.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-indigo-900/50 flex items-center justify-center">
                <Users className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-white">{member.name}</h3>
                <p className="text-sm text-gray-400">{member.role}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-300">
                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                <span>Current workload: {member.currentWorkload} orders</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Target className="h-4 w-4 text-gray-500 mr-2" />
                <span>Daily Progress: ${(member.currentProgress / 1000).toFixed(0)}k / ${(member.dailyTarget / 1000).toFixed(0)}k</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {member.specialization.map((spec) => (
                  <span
                    key={spec}
                    className="px-2 py-0.5 text-xs rounded bg-gray-700 text-gray-300"
                  >
                    {spec.charAt(0).toUpperCase() + spec.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-300">Daily Target Progress</span>
                <span className={`text-sm font-medium ${
                  progressPercentage >= 100 ? 'text-green-500' :
                  progressPercentage >= 90 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    progressPercentage >= 100 ? 'bg-green-500' :
                    progressPercentage >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
              <button
                onClick={() => {
                  setEditingStaff(member);
                  setIsModalOpen(true);
                }}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Edit Details
              </button>
              <button
                onClick={() => {
                  setSelectedStaff(member);
                  setIsTargetModalOpen(true);
                }}
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Update Progress
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-1">
      {paginatedStaff.map((member) => {
        const progressPercentage = Math.round((member.currentProgress / member.dailyTarget) * 100);
        return (
          <div key={member.id} className="grid grid-cols-5 gap-4 p-4 hover:bg-gray-750 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <div className="font-medium text-white">{member.name}</div>
                <div className="text-sm text-gray-400">{member.email}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div>
                <div className="text-white capitalize">{member.role}</div>
                <div className="flex gap-2 mt-1">
                  {member.specialization.map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-0.5 text-xs rounded bg-gray-700 text-gray-300"
                    >
                      {spec.charAt(0).toUpperCase() + spec.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center text-white">
              {member.currentWorkload} orders
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      progressPercentage >= 100 ? 'bg-green-500' :
                      progressPercentage >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-sm whitespace-nowrap">
                <span className={
                  progressPercentage >= 100 ? 'text-green-500' :
                  progressPercentage >= 90 ? 'text-yellow-500' : 'text-red-500'
                }>
                  {progressPercentage}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => {
                  setSelectedStaff(member);
                  setIsTargetModalOpen(true);
                }}
                className="text-indigo-400 hover:text-indigo-300"
              >
                Update Target
              </button>
              <button
                onClick={() => {
                  setEditingStaff(member);
                  setIsModalOpen(true);
                }}
                className="text-indigo-400 hover:text-indigo-300"
              >
                Edit
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">Daily target per staff: ${(DAILY_TARGET / 1000).toFixed(0)}k</p>
        </div>
        <div className="flex items-center space-x-4">
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
          </div>
          <button
            onClick={() => {
              setEditingStaff(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Staff Member
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? renderGridView() : renderListView()}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={staff.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStaff(null);
        }}
        onSave={editingStaff ? handleEditStaff : handleAddStaff}
        staff={editingStaff}
      />

      <StaffTargetModal
        isOpen={isTargetModalOpen}
        onClose={() => {
          setIsTargetModalOpen(false);
          setSelectedStaff(null);
        }}
        onSave={handleUpdateTarget}
        staff={selectedStaff}
        dailyTarget={DAILY_TARGET}
      />
    </div>
  );
}

export default Staff;
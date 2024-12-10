import React from 'react';
import { Grid, List } from 'lucide-react';
import Staff from '../components/Staff';

const StaffPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">Staff Management</h1>
          <p className="text-gray-400">Daily target per staff: $750k</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded bg-gray-800 hover:bg-gray-700">
            <Grid className="h-5 w-5" />
          </button>
          <button className="p-2 rounded bg-gray-800 hover:bg-gray-700">
            <List className="h-5 w-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white">
            <span className="text-xl">+</span>
            Add Staff Member
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-700 text-gray-400">
          <div>STAFF MEMBER</div>
          <div>ROLE & SPECIALIZATION</div>
          <div>WORKLOAD</div>
          <div>DAILY TARGET PROGRESS</div>
          <div>ACTIONS</div>
        </div>
        <Staff />
      </div>
    </div>
  );
};

export default StaffPage;

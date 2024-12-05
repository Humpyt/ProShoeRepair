import React from 'react';
import { BarChart2, Download } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-400">Generate and view business reports</p>
        </div>
        <button className="btn-bevel accent-primary px-6 py-3 rounded-lg flex items-center">
          <Download className="h-5 w-5 mr-2" />
          Export Reports
        </button>
      </div>

      <div className="card-bevel p-6">
        <h2 className="text-lg font-semibold mb-4 text-indigo-400">Available Reports</h2>
        {/* Add your reports content here */}
      </div>
    </div>
  );
}
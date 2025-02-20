import React, { useState } from 'react';

export default function AssemblyPage() {
  const [assemblyQueue, setAssemblyQueue] = useState([]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assembly Queue</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Pending Assembly</h2>
          <div className="space-y-4">
            {/* Add assembly items here */}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">In Progress</h2>
          <div className="space-y-4">
            {/* Add in-progress items here */}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Completed Today</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Ticket #</th>
              <th className="text-left p-2">Item</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Completed At</th>
              <th className="text-left p-2">Assembled By</th>
            </tr>
          </thead>
          <tbody>
            {/* Add completed items here */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

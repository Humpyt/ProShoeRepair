import React, { useState } from 'react';

export default function RackingPage() {
  const [rackLocation, setRackLocation] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');

  const handleAssignRack = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement rack assignment logic
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Racking System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Assign Rack Location</h2>
          <form onSubmit={handleAssignRack} className="space-y-4">
            <div>
              <label className="block mb-2">Ticket Number</label>
              <input
                type="text"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-700"
                placeholder="Enter ticket number"
              />
            </div>
            <div>
              <label className="block mb-2">Rack Location</label>
              <input
                type="text"
                value={rackLocation}
                onChange={(e) => setRackLocation(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-700"
                placeholder="Enter rack location"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Assign Location
            </button>
          </form>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Rack Overview</h2>
          <div className="grid grid-cols-5 gap-2">
            {/* Add rack visualization here */}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Assignments</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Ticket #</th>
              <th className="text-left p-2">Location</th>
              <th className="text-left p-2">Assigned At</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Add recent assignments here */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

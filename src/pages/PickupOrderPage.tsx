import React, { useState } from 'react';

export default function PickupOrderPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement pickup order search
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pickup Orders</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ticket number or customer name"
            className="flex-1 p-2 border rounded-lg bg-gray-700"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Ready for Pickup</h2>
          <div className="space-y-4">
            {/* Add ready for pickup items here */}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Picked Up Today</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2">Ticket #</th>
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Time</th>
                <th className="text-left p-2">Payment</th>
              </tr>
            </thead>
            <tbody>
              {/* Add picked up items here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

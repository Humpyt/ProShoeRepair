import React, { useState } from 'react';

export default function DeliveriesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Deliveries</h1>

      <div className="mb-6">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded-lg bg-gray-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Pending Deliveries</h2>
          <div className="space-y-4">
            {/* Add pending delivery items here */}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Out for Delivery</h2>
          <div className="space-y-4">
            {/* Add out for delivery items here */}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Completed Deliveries</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Ticket #</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Address</th>
              <th className="text-left p-2">Delivery Time</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Add completed delivery items here */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

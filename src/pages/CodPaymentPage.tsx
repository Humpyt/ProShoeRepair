import React, { useState } from 'react';

export default function CodPaymentPage() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement COD payment processing
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">COD Payment</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Process Payment</h2>
          <form onSubmit={handlePayment} className="space-y-4">
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
              <label className="block mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-700"
                placeholder="Enter amount"
                step="0.01"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Process Payment
            </button>
          </form>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between p-2 bg-gray-700 rounded">
              <span>Total COD Payments Today</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-700 rounded">
              <span>Pending COD Payments</span>
              <span>$0.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Recent COD Payments</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Ticket #</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Add recent payments here */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

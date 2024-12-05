import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import itemRemainIcon from '../assets/icons/item-remain.svg';
import salesItemIcon from '../assets/icons/sales-item.svg';
import selectAllIcon from '../assets/icons/select-all.svg';
import cashIcon from '../assets/icons/cash.svg';
import creditCardIcon from '../assets/icons/credit-card.svg';
import checkIcon from '../assets/icons/check.svg';
import storeCardIcon from '../assets/icons/store-card.svg';

interface PickupTicket {
  ticketNo: string;
  date: string;
  day: string;
  pieces: number;
  rackNo?: string;
  total: number;
  items: {
    name: string;
    balance: number;
    status: 'D' | 'P' | 'R';  // Delivered, Pending, Ready
  }[];
}

export default function PickupPage() {
  const [tickets] = useState<PickupTicket[]>([
    {
      ticketNo: '100143',
      date: '09/11',
      day: 'SUN',
      pieces: 1,
      total: 0.05,
      items: []
    },
    {
      ticketNo: '100144',
      date: '10/01',
      day: 'SAT',
      pieces: 1,
      total: 5.36,
      items: []
    },
    {
      ticketNo: '100145',
      date: '10/01',
      day: 'SAT',
      pieces: 1,
      total: 9.69,
      items: [
        { name: 'Jump Suit', balance: 9.69, status: 'D' }
      ]
    }
  ]);

  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [creditAmount, setCreditAmount] = useState('6.00');
  const [adjustment, setAdjustment] = useState('0.00');
  const [numpadValue, setNumpadValue] = useState('');

  const handleNumpadClick = (value: string) => {
    if (value === 'C') {
      setNumpadValue('');
    } else {
      setNumpadValue(prev => prev + value);
    }
  };

  const getTotalSelected = () => {
    return tickets
      .filter(ticket => selectedTickets.includes(ticket.ticketNo))
      .reduce((sum, ticket) => sum + ticket.total, 0);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Left Panel */}
        <div className="col-span-7 space-y-4">
          {/* Tickets Table */}
          <div className="card-bevel p-4">
            <h2 className="text-lg font-semibold mb-4">Tickets</h2>
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left">Ticket No</th>
                  <th className="px-4 py-2 text-left">Ready</th>
                  <th className="px-4 py-2 text-center">Pcs</th>
                  <th className="px-4 py-2 text-left">Rack No</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr 
                    key={ticket.ticketNo}
                    className={`border-b border-gray-700 ${
                      selectedTickets.includes(ticket.ticketNo) ? 'bg-indigo-900' : ''
                    }`}
                    onClick={() => setSelectedTickets([ticket.ticketNo])}
                  >
                    <td className="px-4 py-2">{ticket.ticketNo}</td>
                    <td className="px-4 py-2">{`${ticket.date}\n${ticket.day}`}</td>
                    <td className="px-4 py-2 text-center">{ticket.pieces}</td>
                    <td className="px-4 py-2">{ticket.rackNo || ''}</td>
                    <td className="px-4 py-2 text-right">${ticket.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-4">
            <button className="btn-bevel accent-primary p-4 rounded-lg flex items-center justify-center space-x-2">
              <img src={itemRemainIcon} alt="" className="h-5 w-5" />
              <span>Item Remain</span>
            </button>
            <button className="btn-bevel accent-secondary p-4 rounded-lg flex items-center justify-center space-x-2">
              <img src={salesItemIcon} alt="" className="h-5 w-5" />
              <span>Sales Item</span>
            </button>
            <button className="btn-bevel bg-gray-700 p-4 rounded-lg">
              Select None
            </button>
            <button className="btn-bevel bg-gray-700 p-4 rounded-lg flex items-center justify-center space-x-2">
              <img src={selectAllIcon} alt="" className="h-5 w-5" />
              <span>Select All</span>
            </button>
          </div>

          {/* Detailed View */}
          <div className="card-bevel p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Detailed</h2>
              <div className="text-right">
                Selected: ${getTotalSelected().toFixed(2)}
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left">Ticket No</th>
                  <th className="px-4 py-2 text-center">C</th>
                  <th className="px-4 py-2 text-center">Pcs</th>
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {selectedTickets.map(ticketNo => {
                  const ticket = tickets.find(t => t.ticketNo === ticketNo);
                  return ticket?.items.map((item, idx) => (
                    <tr key={`${ticketNo}-${idx}`} className="border-b border-gray-700">
                      <td className="px-4 py-2">{ticketNo}</td>
                      <td className="px-4 py-2 text-center">{item.status}</td>
                      <td className="px-4 py-2 text-center">1</td>
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2 text-right">${item.balance.toFixed(2)}</td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-5 space-y-4">
          {/* Customer Info */}
          <div className="card-bevel p-4">
            <h2 className="text-lg font-semibold mb-2">test, test</h2>
          </div>

          {/* Tender Section */}
          <div className="card-bevel p-4">
            <h2 className="text-lg font-semibold mb-4">Tender</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Credit Amount</div>
                  <div className="btn-bevel bg-gray-700 p-2 rounded-lg">
                    ${creditAmount}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Amount Due</div>
                  <div className="btn-bevel bg-amber-100 text-black p-2 rounded-lg text-right">
                    $9.69
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Adjustment</div>
                  <div className="btn-bevel bg-gray-700 p-2 rounded-lg">
                    ${adjustment}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Tendered</div>
                  <div className="btn-bevel bg-green-100 text-black p-2 rounded-lg text-right">
                    $9.69
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-5 gap-4">
            <button className="btn-bevel accent-primary p-4 rounded-lg flex flex-col items-center justify-center space-y-2">
              <img src={cashIcon} alt="" className="h-6 w-6" />
              <span>Cash</span>
            </button>
            <button className="btn-bevel accent-secondary p-4 rounded-lg flex flex-col items-center justify-center space-y-2">
              <img src={creditCardIcon} alt="" className="h-6 w-6" />
              <span>Credit Card</span>
            </button>
            <button className="btn-bevel accent-tertiary p-4 rounded-lg flex flex-col items-center justify-center space-y-2">
              <img src={checkIcon} alt="" className="h-6 w-6" />
              <span>Check</span>
            </button>
            <button className="btn-bevel bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center space-y-2">
              <img src={storeCardIcon} alt="" className="h-6 w-6" />
              <span>Store Card</span>
            </button>
            <button className="btn-bevel bg-gray-700 p-4 rounded-lg">
              On Account
            </button>
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-4 gap-4">
            {[7,8,9,'$10',4,5,6,'$20',1,2,3,'$50','C',0,'00','$100'].map((btn, idx) => (
              <button
                key={idx}
                onClick={() => handleNumpadClick(btn.toString())}
                className="btn-bevel bg-gray-700 p-4 rounded-lg text-xl font-medium"
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="grid grid-cols-3 gap-4">
            <button className="btn-bevel accent-primary p-4 rounded-lg">Close</button>
            <button className="btn-bevel accent-secondary p-4 rounded-lg">Open Drawer</button>
            <button className="btn-bevel accent-tertiary p-4 rounded-lg">Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
}
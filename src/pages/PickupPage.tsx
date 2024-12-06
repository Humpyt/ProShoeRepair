import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { useOperation } from '../contexts/OperationContext';
import { Search, Package, DollarSign, CreditCard, Banknote, CheckSquare, Gift, X, Plus, Minus, RefreshCw } from 'lucide-react';

interface PickupTicket {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  pieces: number;
  rackNo?: string;
  total: number;
  status: 'pending' | 'ready' | 'completed';
  items: {
    category: string;
    color: string;
    services: {
      name: string;
      price: number;
    }[];
  }[];
}

export default function PickupPage() {
  const { operations } = useOperation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'check' | 'store_credit'>('cash');
  const [amountTendered, setAmountTendered] = useState<number>(0);
  const [showNumpad, setShowNumpad] = useState(false);
  const [discount, setDiscount] = useState<number>(0);

  // Convert operations to pickup tickets
  const tickets: PickupTicket[] = operations
    .filter(op => op.status === 'pending' || op.status === 'completed')
    .map(op => ({
      id: op.id,
      customerName: op.customer?.name || 'Unknown',
      customerPhone: op.customer?.phone || '',
      date: new Date(op.createdAt).toLocaleDateString(),
      pieces: op.shoes.length,
      total: op.totalAmount / 100,
      status: op.status,
      items: op.shoes.map(shoe => ({
        category: shoe.category,
        color: shoe.color,
        services: shoe.services.map(service => ({
          name: service.name,
          price: service.price / 100,
        })),
      })),
    }));

  // Filter tickets based on search term
  const filteredTickets = tickets.filter(ticket => 
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customerPhone.includes(searchTerm)
  );

  const selectedTotal = selectedTickets.reduce((sum, ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId);
    return sum + (ticket?.total || 0);
  }, 0);

  const finalAmount = selectedTotal - discount;
  const change = Math.max(0, amountTendered - finalAmount);

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTickets(filteredTickets.map(t => t.id));
  };

  const handleSelectNone = () => {
    setSelectedTickets([]);
  };

  const handleNumpadClick = (value: string) => {
    if (value === 'C') {
      setAmountTendered(0);
    } else if (value === '.') {
      if (!amountTendered.toString().includes('.')) {
        setAmountTendered(Number(amountTendered.toString() + '.'));
      }
    } else {
      const newValue = Number(amountTendered.toString() + value);
      setAmountTendered(newValue);
    }
  };

  const handlePayment = async () => {
    if (selectedTickets.length === 0) {
      alert('Please select tickets to process payment');
      return;
    }

    if (amountTendered < finalAmount && paymentMethod === 'cash') {
      alert('Amount tendered must be greater than or equal to the total amount');
      return;
    }

    try {
      // Process payment for each selected ticket
      for (const ticketId of selectedTickets) {
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) continue;

        await fetch(`http://localhost:3000/api/operations/${ticketId}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethod,
            amountPaid: ticket.total,
            discount: discount / selectedTickets.length, // Split discount evenly
          }),
        });
      }

      // Clear selections and reset form
      setSelectedTickets([]);
      setAmountTendered(0);
      setDiscount(0);
      setShowNumpad(false);
      
      alert('Payment processed successfully!');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Left Panel */}
        <div className="col-span-7 space-y-4">
          {/* Search and Stats */}
          <div className="card-bevel p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets by ID or customer..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-4 ml-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-400">Total Items: {filteredTickets.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-400">
                    Value: {formatCurrency(filteredTickets.reduce((sum, t) => sum + t.total, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="card-bevel p-4 overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Ticket No</th>
                    <th className="px-4 py-2 text-left">Customer</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-center">Pieces</th>
                    <th className="px-4 py-2 text-right">Total</th>
                    <th className="px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr 
                      key={ticket.id}
                      className={`border-b border-gray-700 cursor-pointer hover:bg-gray-800 ${
                        selectedTickets.includes(ticket.id) ? 'bg-indigo-900' : ''
                      }`}
                      onClick={() => handleSelectTicket(ticket.id)}
                    >
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {`TKT-${ticket.id.slice(-6).toUpperCase()}`}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="text-sm font-medium">{ticket.customerName}</div>
                        <div className="text-xs text-gray-400">{ticket.customerPhone}</div>
                      </td>
                      <td className="px-4 py-2">{ticket.date}</td>
                      <td className="px-4 py-2 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700">
                          {ticket.pieces}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        {formatCurrency(ticket.total)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${ticket.status === 'ready' ? 'bg-green-100 text-green-800' : ''}
                          ${ticket.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-4">
            <button 
              className="btn-bevel p-4 rounded-lg flex items-center justify-center space-x-2"
              onClick={handleSelectAll}
            >
              <Plus className="h-5 w-5" />
              <span>Select All</span>
            </button>
            <button 
              className="btn-bevel p-4 rounded-lg flex items-center justify-center space-x-2"
              onClick={handleSelectNone}
            >
              <Minus className="h-5 w-5" />
              <span>Select None</span>
            </button>
            <button className="btn-bevel p-4 rounded-lg flex items-center justify-center space-x-2">
              <RefreshCw className="h-5 w-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Right Panel - Payment */}
        <div className="col-span-5 space-y-4">
          {/* Payment Summary */}
          <div className="card-bevel p-4">
            <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Selected Items:</span>
                <span className="text-lg font-medium">{selectedTickets.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Subtotal:</span>
                <span className="text-lg font-medium">{formatCurrency(selectedTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Discount:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    className="w-24 bg-gray-700 rounded px-2 py-1 text-right"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    min="0"
                    max={selectedTotal}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Due:</span>
                <span>{formatCurrency(finalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card-bevel p-4">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`btn-bevel p-4 rounded-lg flex items-center justify-center space-x-2 ${
                  paymentMethod === 'cash' ? 'accent-primary' : ''
                }`}
                onClick={() => setPaymentMethod('cash')}
              >
                <Banknote className="h-5 w-5" />
                <span>Cash</span>
              </button>
              <button
                className={`btn-bevel p-4 rounded-lg flex items-center justify-center space-x-2 ${
                  paymentMethod === 'card' ? 'accent-primary' : ''
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard className="h-5 w-5" />
                <span>Card</span>
              </button>
              <button
                className={`btn-bevel p-4 rounded-lg flex items-center justify-center space-x-2 ${
                  paymentMethod === 'check' ? 'accent-primary' : ''
                }`}
                onClick={() => setPaymentMethod('check')}
              >
                <CheckSquare className="h-5 w-5" />
                <span>Check</span>
              </button>
              <button
                className={`btn-bevel p-4 rounded-lg flex items-center justify-center space-x-2 ${
                  paymentMethod === 'store_credit' ? 'accent-primary' : ''
                }`}
                onClick={() => setPaymentMethod('store_credit')}
              >
                <Gift className="h-5 w-5" />
                <span>Store Credit</span>
              </button>
            </div>
          </div>

          {/* Amount Tendered */}
          {paymentMethod === 'cash' && (
            <div className="card-bevel p-4">
              <h2 className="text-lg font-semibold mb-4">Amount Tendered</h2>
              <div className="space-y-4">
                <div 
                  className="btn-bevel bg-gray-700 p-4 rounded-lg text-right text-2xl cursor-pointer"
                  onClick={() => setShowNumpad(true)}
                >
                  {formatCurrency(amountTendered)}
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span>Change:</span>
                  <span className="font-medium text-green-400">{formatCurrency(change)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Process Payment Button */}
          <button
            className="w-full btn-bevel accent-primary p-4 rounded-lg flex items-center justify-center space-x-2 text-lg"
            onClick={handlePayment}
            disabled={selectedTickets.length === 0 || (paymentMethod === 'cash' && amountTendered < finalAmount)}
          >
            <DollarSign className="h-6 w-6" />
            <span>Process Payment</span>
          </button>
        </div>
      </div>

      {/* Numpad Modal */}
      {showNumpad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Enter Amount</h2>
              <button 
                onClick={() => setShowNumpad(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg text-right text-3xl mb-4">
              {formatCurrency(amountTendered)}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'C'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumpadClick(num.toString())}
                  className="btn-bevel p-4 rounded-lg text-xl font-medium"
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              className="w-full btn-bevel accent-primary p-4 rounded-lg mt-4"
              onClick={() => setShowNumpad(false)}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
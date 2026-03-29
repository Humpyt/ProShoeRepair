import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { useOperation } from '../contexts/OperationContext';
import { PaymentModal } from '../components/PaymentModal';
import { Search, Package, DollarSign, CreditCard, CheckSquare, X, Clock, User, Gift, Minus } from 'lucide-react';

interface PickupTicket {
  id: string;
  customerName: string;
  customerPhone: string;
  customerId?: string;
  customerBalance?: number;
  date: string;
  pieces: number;
  rackNo?: string;
  total: number;
  originalTotal: number;
  discount: number;
  paidAmount: number;
  status: 'pending' | 'ready' | 'completed';
  items: {
    id: string;
    category: string;
    color: string;
    description: string;
    services: {
      name: string;
      price: number;
    }[];
  }[];
}

export default function PickupPage() {
  const { operations, refreshOperations, updateOperation } = useOperation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Convert operations to pickup tickets - only pending (awaiting pickup)
  const tickets: PickupTicket[] = operations
    .filter(op => op.status === 'pending')
    .map(op => {
      const discount = (op as any).discount || 0;
      const originalTotal = op.totalAmount + discount;
      return {
        id: op.id,
        customerName: op.customer?.name || 'Unknown',
        customerPhone: op.customer?.phone || '',
        customerId: op.customer?.id,
        customerBalance: op.customer?.accountBalance || 0,
        date: new Date(op.createdAt).toLocaleDateString(),
        pieces: op.shoes.length,
        total: op.totalAmount,
        originalTotal: originalTotal,
        discount: discount,
        paidAmount: op.paidAmount || 0,
        status: op.status,
        items: op.shoes.map(shoe => ({
          id: shoe.id,
          category: shoe.category,
          color: shoe.color,
          description: shoe.description || shoe.category,
          services: shoe.services.map(service => ({
            name: service.name,
            price: service.price,
          })),
        })),
      };
    });

  // Get selected ticket details
  const selected = tickets.find(t => t.id === selectedTicket);

  // Filter tickets based on search term
  const filteredTickets = tickets.filter(ticket =>
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customerPhone.includes(searchTerm)
  );

  // Calculate totals for selected ticket
  const selectedSubtotal = selected?.total || 0;
  const selectedDiscount = selected?.discount || 0;
  const selectedPaid = selected?.paidAmount || 0;
  const selectedBalance = Math.max(0, selectedSubtotal - selectedPaid);
  const finalAmount = selectedSubtotal - selectedDiscount;

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicket(prev => prev === ticketId ? null : ticketId);
  };

  const handleMarkPickedUp = async (ticketId: string) => {
    try {
      await updateOperation(ticketId, { status: 'completed' });
      await refreshOperations();
      setSelectedTicket(null);
    } catch (error) {
      console.error('Failed to mark as picked up:', error);
      alert('Failed to mark as picked up. Please try again.');
    }
  };

  const handlePaymentComplete = async (payments: Array<{ method: string; amount: number }>) => {
    try {
      if (!selectedTicket) return;

      const response = await fetch(`http://localhost:3000/api/operations/${selectedTicket}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payments }),
      });
      if (!response.ok) {
        throw new Error('Payment failed');
      }

      await refreshOperations();
      setSelectedTicket(null);
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className="col-span-7 space-y-6">
          {/* Search and Stats */}
          <div className="card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets by ID or customer..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-700/50 rounded-xl border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-6 ml-6">
                <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-3">
                  <Package className="h-5 w-5 text-indigo-400" />
                  <span className="text-gray-300 font-medium">{filteredTickets.length}</span>
                </div>
                <div className="flex items-center space-x-3 bg-gray-800/50 rounded-lg p-3">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300 font-medium">
                    {formatCurrency(filteredTickets.reduce((sum, t) => sum + t.total, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              <table className="w-full">
                <thead className="bg-gray-800/80 backdrop-blur-sm sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Ticket No</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Pieces</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className={`group cursor-pointer transition-all ${
                        selectedTicket === ticket.id
                          ? 'bg-indigo-900/40 hover:bg-indigo-900/60'
                          : 'hover:bg-gray-800/60'
                      }`}
                      onClick={() => handleSelectTicket(ticket.id)}
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 group-hover:bg-gray-600">
                          {`TKT-${ticket.id.slice(-6).toUpperCase()}`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-200">{ticket.customerName}</div>
                          <div className="text-xs text-gray-400">{ticket.customerPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{ticket.date}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-300">{ticket.pieces}</td>
                      <td className="px-6 py-4 text-right">
                        {ticket.discount > 0 ? (
                          <div>
                            <div className="text-xs text-gray-400 line-through">
                              {formatCurrency(ticket.originalTotal)}
                            </div>
                            <div className="text-sm font-medium text-green-400">
                              {formatCurrency(ticket.total)}
                            </div>
                            <div className="text-xs text-pink-400">
                              -{formatCurrency(ticket.discount)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-gray-200">
                            {formatCurrency(ticket.total)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium
                          ${ticket.status === 'completed'
                            ? 'bg-green-900/40 text-green-400'
                            : 'bg-yellow-900/40 text-yellow-400'
                          }`}
                        >
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {ticket.status !== 'completed' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkPickedUp(ticket.id);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            Taken
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel - Cart Summary */}
        <div className="col-span-5 space-y-4">
          {selected ? (
            <>
              {/* Cart Summary Header */}
              <div className="card-bevel p-6 bg-gradient-to-br from-emerald-950/50 via-gray-900 to-gray-900 border-t-4 border-t-emerald-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-900/50 border border-emerald-700/50">
                      <Package size={20} className="text-emerald-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-200">Pickup Summary</h2>
                  </div>
                  <div className="flex items-center space-x-3 bg-emerald-900/30 rounded-lg px-4 py-2 border border-emerald-800/50">
                    <span className="text-gray-400 text-sm">Balance:</span>
                    <span className="text-emerald-400 font-semibold">{formatCurrency(selectedBalance)}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 border-l-4 border-l-cyan-500 mb-4">
                  <div className="flex items-center space-x-3">
                    <User size={18} className="text-cyan-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-200">{selected.customerName}</p>
                      <p className="text-xs text-gray-400">{selected.customerPhone}</p>
                    </div>
                  </div>
                  {selected.customerBalance && selected.customerBalance > 0 && (
                    <div className="flex items-center mt-2 pt-2 border-t border-gray-700">
                      <Gift size={14} className="text-emerald-400 mr-2" />
                      <span className="text-xs text-emerald-400">
                        Credit Available: {formatCurrency(selected.customerBalance)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Ticket Info */}
                <div className="flex items-center justify-between text-sm mb-4 pb-3 border-b border-gray-700">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock size={14} />
                    <span>{selected.date}</span>
                    <span className="text-gray-600">|</span>
                    <Package size={14} />
                    <span>{selected.pieces} piece(s)</span>
                  </div>
                  <span className="text-xs font-mono text-gray-500">TKT-{selected.id.slice(-6).toUpperCase()}</span>
                </div>

                {/* Items List */}
                <div className="space-y-3 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                  {selected.items.map((item) => (
                    <div key={item.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-200">{item.description}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {item.color && item.color !== 'none' && (
                              <span className="text-xs text-gray-400 capitalize">{item.color}</span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-green-400">
                          {formatCurrency(item.services.reduce((sum, s) => sum + s.price, 0))}
                        </span>
                      </div>
                      {item.services.map((service, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-gray-500 mt-1 pl-2 border-l-2 border-gray-700">
                          <span>{service.name}</span>
                          <span>{formatCurrency(service.price)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Card */}
              <div className="card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-200">{formatCurrency(selectedSubtotal)}</span>
                  </div>
                  {selectedDiscount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Discount</span>
                      <span className="text-pink-400">-{formatCurrency(selectedDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Paid</span>
                    <span className="text-emerald-400">{formatCurrency(selectedPaid)}</span>
                  </div>
                  <div className="h-px bg-gray-700 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-200 font-medium">Balance</span>
                    <span className="text-lg font-bold text-emerald-400">{formatCurrency(selectedBalance)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {selectedBalance > 0 ? (
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 p-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition-colors"
                    >
                      <CreditCard size={20} />
                      <span>Record Payment</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 p-4 bg-emerald-900/30 border border-emerald-500/30 rounded-lg text-emerald-400">
                      <CheckSquare size={20} />
                      <span className="font-medium">Fully Paid</span>
                    </div>
                  )}

                  {selected.status !== 'completed' && (
                    <button
                      onClick={() => handleMarkPickedUp(selected.id)}
                      className="w-full flex items-center justify-center gap-2 p-4 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium transition-colors"
                    >
                      <CheckSquare size={20} />
                      <span>Mark as Taken</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900 h-full flex flex-col items-center justify-center text-center">
              <Package size={48} className="text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No Ticket Selected</h3>
              <p className="text-sm text-gray-500">Click on a ticket from the list to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={selectedBalance}
        customer={selected ? {
          id: selected.customerId,
          name: selected.customerName,
          accountBalance: selected.customerBalance || 0
        } : null}
        onComplete={handlePaymentComplete}
      />
    </div>
  );
}
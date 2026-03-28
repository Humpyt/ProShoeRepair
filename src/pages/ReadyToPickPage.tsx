import { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { useOperation } from '../contexts/OperationContext';
import { Search, Package, DollarSign, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ReadyToPickPage() {
  const { operations } = useOperation();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Convert operations to pickup tickets, filtering by 'ready' OR if it's generally expected for pickup
  // We'll filter strictly by 'ready' status based on typical convention
  const tickets = operations
    .filter(op => (op.status as string) === 'ready' || op.status === 'completed')
    .map(op => {
      const discount = (op as any).discount || 0;
      const originalTotal = op.totalAmount + discount;
      return {
        id: op.id,
        customerName: op.customer?.name || 'Unknown',
        customerPhone: op.customer?.phone || '',
        date: new Date(op.createdAt).toLocaleDateString(),
        pieces: op.shoes.length,
        total: op.totalAmount,
        originalTotal: originalTotal,
        discount: discount,
        status: op.status,
      };
    });

  // Filter tickets based on search term
  const filteredTickets = tickets.filter(ticket => 
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customerPhone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <CheckCircle className="text-emerald-400" size={32} />
              Ready To Pick Today
            </h1>
            <p className="text-gray-400 mt-2">Displaying all operations currently ready for customer pickup.</p>
          </div>
          <button
            onClick={() => navigate('/pickup')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-colors font-medium"
          >
            Go to Pickup System
          </button>
        </div>

        {/* Search and Stats */}
        <div className="card-bevel p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/5 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search ready tickets by ID or customer..."
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 rounded-xl border border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-6 w-full md:w-auto">
              <div className="flex flex-1 md:flex-none items-center space-x-3 bg-gray-800/50 rounded-xl border border-white/5 p-4 shadow-inner">
                <Package className="h-6 w-6 text-emerald-400" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Ready Items</p>
                  <span className="text-white font-bold text-lg">{filteredTickets.length}</span>
                </div>
              </div>
              <div className="flex flex-1 md:flex-none items-center space-x-3 bg-gray-800/50 rounded-xl border border-white/5 p-4 shadow-inner">
                <DollarSign className="h-6 w-6 text-indigo-400" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Pending Value</p>
                  <span className="text-white font-bold text-lg">
                    {formatCurrency(filteredTickets.reduce((sum, t) => sum + t.total, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="card-bevel bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/5 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-gray-800/80 backdrop-blur-sm border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Ticket No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Pieces</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredTickets.map((ticket) => (
                  <tr 
                    key={ticket.id}
                    className="hover:bg-gray-800/60 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-mono font-bold bg-gray-700/50 text-emerald-400 border border-emerald-500/20">
                        {`TKT-${ticket.id.slice(-6).toUpperCase()}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-white">{ticket.customerName}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{ticket.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 font-medium">{ticket.date}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-sm font-bold text-gray-300">
                        {ticket.pieces}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {ticket.discount > 0 ? (
                        <div>
                          <div className="text-xs text-gray-500 line-through">
                            {formatCurrency(ticket.originalTotal)}
                          </div>
                          <div className="text-sm font-bold text-emerald-400">
                            {formatCurrency(ticket.total)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm font-bold text-gray-200">
                          {formatCurrency(ticket.total)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Ready To Pick
                      </span>
                    </td>
                  </tr>
                ))}
                
                {filteredTickets.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No ready tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

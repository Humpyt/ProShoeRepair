import React, { useState } from 'react';
import { useOperation } from '../contexts/OperationContext';
import { formatCurrency } from '../utils/formatCurrency';
import { Search, Package, Calendar, Phone, User, Tag } from 'lucide-react';

interface SearchTicket {
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

export default function TicketSearchPage() {
  const { operations } = useOperation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'ticket' | 'customer' | 'phone'>('ticket');
  const [selectedTicket, setSelectedTicket] = useState<SearchTicket | null>(null);

  // Convert operations to search tickets
  const tickets: SearchTicket[] = operations.map(op => ({
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

  // Filter tickets based on search query and type
  const filteredTickets = tickets.filter(ticket => {
    const query = searchQuery.toLowerCase();
    switch (searchType) {
      case 'ticket':
        return ticket.id.toLowerCase().includes(query);
      case 'customer':
        return ticket.customerName.toLowerCase().includes(query);
      case 'phone':
        return ticket.customerPhone.includes(query);
      default:
        return false;
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the filter above
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Search and Results */}
      <div className="w-2/3 p-6 border-r">
        <h1 className="text-2xl font-bold mb-6">Ticket Search</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Search by ${searchType}...`}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'ticket' | 'customer' | 'phone')}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ticket">Ticket #</option>
              <option value="customer">Customer Name</option>
              <option value="phone">Phone</option>
            </select>
          </div>
        </form>

        {/* Results List */}
        <div className="space-y-4">
          {filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedTicket?.id === ticket.id
                  ? 'bg-blue-50 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold">Ticket #{ticket.id}</div>
                <div className={`px-2 py-1 rounded-full text-sm ${
                  ticket.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : ticket.status === 'ready'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {ticket.customerName}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {ticket.customerPhone}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {ticket.date}
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {ticket.pieces} items
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Ticket Details */}
      <div className="w-1/3 p-6">
        {selectedTicket ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Ticket Details</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold mb-2">Customer Information</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Name:</span>
                  </div>
                  <div>{selectedTicket.customerName}</div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">Phone:</span>
                  </div>
                  <div>{selectedTicket.customerPhone}</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold mb-2">Items</div>
                {selectedTicket.items.map((item, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4" />
                      <span className="font-medium">
                        {item.category} - {item.color}
                      </span>
                    </div>
                    <div className="pl-6">
                      {item.services.map((service, sIndex) => (
                        <div key={sIndex} className="flex justify-between text-sm">
                          <span>{service.name}</span>
                          <span>{formatCurrency(service.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>{formatCurrency(selectedTicket.total)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a ticket to view details
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Search, Plus, LayoutGrid, LayoutList } from 'lucide-react';
import type { Customer } from '../types';
import CustomerModal from './CustomerModal';
import { Pagination } from './Pagination';

const ITEMS_PER_PAGE = 10;

const mockCustomers: Customer[] = [
  { id: '1', name: 'John Doe', contact: '555-0123', email: 'john@example.com', totalOrders: 3 },
  { id: '2', name: 'Jane Smith', contact: '555-0124', email: 'jane@example.com', totalOrders: 5 },
  { id: '3', name: 'Michael Brown', contact: '555-0125', email: 'michael@example.com', totalOrders: 2 },
  { id: '4', name: 'Sarah Johnson', contact: '555-0126', email: 'sarah@example.com', totalOrders: 7 },
  { id: '5', name: 'Robert Wilson', contact: '555-0127', email: 'robert@example.com', totalOrders: 4 },
  { id: '6', name: 'Emily Davis', contact: '555-0128', email: 'emily@example.com', totalOrders: 6 },
  { id: '7', name: 'James Miller', contact: '555-0129', email: 'james@example.com', totalOrders: 3 },
  { id: '8', name: 'Lisa Anderson', contact: '555-0130', email: 'lisa@example.com', totalOrders: 8 },
  { id: '9', name: 'David Taylor', contact: '555-0131', email: 'david@example.com', totalOrders: 2 },
  { id: '10', name: 'Jennifer White', contact: '555-0132', email: 'jennifer@example.com', totalOrders: 5 },
  { id: '11', name: 'Daniel Lee', contact: '555-0133', email: 'daniel@example.com', totalOrders: 4 },
  { id: '12', name: 'Maria Garcia', contact: '555-0134', email: 'maria@example.com', totalOrders: 6 },
  { id: '13', name: 'William Martin', contact: '555-0135', email: 'william@example.com', totalOrders: 3 },
  { id: '14', name: 'Elizabeth Clark', contact: '555-0136', email: 'elizabeth@example.com', totalOrders: 7 },
  { id: '15', name: 'Thomas Rodriguez', contact: '555-0137', email: 'thomas@example.com', totalOrders: 4 },
  { id: '16', name: 'Margaret Lewis', contact: '555-0138', email: 'margaret@example.com', totalOrders: 5 },
  { id: '17', name: 'Joseph Hall', contact: '555-0139', email: 'joseph@example.com', totalOrders: 2 },
  { id: '18', name: 'Patricia Young', contact: '555-0140', email: 'patricia@example.com', totalOrders: 6 },
  { id: '19', name: 'Christopher King', contact: '555-0141', email: 'christopher@example.com', totalOrders: 3 },
  { id: '20', name: 'Isabella Rodriguez', contact: '555-0142', email: 'isabella@example.com', totalOrders: 7 }
];

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'totalOrders'>) => {
    try {
      const newCustomer: Customer = {
        ...customerData,
        id: (customers.length + 1).toString(),
        totalOrders: 0
      };
      
      setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to add customer. Please try again.');
      console.error('Error adding customer:', err);
    }
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedCustomers.map((customer) => (
        <div key={customer.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{customer.email}</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {customer.totalOrders} orders
            </span>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {customer.contact}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white shadow-sm rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Orders
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedCustomers.map((customer) => (
            <tr key={customer.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{customer.contact}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{customer.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {customer.totalOrders} orders
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 border border-gray-300 rounded-md">
            <button
              onClick={() => setViewType('grid')}
              className={`p-2 ${viewType === 'grid' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-500'}`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewType('list')}
              className={`p-2 ${viewType === 'list' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-500'}`}
            >
              <LayoutList className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {viewType === 'grid' ? renderGridView() : renderListView()}
      
      {filteredCustomers.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCustomers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCustomer}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default Customers;
import { useState } from 'react';
import { PlusCircle, Pencil, Trash2, LayoutGrid, LayoutList } from 'lucide-react';
import { RepairService } from '../types';
import { ServiceModal } from './ServiceModal';
import { Pagination } from './Pagination';

const ITEMS_PER_PAGE = 10;

const initialServices: RepairService[] = [
  {
    id: '1',
    name: 'Heel Replacement',
    type: 'shoe',
    description: 'Complete heel replacement with premium materials',
    price: 45.00,
    estimatedDays: 2,
    active: true
  },
  {
    id: '2',
    name: 'Sole Repair',
    type: 'shoe',
    description: 'Full sole repair and restoration',
    price: 35.00,
    estimatedDays: 3,
    active: true
  },
  {
    id: '3',
    name: 'Zipper Replacement',
    type: 'bag',
    description: 'Complete zipper replacement with YKK zippers',
    price: 25.00,
    estimatedDays: 1,
    active: true
  },
  {
    id: '4',
    name: 'Leather Restoration',
    type: 'bag',
    description: 'Full leather restoration and conditioning',
    price: 75.00,
    estimatedDays: 4,
    active: true
  },
  {
    id: '5',
    name: 'Color Touch-up',
    type: 'shoe',
    description: 'Professional color restoration',
    price: 40.00,
    estimatedDays: 2,
    active: true
  },
  {
    id: '6',
    name: 'Handle Repair',
    type: 'bag',
    description: 'Handle replacement or repair',
    price: 55.00,
    estimatedDays: 2,
    active: true
  },
  {
    id: '7',
    name: 'Deep Cleaning',
    type: 'shoe',
    description: 'Thorough cleaning and sanitization',
    price: 30.00,
    estimatedDays: 1,
    active: true
  },
  {
    id: '8',
    name: 'Strap Replacement',
    type: 'bag',
    description: 'Complete strap replacement',
    price: 45.00,
    estimatedDays: 2,
    active: true
  },
  {
    id: '9',
    name: 'Waterproofing',
    type: 'shoe',
    description: 'Professional waterproofing treatment',
    price: 35.00,
    estimatedDays: 1,
    active: true
  },
  {
    id: '10',
    name: 'Hardware Replacement',
    type: 'bag',
    description: 'Replace buckles, clasps, and other hardware',
    price: 40.00,
    estimatedDays: 2,
    active: true
  },
  {
    id: '11',
    name: 'Insole Replacement',
    type: 'shoe',
    description: 'Complete insole replacement',
    price: 30.00,
    estimatedDays: 1,
    active: true
  },
  {
    id: '12',
    name: 'Lining Repair',
    type: 'bag',
    description: 'Interior lining repair or replacement',
    price: 65.00,
    estimatedDays: 3,
    active: true
  },
  {
    id: '13',
    name: 'Stretching Service',
    type: 'shoe',
    description: 'Professional shoe stretching',
    price: 25.00,
    estimatedDays: 1,
    active: true
  },
  {
    id: '14',
    name: 'Edge Repair',
    type: 'bag',
    description: 'Repair worn or damaged edges',
    price: 35.00,
    estimatedDays: 2,
    active: true
  },
  {
    id: '15',
    name: 'Custom Patina',
    type: 'shoe',
    description: 'Artistic leather patina application',
    price: 85.00,
    estimatedDays: 5,
    active: true
  },
  {
    id: '16',
    name: 'Pocket Repair',
    type: 'bag',
    description: 'Interior or exterior pocket repair',
    price: 40.00,
    estimatedDays: 2,
    active: true
  },
  {
    id: '17',
    name: 'Heel Tip Replacement',
    type: 'shoe',
    description: 'Quick heel tip replacement',
    price: 15.00,
    estimatedDays: 1,
    active: true
  },
  {
    id: '18',
    name: 'Leather Patch',
    type: 'bag',
    description: 'Patch holes or tears in leather',
    price: 45.00,
    estimatedDays: 2,
    active: true
  },
  {
    id: '19',
    name: 'Polish and Shine',
    type: 'shoe',
    description: 'Professional polish and shine service',
    price: 20.00,
    estimatedDays: 1,
    active: true
  },
  {
    id: '20',
    name: 'Custom Leather Dyeing',
    type: 'bag',
    description: 'Professional leather dyeing service',
    price: 85.00,
    estimatedDays: 4,
    active: true
  }
];

export function Services() {
  const [services, setServices] = useState<RepairService[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<RepairService | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedServices = services.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAddService = (service: Omit<RepairService, 'id'>) => {
    const newService: RepairService = {
      ...service,
      id: (services.length + 1).toString()
    };
    setServices([...services, newService]);
    setIsModalOpen(false);
  };

  const handleEditService = (service: RepairService) => {
    setServices(services.map(s => s.id === service.id ? service : s));
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, active: false } : service
    ));
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedServices.map((service) => (
        <div key={service.id} className={`bg-white rounded-lg shadow-sm p-6 ${!service.active && 'opacity-60'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{service.description}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              service.type === 'shoe' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {service.type}
            </span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Est. time: {service.estimatedDays} day{service.estimatedDays > 1 ? 's' : ''}
            </div>
            <div className="text-lg font-medium text-gray-900">
              ${service.price.toFixed(2)}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => {
                setEditingService(service);
                setIsModalOpen(true);
              }}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDeleteService(service.id)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Est. Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedServices.map((service) => (
            <tr key={service.id} className={!service.active ? 'bg-gray-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{service.name}</div>
                <div className="text-sm text-gray-500">{service.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  service.type === 'shoe' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {service.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${service.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {service.estimatedDays} day{service.estimatedDays > 1 ? 's' : ''}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {service.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => {
                    setEditingService(service);
                    setIsModalOpen(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-500'}`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-500'}`}
            >
              <LayoutList className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => {
              setEditingService(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Service
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {services.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={services.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        onSave={editingService ? handleEditService : handleAddService}
        service={editingService}
      />
    </div>
  );
}

export default Services;
import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import type { RepairItem } from '../types';
import { mockServices } from '../data/mockData';
import { formatCurrency } from '../utils/formatCurrency';

interface NewRepairFormProps {
  onClose: () => void;
}

export function NewRepairForm({ onClose }: NewRepairFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    email: '',
    type: 'shoe',
    customType: '',
    description: '',
    estimatedPrice: '',
    selectedServices: [] as string[],
    estimatedCompletion: '',
    itemImage: null as File | null,
    itemImagePreview: '' as string
  });

  const [showCustomType, setShowCustomType] = useState(false);
  const [filteredServices, setFilteredServices] = useState(mockServices);

  useEffect(() => {
    setFilteredServices(
      formData.type === 'other' 
        ? mockServices 
        : mockServices.filter(service => service.type === formData.type)
    );
  }, [formData.type]);

  const handleServiceChange = (serviceId: string) => {
    const isSelected = formData.selectedServices.includes(serviceId);
    let newSelectedServices: string[];

    if (isSelected) {
      newSelectedServices = formData.selectedServices.filter(id => id !== serviceId);
    } else {
      newSelectedServices = [...formData.selectedServices, serviceId];
    }

    // Calculate total price from selected services
    const totalPrice = mockServices
      .filter(service => newSelectedServices.includes(service.id))
      .reduce((sum, service) => sum + service.price, 0);

    // Calculate estimated completion date based on longest service time
    const maxDays = Math.max(
      ...mockServices
        .filter(service => newSelectedServices.includes(service.id))
        .map(service => service.estimatedDays),
      0
    );

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + maxDays);

    setFormData(prev => ({
      ...prev,
      selectedServices: newSelectedServices,
      estimatedPrice: totalPrice.toString(),
      estimatedCompletion: estimatedDate.toISOString().split('T')[0]
    }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value,
      selectedServices: [], // Reset selected services when type changes
      customType: value === 'other' ? prev.customType : '',
      estimatedPrice: '',
      estimatedCompletion: ''
    }));
    setShowCustomType(value === 'other');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        itemImage: file,
        itemImagePreview: previewUrl
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new repair order with in-progress status
    const newRepair: RepairItem = {
      id: Date.now().toString(),
      type: formData.type as 'shoe' | 'bag',
      customType: formData.customType,
      customerName: formData.customerName,
      contactNumber: formData.contactNumber,
      description: formData.description,
      status: 'in-progress',
      dateReceived: new Date().toISOString().split('T')[0],
      estimatedCompletion: formData.estimatedCompletion,
      price: parseFloat(formData.estimatedPrice),
      selectedServices: formData.selectedServices,
      assignedStaffId: '1',
      itemImageUrl: formData.itemImagePreview || undefined
    };

    // Cleanup preview URL
    if (formData.itemImagePreview) {
      URL.revokeObjectURL(formData.itemImagePreview);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">New Repair Order</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Item Type
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  <option value="shoe">Shoe</option>
                  <option value="bag">Bag</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {showCustomType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Specify Item Type
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.customType}
                    onChange={(e) => setFormData({ ...formData, customType: e.target.value })}
                    placeholder="Enter item type"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services Required
              </label>
              <select
                multiple
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.selectedServices}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  selectedOptions.forEach(serviceId => handleServiceChange(serviceId));
                }}
                size={5}
              >
                {filteredServices.map((service) => (
                  <option
                    key={service.id}
                    value={service.id}
                    className="p-2 hover:bg-indigo-50"
                  >
                    {service.name} - {formatCurrency(service.price)} - {service.estimatedDays} day(s)
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Hold Ctrl (Windows) or Command (Mac) to select multiple services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Price
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.estimatedPrice ? formatCurrency(parseFloat(formData.estimatedPrice)) : ''}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estimated Completion
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.estimatedCompletion}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Image (Optional)
              </label>
              <div className="mt-1 flex items-center space-x-4">
                {formData.itemImagePreview ? (
                  <div className="relative">
                    <img
                      src={formData.itemImagePreview}
                      alt="Item preview"
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, itemImage: null, itemImagePreview: '' }))}
                      className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
                <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewRepairForm;
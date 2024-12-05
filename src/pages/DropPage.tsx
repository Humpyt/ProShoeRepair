import React, { useState, useEffect } from 'react';
import { X, Plus, User, Search, Star } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import type { Customer } from '../types';
import { useCustomer } from '../contexts/CustomerContext';
import { useOperation } from '../contexts/OperationContext';
import { useNavigate } from 'react-router-dom';

interface ItemCategory {
  id: string;
  name: string;
  icon: string;
}

interface ColorOption {
  id: string;
  name: string;
  bgClass: string;
}

interface RepairService {
  id: string;
  name: string;
  price: number;
}

interface ShoeItem {
  id: string;
  category: string;
  color: string;
  services: string[];
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'lastVisit' | 'loyaltyPoints'>) => void;
  initialData?: Customer;
}

const categories: ItemCategory[] = [
  { id: 'womens-high-heel', name: "Women's High Heel", icon: '👠' },
  { id: 'womens-flat', name: "Women's Flat", icon: '🥿' },
  { id: 'womens-dress-boot', name: "Women's Dress Boot", icon: '👢' },
  { id: 'womens-sneaker', name: "Women's Sneaker", icon: '👟' },
  { id: 'mens-dress', name: "Men's Dress", icon: '👞' },
  { id: 'mens-half-boot', name: "Men's Half Boot", icon: '🥾' },
  { id: 'mens-sneaker', name: "Men's Sneaker", icon: '👟' },
  { id: 'mens-work', name: "Men's Work", icon: '🥾' },
  { id: 'mens-western', name: "Men's Western", icon: '👢' },
  { id: 'mens-riding', name: "Men's Riding", icon: '🥾' }
];

const colors: ColorOption[] = [
  { id: 'beige', name: 'Beige', bgClass: 'bg-[#F5F5DC]' },
  { id: 'black', name: 'Black', bgClass: 'bg-black' },
  { id: 'blue', name: 'Blue', bgClass: 'bg-blue-600' },
  { id: 'brown', name: 'Brown', bgClass: 'bg-amber-800' },
  { id: 'burgundy', name: 'Burgundy', bgClass: 'bg-red-900' },
  { id: 'gray', name: 'Gray', bgClass: 'bg-gray-500' },
  { id: 'green', name: 'Green', bgClass: 'bg-green-600' },
  { id: 'multi', name: 'Multi', bgClass: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500' },
  { id: 'navy', name: 'Navy', bgClass: 'bg-blue-900' },
  { id: 'orange', name: 'Orange', bgClass: 'bg-orange-500' },
  { id: 'pink', name: 'Pink', bgClass: 'bg-pink-500' },
  { id: 'red', name: 'Red', bgClass: 'bg-red-600' },
  { id: 'white', name: 'White', bgClass: 'bg-white' },
  { id: 'yellow', name: 'Yellow', bgClass: 'bg-yellow-400' }
];

const services: RepairService[] = [
  { id: 'elastic', name: 'Elastic', price: 15000 },
  { id: 'glue', name: 'Glue', price: 10000 },
  { id: 'hardware', name: 'Hardware', price: 20000 },
  { id: 'heel-fix', name: 'Heel Fix', price: 25000 },
  { id: 'heel', name: 'Heel', price: 30000 },
  { id: 'insoles', name: 'Insoles', price: 12000 },
  { id: 'misc', name: 'Misc', price: 8000 },
  { id: 'pad', name: 'Pad', price: 10000 },
  { id: 'patches', name: 'Patches', price: 18000 },
  { id: 'rips', name: 'Rips', price: 15000 },
  { id: 'sling', name: 'Sling', price: 20000 },
  { id: 'stitch', name: 'Stitch', price: 12000 },
  { id: 'straps', name: 'Straps', price: 25000 },
  { id: 'stretch', name: 'Stretch', price: 15000 },
  { id: 'tassels', name: 'Tassels', price: 10000 },
  { id: 'zipper', name: 'Zipper', price: 30000 }
];

const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name,
        phone: initialData.phone,
        email: initialData.email,
        address: initialData.address,
        notes: initialData.notes,
      });
    } else if (isOpen) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
      });
    }
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?\d{10,}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        status: 'active' as const,
      });
      onClose();
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              className={`w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                errors.name ? 'border-red-500' : ''
              }`}
              placeholder="Enter customer name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              className={`w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                errors.phone ? 'border-red-500' : ''
              }`}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              className={`w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                errors.email ? 'border-red-500' : ''
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={handleInputChange('address')}
              className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={handleInputChange('notes')}
              className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows={3}
              placeholder="Add any additional notes"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-2"
            >
              {initialData ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function DropPage() {
  const { customers, addCustomer, updateCustomer } = useCustomer();
  const { addOperation } = useOperation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [shoes, setShoes] = useState<ShoeItem[]>([]);
  const [operationStatus, setOperationStatus] = useState<'none' | 'hold' | 'save'>('none');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.phone.includes(customerSearchTerm) ||
    customer.email?.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );

  const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'lastVisit' | 'loyaltyPoints'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      totalOrders: 0,
      totalSpent: 0,
      lastVisit: new Date().toISOString().split('T')[0],
      loyaltyPoints: 0,
    };
    
    addCustomer(newCustomer);
    setSelectedCustomer(newCustomer);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSearch(false);
    setCustomerSearchTerm('');
  };

  const handleEditCustomer = () => {
    setIsEditingCustomer(true);
    setIsCustomerModalOpen(true);
  };

  const handleOpenAddCustomer = () => {
    setIsEditingCustomer(false);
    setIsCustomerModalOpen(true);
  };

  const handleCustomerModalClose = () => {
    setIsCustomerModalOpen(false);
    setIsEditingCustomer(false);
  };

  const handleAddShoe = () => {
    if (selectedCategory && selectedColor && selectedServices.length > 0) {
      const newShoe: ShoeItem = {
        id: Date.now().toString(),
        category: selectedCategory,
        color: selectedColor,
        services: selectedServices,
      };
      setShoes([...shoes, newShoe]);
      setSelectedCategory(null);
      setSelectedColor(null);
      setSelectedServices([]);
    }
  };

  const handleRemoveShoe = (shoeId: string) => {
    setShoes(shoes.filter(shoe => shoe.id !== shoeId));
  };

  const calculateTotal = () => {
    return shoes.reduce((total, shoe) => {
      const shoeTotal = shoe.services.reduce((sum, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return sum + (service?.price || 0);
      }, 0);
      return total + shoeTotal;
    }, 0);
  };

  const currentSelectionTotal = selectedServices.reduce((sum, serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return sum + (service?.price || 0);
  }, 0);

  const handleSaveToOperations = async () => {
    if (shoes.length === 0) return;

    try {
      await addOperation({
        customer: selectedCustomer,
        shoes,
        status: 'pending',
        totalAmount: calculateTotal(),
        isNoCharge: false,
        isDoOver: false,
        isDelivery: false,
        isPickup: false,
      });

      // Clear the form
      handleCancel();
      
      // Navigate to operations page
      navigate('/operations');
    } catch (error) {
      console.error('Error saving to operations:', error);
    }
  };

  const handleHold = async () => {
    if (shoes.length === 0) return;

    try {
      await addOperation({
        customer: selectedCustomer,
        shoes,
        status: 'held',
        totalAmount: calculateTotal(),
        isNoCharge: false,
        isDoOver: false,
        isDelivery: false,
        isPickup: false,
      });

      // Clear the form
      handleCancel();
      
      // Navigate to operations page
      navigate('/operations');
    } catch (error) {
      console.error('Error holding operation:', error);
    }
  };

  const handleNoCharge = async () => {
    if (shoes.length === 0) return;

    try {
      await addOperation({
        customer: selectedCustomer,
        shoes,
        status: 'pending',
        totalAmount: calculateTotal(),
        isNoCharge: true,
        isDoOver: false,
        isDelivery: false,
        isPickup: false,
      });

      handleCancel();
      navigate('/operations');
    } catch (error) {
      console.error('Error creating no-charge operation:', error);
    }
  };

  const handleDoOver = async () => {
    if (shoes.length === 0) return;

    try {
      await addOperation({
        customer: selectedCustomer,
        shoes,
        status: 'pending',
        totalAmount: calculateTotal(),
        isNoCharge: false,
        isDoOver: true,
        isDelivery: false,
        isPickup: false,
      });

      handleCancel();
      navigate('/operations');
    } catch (error) {
      console.error('Error creating do-over operation:', error);
    }
  };

  const handleDelivery = async () => {
    if (shoes.length === 0) return;

    try {
      await addOperation({
        customer: selectedCustomer,
        shoes,
        status: 'pending',
        totalAmount: calculateTotal(),
        isNoCharge: false,
        isDoOver: false,
        isDelivery: true,
        isPickup: false,
      });

      handleCancel();
      navigate('/operations');
    } catch (error) {
      console.error('Error creating delivery operation:', error);
    }
  };

  const handlePickup = async () => {
    if (shoes.length === 0) return;

    try {
      await addOperation({
        customer: selectedCustomer,
        shoes,
        status: 'pending',
        totalAmount: calculateTotal(),
        isNoCharge: false,
        isDoOver: false,
        isDelivery: false,
        isPickup: true,
      });

      handleCancel();
      navigate('/operations');
    } catch (error) {
      console.error('Error creating pickup operation:', error);
    }
  };

  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  const handleDiscount = async () => {
    if (shoes.length === 0) return;
    setShowDiscountModal(true);
  };

  const handleApplyDiscount = async () => {
    try {
      await addOperation({
        customer: selectedCustomer,
        shoes,
        status: 'pending',
        totalAmount: calculateTotal(),
        discount: discountAmount,
        isNoCharge: false,
        isDoOver: false,
        isDelivery: false,
        isPickup: false,
      });

      setShowDiscountModal(false);
      handleCancel();
      navigate('/operations');
    } catch (error) {
      console.error('Error creating discounted operation:', error);
    }
  };

  const [splitCount, setSplitCount] = useState<number>(2);
  const [showSplitModal, setShowSplitModal] = useState(false);

  const handleSplitTicket = async () => {
    if (shoes.length === 0) return;
    setShowSplitModal(true);
  };

  const handleApplySplit = async () => {
    const totalAmount = calculateTotal();
    const amountPerTicket = totalAmount / splitCount;
    const shoesPerTicket = Math.ceil(shoes.length / splitCount);

    try {
      for (let i = 0; i < splitCount; i++) {
        const startIndex = i * shoesPerTicket;
        const endIndex = Math.min(startIndex + shoesPerTicket, shoes.length);
        const ticketShoes = shoes.slice(startIndex, endIndex);

        await addOperation({
          customer: selectedCustomer,
          shoes: ticketShoes,
          status: 'pending',
          totalAmount: amountPerTicket,
          isNoCharge: false,
          isDoOver: false,
          isDelivery: false,
          isPickup: false,
          notes: `Split ticket ${i + 1} of ${splitCount}`,
        });
      }

      setShowSplitModal(false);
      handleCancel();
      navigate('/operations');
    } catch (error) {
      console.error('Error creating split tickets:', error);
    }
  };

  const handleCancel = () => {
    setSelectedCategory(null);
    setSelectedColor(null);
    setSelectedServices([]);
    setShoes([]);
    setOperationStatus('none');
  };

  const handleClearLastEntry = () => {
    if (shoes.length > 0) {
      setShoes(prev => prev.slice(0, -1));
    }
  };

  const handleDeleteItem = () => {
    if (selectedCategory || selectedColor || selectedServices.length > 0) {
      setSelectedCategory(null);
      setSelectedColor(null);
      setSelectedServices([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="grid grid-cols-12 gap-4 h-full">
        <div className="col-span-3">
          <div className="card-bevel p-4">
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`btn-bevel aspect-square p-2 rounded-lg text-center ${
                    selectedCategory === category.id ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="text-[10px] truncate">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card-bevel p-2 mt-2">
            <div className="grid grid-cols-4 gap-1">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`relative p-1 rounded-md transition-all ${
                    selectedColor === color.id 
                    ? 'ring-2 ring-indigo-500 scale-110' 
                    : 'hover:scale-105'
                  }`}
                  title={color.name}
                >
                  <div 
                    className={`w-6 h-6 rounded-full ${color.bgClass} shadow-lg`}
                    style={{ boxShadow: selectedColor === color.id ? '0 0 10px rgba(99, 102, 241, 0.5)' : undefined }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-6 space-y-4">
          <div className="card-bevel p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <User className="text-2xl" />
                {selectedCustomer ? (
                  <div>
                    <h3 className="font-semibold">{selectedCustomer.name}</h3>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>{selectedCustomer.phone}</p>
                      {selectedCustomer.email && <p>{selectedCustomer.email}</p>}
                      <p className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        {selectedCustomer.loyaltyPoints} points
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">No customer selected</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowCustomerSearch(prev => !prev)}
                  className="btn-secondary text-sm px-3 py-1"
                >
                  <Search size={16} className="mr-1" />
                  Find
                </button>
                <button
                  onClick={handleOpenAddCustomer}
                  className="btn-primary text-sm px-3 py-1"
                >
                  <Plus size={16} className="mr-1" />
                  Add
                </button>
              </div>
            </div>

            {showCustomerSearch && (
              <div className="mt-4 bg-gray-800 rounded-lg p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={customerSearchTerm}
                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      className="w-full text-left p-2 rounded hover:bg-gray-700 transition-colors"
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-400">{customer.phone}</p>
                        </div>
                        <div className="text-right text-sm text-gray-400">
                          <p>{customer.totalOrders} orders</p>
                          <p>{formatCurrency(customer.totalSpent)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {selectedCustomer && (
            <div className="card-bevel p-4">
              <button
                onClick={handleEditCustomer}
                className="btn-bevel accent-primary w-full py-3 rounded-lg"
              >
                Edit Customer
              </button>
            </div>
          )}

          <div className="card-bevel p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {categories.find(c => c.id === selectedCategory)?.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </h3>
                  {selectedColor && (
                    <div className="flex items-center mt-1">
                      <div 
                        className={`w-3 h-3 rounded-full ${colors.find(c => c.id === selectedColor)?.bgClass} mr-2`}
                      />
                      <span className="text-xs text-gray-400">
                        {colors.find(c => c.id === selectedColor)?.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {selectedCategory && selectedColor && selectedServices.length > 0 && (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">
                    {formatCurrency(currentSelectionTotal)}
                  </div>
                  <button
                    onClick={handleAddShoe}
                    className="btn-primary text-sm px-3 py-1"
                  >
                    Add Shoe
                  </button>
                </div>
              )}
            </div>
            {selectedServices.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedServices.map(serviceId => {
                  const service = services.find(s => s.id === serviceId);
                  return (
                    <div key={serviceId} className="bg-gray-700 rounded px-2 py-1">
                      <span className="text-xs">{service?.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card-bevel p-4">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <div className="grid grid-cols-4 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedServices(prev => 
                    prev.includes(service.id)
                      ? prev.filter(id => id !== service.id)
                      : [...prev, service.id]
                  )}
                  className={`btn-bevel p-4 rounded-lg text-center ${
                    selectedServices.includes(service.id) ? 'bg-indigo-600' : 'bg-gray-800'
                  }`}
                >
                  <div className="text-sm font-medium">{service.name}</div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {formatCurrency(service.price)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {shoes.length > 0 && (
            <div className="card-bevel p-4 bg-gradient-to-br from-gray-800 to-gray-900">
              <h3 className="text-lg font-semibold mb-4">Shoes List</h3>
              <div className="space-y-3">
                {shoes.map((shoe) => {
                  const category = categories.find(c => c.id === shoe.category);
                  const color = colors.find(c => c.id === shoe.color);
                  const shoeTotal = shoe.services.reduce((sum, serviceId) => {
                    const service = services.find(s => s.id === serviceId);
                    return sum + (service?.price || 0);
                  }, 0);

                  return (
                    <div key={shoe.id} className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{category?.icon}</span>
                          <div>
                            <div className="text-sm font-medium">{category?.name}</div>
                            <div className="flex items-center mt-1">
                              <div 
                                className={`w-3 h-3 rounded-full ${color?.bgClass} mr-2`}
                              />
                              <span className="text-xs text-gray-400">{color?.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-indigo-400">{formatCurrency(shoeTotal)}</span>
                          <button
                            onClick={() => handleRemoveShoe(shoe.id)}
                            className="text-red-500 hover:text-red-400 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {shoe.services.map(serviceId => {
                          const service = services.find(s => s.id === serviceId);
                          return (
                            <div key={serviceId} className="bg-gray-700 rounded px-2 py-1">
                              <span className="text-xs">{service?.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="card-bevel p-4 bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">Total:</span>
                <span className="text-xl font-bold text-indigo-400">{formatCurrency(calculateTotal())}</span>
              </div>
              {selectedServices.length > 0 && (
                <div className="text-sm text-gray-400">
                  Current Selection: {formatCurrency(currentSelectionTotal)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className="card-bevel p-4 space-y-4">
            <button 
              className="btn-bevel accent-primary w-full py-3 rounded-lg"
              onClick={handleNoCharge}
              disabled={shoes.length === 0}
            >
              No Charge
            </button>
            <button 
              className="btn-bevel accent-secondary w-full py-3 rounded-lg"
              onClick={handleDoOver}
              disabled={shoes.length === 0}
            >
              Do Over
            </button>
            <button 
              className="btn-bevel accent-tertiary w-full py-3 rounded-lg"
              onClick={handleDiscount}
              disabled={shoes.length === 0}
            >
              Discount
            </button>
            <button 
              className="btn-bevel bg-gray-700 w-full py-3 rounded-lg"
              onClick={handleSplitTicket}
              disabled={shoes.length === 0}
            >
              Split Ticket
            </button>
          </div>

          <div className="card-bevel p-4 space-y-4 mt-4">
            <button 
              className="btn-bevel accent-primary w-full py-3 rounded-lg"
              onClick={handleDelivery}
              disabled={shoes.length === 0}
            >
              Delivery
            </button>
            <button 
              className="btn-bevel accent-secondary w-full py-3 rounded-lg"
              onClick={handlePickup}
              disabled={shoes.length === 0}
            >
              Pickup
            </button>
          </div>

          <div className="card-bevel p-4 space-y-4 mt-4">
            <button 
              className="btn-bevel accent-primary w-full py-3 rounded-lg"
              onClick={handleSaveToOperations}
              disabled={shoes.length === 0}
            >
              Save to Operations
            </button>
            <button 
              className="btn-bevel accent-secondary w-full py-3 rounded-lg"
              onClick={handleHold}
              disabled={shoes.length === 0}
            >
              Hold
            </button>
            <button
              onClick={handleCancel}
              className="btn-bevel accent-secondary w-full py-3 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleClearLastEntry}
              disabled={shoes.length === 0}
              className={`btn-bevel bg-gray-700 w-full py-3 rounded-lg ${
                shoes.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Clear Last Entry
            </button>
            <button
              onClick={handleDeleteItem}
              disabled={!selectedCategory && !selectedColor && selectedServices.length === 0}
              className={`btn-bevel bg-gray-700 w-full py-3 rounded-lg ${
                !selectedCategory && !selectedColor && selectedServices.length === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
              }`}
            >
              Delete Item
            </button>
          </div>
        </div>
      </div>

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Apply Discount</h3>
            <input
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 mb-4"
              placeholder="Enter discount amount"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDiscountModal(false)}
                className="btn-secondary px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyDiscount}
                className="btn-primary px-4 py-2"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Split Ticket Modal */}
      {showSplitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Split Ticket</h3>
            <input
              type="number"
              value={splitCount}
              onChange={(e) => setSplitCount(Math.max(2, Number(e.target.value)))}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 mb-4"
              placeholder="Enter number of splits"
              min="2"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowSplitModal(false)}
                className="btn-secondary px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleApplySplit}
                className="btn-primary px-4 py-2"
              >
                Split
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={handleCustomerModalClose}
        onSave={handleAddCustomer}
        initialData={isEditingCustomer ? selectedCustomer : undefined}
      />
    </div>
  );
}
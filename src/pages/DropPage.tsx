import React, { useState, useEffect } from 'react';
import { X, Plus, User, Search, Star, Percent, Phone, Mail, Palette, Scissors, Settings, Edit2, Trash2, FolderOpen, CheckCircle, DollarSign, CreditCard, Calendar, Clock, Package, Printer, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';
import type { Customer } from '../types';
import { useCustomer } from '../contexts/CustomerContext';
import { useOperation } from '../contexts/OperationContext';
import { useServices, type Service } from '../contexts/ServiceContext';
import { useAuthStore } from '../store/authStore';
import { useRetailProducts, type RetailProduct } from '../contexts/RetailProductContext';
import ServiceCRUDModal, { ServiceFormData } from '../components/ServiceCRUDModal';
import CategoryManagerModal from '../components/CategoryManagerModal';
import { PaymentModal } from '../components/PaymentModal';
import ProductSalesSection from '../components/drop/ProductSalesSection';
import ProductCRUDModal from '../components/drop/ProductCRUDModal';

interface ItemCategory {
  id: string;
  name: string;
  icon: string;
}

interface ColorOption {
  id: string;
  name: string;
  hexCode: string;
  isRainbow?: boolean;
}

interface ShoeItem {
  id: string;
  category: string;
  description: string;
  color: string;
  colorDescription: string;
  size: string;
  services: {
    service_id: string;
    name: string;
    price: number;
    quantity: number;
    notes: string | null;
  }[];
  manualPrice?: number;
}

interface RetailCartItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  image_url?: string;
  icon?: string;
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
  { id: 'mens-riding', name: "Men's Riding", icon: '🥾' },
  { id: 'bag', name: "Bag", icon: '👜' },
  { id: 'other', name: "Other", icon: '🔧' }
];

const shoeSizes = [
  // US sizes
  { id: 'us-1', label: 'US 1', system: 'US' },
  { id: 'us-2', label: 'US 2', system: 'US' },
  { id: 'us-3', label: 'US 3', system: 'US' },
  { id: 'us-4', label: 'US 4', system: 'US' },
  { id: 'us-5', label: 'US 5', system: 'US' },
  { id: 'us-6', label: 'US 6', system: 'US' },
  { id: 'us-7', label: 'US 7', system: 'US' },
  { id: 'us-8', label: 'US 8', system: 'US' },
  { id: 'us-9', label: 'US 9', system: 'US' },
  { id: 'us-10', label: 'US 10', system: 'US' },
  { id: 'us-11', label: 'US 11', system: 'US' },
  { id: 'us-12', label: 'US 12', system: 'US' },
  { id: 'us-13', label: 'US 13', system: 'US' },
  { id: 'us-14', label: 'US 14', system: 'US' },
  { id: 'us-15', label: 'US 15', system: 'US' },
  // UK sizes (half sizes)
  { id: 'uk-0.5', label: 'UK 0.5', system: 'UK' },
  { id: 'uk-1', label: 'UK 1', system: 'UK' },
  { id: 'uk-1.5', label: 'UK 1.5', system: 'UK' },
  { id: 'uk-2', label: 'UK 2', system: 'UK' },
  { id: 'uk-2.5', label: 'UK 2.5', system: 'UK' },
  { id: 'uk-3', label: 'UK 3', system: 'UK' },
  { id: 'uk-3.5', label: 'UK 3.5', system: 'UK' },
  { id: 'uk-4', label: 'UK 4', system: 'UK' },
  { id: 'uk-4.5', label: 'UK 4.5', system: 'UK' },
  { id: 'uk-5', label: 'UK 5', system: 'UK' },
  { id: 'uk-5.5', label: 'UK 5.5', system: 'UK' },
  { id: 'uk-6', label: 'UK 6', system: 'UK' },
  { id: 'uk-6.5', label: 'UK 6.5', system: 'UK' },
  { id: 'uk-7', label: 'UK 7', system: 'UK' },
  { id: 'uk-7.5', label: 'UK 7.5', system: 'UK' },
  { id: 'uk-8', label: 'UK 8', system: 'UK' },
  { id: 'uk-8.5', label: 'UK 8.5', system: 'UK' },
  { id: 'uk-9', label: 'UK 9', system: 'UK' },
  { id: 'uk-9.5', label: 'UK 9.5', system: 'UK' },
  { id: 'uk-10', label: 'UK 10', system: 'UK' },
  { id: 'uk-10.5', label: 'UK 10.5', system: 'UK' },
  { id: 'uk-11', label: 'UK 11', system: 'UK' },
  { id: 'uk-11.5', label: 'UK 11.5', system: 'UK' },
  { id: 'uk-12', label: 'UK 12', system: 'UK' },
  { id: 'uk-12.5', label: 'UK 12.5', system: 'UK' },
  { id: 'uk-13', label: 'UK 13', system: 'UK' },
  { id: 'uk-13.5', label: 'UK 13.5', system: 'UK' },
  { id: 'uk-14', label: 'UK 14', system: 'UK' },
  { id: 'uk-14.5', label: 'UK 14.5', system: 'UK' },
];

// Categories that need shoe size (not bags, not other)
const shoeCategories = [
  'womens-high-heel', 'womens-flat', 'womens-dress-boot', 'womens-sneaker',
  'mens-dress', 'mens-half-boot', 'mens-sneaker', 'mens-work', 'mens-western', 'mens-riding'
];

const needsSize = (categoryId: string | null): boolean => {
  return categoryId !== null && categoryId !== 'bag' && categoryId !== 'other';
};

const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    const newErrors: { [key: string]: string } = {};

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
              className={`w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.name ? 'border-red-500' : ''
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
              className={`w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.phone ? 'border-red-500' : ''
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
              className={`w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${errors.email ? 'border-red-500' : ''
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
  const { addOperation, refreshOperations } = useOperation();
  const { services, loading: servicesLoading } = useServices();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customCategoryName, setCustomCategoryName] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [colorDescription, setColorDescription] = useState<string>('');
  const [sizeInput, setSizeInput] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [shoes, setShoes] = useState<ShoeItem[]>([]);
  const [retailItems, setRetailItems] = useState<RetailCartItem[]>([]);
  const [operationStatus, setOperationStatus] = useState<'none' | 'hold' | 'save'>('none');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [activeCartButtons, setActiveCartButtons] = useState<string[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [manualPrice, setManualPrice] = useState<string>('');
  const [useManualPrice, setUseManualPrice] = useState<boolean>(false);
  const [promisedDate, setPromisedDate] = useState<string>('');
  const [promisedTime, setPromisedTime] = useState<string>('17:00');
  const [cartPriceOverride, setCartPriceOverride] = useState<number | null>(null);
  const [showPriceOverrideModal, setShowPriceOverrideModal] = useState(false);
  const [priceOverrideInput, setPriceOverrideInput] = useState<string>('');

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdOperationId, setCreatedOperationId] = useState<string | null>(null);
  const [createdInvoiceType, setCreatedInvoiceType] = useState<'invoice' | 'receipt'>('invoice');

  // Admin mode state
  const [adminMode, setAdminMode] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [colors, setColors] = useState<ColorOption[]>([]);

  // Fetch colors from API
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await fetch('/api/colors');
        if (response.ok) {
          const data = await response.json();
          setColors(data);
        }
      } catch (error) {
        console.error('Failed to fetch colors:', error);
      }
    };
    fetchColors();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.phone.includes(customerSearchTerm) ||
    customer.email?.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );

  const handleAddCustomer = async (customerData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'lastVisit' | 'loyaltyPoints'>) => {
    try {
      // Don't generate ID here - let the API generate it
      const customerToSave = {
        ...customerData,
        totalOrders: 0,
        totalSpent: 0,
        lastVisit: new Date().toISOString().split('T')[0],
        loyaltyPoints: 0,
      };

      // The CustomerContext.addCustomer will return the created customer with the DB-generated ID
      // But we need to work around the current API structure
      const response = await fetch('http://localhost:3000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerToSave),
      });

      if (!response.ok) {
        throw new Error('Failed to create customer');
      }

      const newCustomer = await response.json();
      setSelectedCustomer(newCustomer);
      setIsCustomerModalOpen(false);

      // Refresh the customer list
      fetch('http://localhost:3000/api/customers')
        .then(r => r.json())
        .then(data => {
          // Update context by re-fetching
          setCustomerSearchTerm('');
        })
        .catch(console.error);

    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer. Please try again.');
    }
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
    // Validate category
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    // Validate size is required for shoes (not bags or other)
    if (needsSize(selectedCategory) && !sizeInput.trim()) {
      alert('Please enter a shoe size');
      return;
    }

    // For "Other" category, validate custom name
    if (selectedCategory === 'other' && !customCategoryName.trim()) {
      alert('Please specify the service type when "Other" is selected');
      return;
    }

    // Handle manual price entry for "Other" category
    if (selectedCategory === 'other' && useManualPrice) {
      const price = parseInt(manualPrice);
      if (!manualPrice || isNaN(price) || price <= 0) {
        alert('Please enter a valid price');
        return;
      }

      const newShoe = {
        id: Date.now().toString(),
        category: `other-${customCategoryName.trim().toLowerCase().replace(/\s+/g, '-')}`,
        description: customCategoryName.trim(),
        color: selectedColor || 'none',
        colorDescription: colorDescription,
        size: '',
        services: [{
          service_id: 'custom-manual-price',
          name: customCategoryName.trim(),
          price: price,
          quantity: 1,
          notes: 'Manual price entry'
        }],
        manualPrice: price
      };

      setShoes([...shoes, newShoe]);
      setSelectedCategory(null);
      setCustomCategoryName('');
      setManualPrice('');
      setUseManualPrice(false);
      setSelectedColor(null);
      setColorDescription('');
      setSizeInput('');
      return;
    }

    // Handle service selection
    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }

    const shoeServices = selectedServices.map(serviceId => {
      const service = Array.isArray(services) ? services.find(s => s.id === serviceId) : null;
      if (!service) return null;
      return {
        service_id: service.id,
        name: service.name,
        price: service.price,
        quantity: 1,
        notes: null
      };
    }).filter(Boolean);

    // Generate description from category and service names
    const serviceNames = shoeServices.map(s => s.name).join(', ');
    const categoryInfo = categories.find(c => c.id === selectedCategory);
    const categoryName = selectedCategory === 'other'
      ? customCategoryName.trim()
      : (categoryInfo?.name || 'Unknown');
    const description = selectedServices.length > 1
      ? `${categoryName}: ${serviceNames}`
      : `${categoryName} - ${serviceNames}`;

    const newShoe = {
      id: Date.now().toString(),
      category: selectedCategory === 'other' ? `other-${customCategoryName.trim().toLowerCase().replace(/\s+/g, '-')}` : selectedCategory,
      description: description,
      color: selectedColor || 'none',
      colorDescription: colorDescription,
      size: needsSize(selectedCategory) ? sizeInput.trim() : '',
      services: shoeServices,
    };

    setShoes([...shoes, newShoe]);
    setSelectedCategory(null);
    setCustomCategoryName('');
    setSelectedColor(null);
    setColorDescription('');
    setSizeInput('');
    setSelectedServices([]);
  };

  const handleQuickAddToCart = () => {
    // Validate inputs
    if (!selectedCategory || selectedCategory !== 'other') {
      alert('Please select "Other" category first');
      return;
    }

    if (!customCategoryName.trim()) {
      alert('Please specify the service type');
      return;
    }

    const price = parseInt(manualPrice);
    if (!manualPrice || isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    // Create shoe with manual price
    const newShoe = {
      id: Date.now().toString(),
      category: `other-${customCategoryName.trim().toLowerCase().replace(/\s+/g, '-')}`,
      description: customCategoryName.trim(),
      color: selectedColor || 'none',
      services: [{
        service_id: 'custom-manual-price',
        name: customCategoryName.trim(),
        price: price,
        quantity: 1,
        notes: 'Manual price entry - Quick Add'
      }],
      manualPrice: price
    };

    // Add to cart
    setShoes([...shoes, newShoe]);

    // Clear form for next entry
    setCustomCategoryName('');
    setManualPrice('');
    setUseManualPrice(false);
    setSelectedColor(null);

    // Optional: Scroll to cart
    document.getElementById('cart-summary')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRemoveShoe = (shoeId: string) => {
    setShoes(shoes.filter(shoe => shoe.id !== shoeId));
  };

  const handleAddRetailItemToCart = (product: RetailProduct, customPrice?: number) => {
    const unitPrice = customPrice ?? product.default_price;
    const newItem: RetailCartItem = {
      id: `retail-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      productName: product.name,
      unitPrice: unitPrice,
      quantity: 1,
      totalPrice: unitPrice,
      image_url: product.image_url,
      icon: product.icon,
    };
    setRetailItems(prev => [...prev, newItem]);
    toast.success(`Added ${product.name} to cart`);
  };

  const handleRemoveRetailItem = (id: string) => {
    setRetailItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateRetailItemQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveRetailItem(id);
      return;
    }
    setRetailItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const calculateTotal = () => {
    // If cart price override is set, use it directly
    if (cartPriceOverride !== null) {
      return Math.max(0, cartPriceOverride - discountAmount);
    }
    const shoeSubtotal = shoes.reduce((total, shoe) => {
      // Use manual price if available, otherwise sum service prices
      if (shoe.manualPrice) {
        return total + shoe.manualPrice;
      }
      const shoeTotal = shoe.services.reduce((sum, service) => {
        return sum + (service.price || 0) * (service.quantity || 1);
      }, 0);
      return total + shoeTotal;
    }, 0);
    const retailSubtotal = retailItems.reduce((total, item) => {
      return total + (item.totalPrice || item.unitPrice * item.quantity);
    }, 0);
    return Math.max(0, shoeSubtotal + retailSubtotal - discountAmount);
  };

  // Calculate tentative ready date based on max estimated_days from services
  const getTentativeReadyDate = (): string | null => {
    if (shoes.length === 0 || !services.length) return null;

    let maxDays = 0;
    for (const shoe of shoes) {
      for (const service of shoe.services) {
        // Skip custom/manual price services
        if (service.service_id === 'custom-manual-price') continue;
        const serviceData = services.find((s: any) => s.id === service.service_id);
        if (serviceData?.estimated_days && serviceData.estimated_days > maxDays) {
          maxDays = serviceData.estimated_days;
        }
      }
    }

    if (maxDays === 0) return null;

    const today = new Date();
    const readyDate = new Date(today);
    readyDate.setDate(readyDate.getDate() + maxDays);
    return readyDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const currentSelectionTotal = selectedServices.reduce((sum, serviceId) => {
    const service = Array.isArray(services) ? services.find(s => s.id === serviceId) : null;
    return sum + (service?.price || 0);
  }, 0);

  // Admin helper functions
  const isAdmin = useAuthStore(state => state.user?.role === 'admin');
  const { addService, updateService, deleteService, refreshServices } = useServices();
  const { createProduct, updateProduct, deleteProduct } = useRetailProducts();

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<RetailProduct | null>(null);

  const handleAddService = () => {
    setEditingService(null);
    setServiceModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceModalOpen(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    const service = Array.isArray(services) ? services.find(s => s.id === serviceId) : null;
    if (service && window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
      try {
        await deleteService(serviceId);
        // Remove from selected services if present
        setSelectedServices(prev => prev.filter(id => id !== serviceId));
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  };

  const handleSaveService = async (serviceData: ServiceFormData) => {
    try {
      if (editingService) {
        await updateService(editingService.id, serviceData);
      } else {
        await addService(serviceData);
      }
      setServiceModalOpen(false);
      setEditingService(null);
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  const handleSaveProduct = async (productData: {
    name: string;
    category: string;
    description: string;
    default_price: number;
    icon: string;
    image_url: string;
  }) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      setProductModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleRenameCategory = async (oldName: string, newName: string) => {
    try {
      // Bulk update all services with this category
      const servicesToUpdate = Array.isArray(services) ? services.filter(s => s.category === oldName) : [];
      await Promise.all(
        servicesToUpdate.map(service =>
          updateService(service.id, { category: newName })
        )
      );
      await refreshServices();
    } catch (error) {
      console.error('Failed to rename category:', error);
    }
  };

  const handleDeleteCategory = async (categoryName: string, reassignTo?: string) => {
    try {
      const servicesInCategory = Array.isArray(services) ? services.filter(s => s.category === categoryName) : [];

      if (servicesInCategory.length > 0 && !reassignTo) {
        alert('Please select a category to reassign services to');
        return;
      }

      // Reassign services to new category
      await Promise.all(
        servicesInCategory.map(service =>
          updateService(service.id, { category: reassignTo || 'other' })
        )
      );
      await refreshServices();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }

    if (shoes.length === 0 && retailItems.length === 0) {
      alert('Please add at least one shoe or product');
      return;
    }

    try {
      const operationData = {
        customer: selectedCustomer,
        shoes: shoes,
        retailItems: retailItems,
        status: 'pending' as const,
        totalAmount: calculateTotal(),
        discount: discountAmount,
        isNoCharge: false,
        isDoOver: false,
        isDelivery: activeCartButtons.includes('delivery'),
        isPickup: activeCartButtons.includes('pickup'),
        notes: '',
        promisedDate: promisedDate ? `${promisedDate}T${promisedTime || '17:00'}` : null,
      };

      const result = await addOperation(operationData);

      // Set success modal state - invoice is auto-generated
      setCreatedInvoiceType('invoice');
      setCreatedOperationId(result?.id || null);
      setShowSuccessModal(true);

      // Clear form after successful submission
      setSelectedCategory(null);
      setCustomCategoryName('');
      setSelectedColor(null);
      setSelectedServices([]);
      setShoes([]);
      setRetailItems([]);
      setSelectedCustomer(null);
      setOperationStatus('none');
      setDiscountAmount(0);
      setActiveCartButtons([]);
      setOperationPayments([]);
      setHasPayments(false);
      setPromisedDate('');
    } catch (error) {
      console.error('Error submitting drop-off:', error);
      if (error instanceof Error) {
        alert(`Failed to record drop-off: ${error.message}`);
      } else {
        alert('Failed to record drop-off');
      }
    }
  };

  const handlePaymentCompletion = async (payments: Array<{ method: string; amount: number }>) => {
    try {
      // First create the operation
      if (!selectedCustomer) {
        alert('Please select a customer');
        return;
      }

      if (shoes.length === 0 && retailItems.length === 0) {
        alert('Please add at least one shoe or product');
        return;
      }

      const operationData = {
        customer: selectedCustomer,
        shoes: shoes,
        retailItems: retailItems,
        status: 'pending' as const,
        totalAmount: calculateTotal(),
        discount: discountAmount,
        isNoCharge: false,
        isDoOver: false,
        isDelivery: activeCartButtons.includes('delivery'),
        isPickup: activeCartButtons.includes('pickup'),
        notes: '',
      };

      const operation = await addOperation(operationData);

      // Process payments
      const response = await fetch(`http://localhost:3000/api/operations/${operation.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payments }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment failed');
      }

      const updatedOperation = await response.json();

      // Store payments for display in payment summary
      setOperationPayments(payments.map(p => ({
        payment_method: p.method,
        amount: p.amount
      })));

      // Set flag to hide "I Finished" button
      setHasPayments(true);

      // If store credit was used, deduct from customer account
      const storeCreditPayment = payments.find(p => p.method === 'store_credit');
      if (storeCreditPayment && selectedCustomer) {
        await fetch(`http://localhost:3000/api/customers/${selectedCustomer.id}/credits/deduct`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: storeCreditPayment.amount,
            description: `Payment for operation #${updatedOperation.id.slice(-6)}`
          }),
        });
      }

      // Refresh operations
      await refreshOperations();

      // Set success modal state - receipt is auto-generated on full payment
      setCreatedInvoiceType('receipt');
      setCreatedOperationId(updatedOperation?.id || operation.id);
      setShowSuccessModal(true);

      // Clear form
      setSelectedCategory(null);
      setCustomCategoryName('');
      setSelectedColor(null);
      setSelectedServices([]);
      setShoes([]);
      setRetailItems([]);
      setSelectedCustomer(null);
      setOperationStatus('none');
      setDiscountAmount(0);
      setActiveCartButtons([]);
      setOperationPayments([]);
      setHasPayments(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      if (error instanceof Error) {
        alert(error.message || 'Failed to process payment');
      } else {
        alert('Failed to process payment');
      }
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
      // handleCancel();

      // Navigate to operations page
      // navigate('/operations');
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

      // handleCancel();
      // navigate('/operations');
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

      // handleCancel();
      // navigate('/operations');
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

      // handleCancel();
      // navigate('/operations');
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

      // handleCancel();
      // navigate('/operations');
    } catch (error) {
      console.error('Error creating pickup operation:', error);
    }
  };

  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [operationPayments, setOperationPayments] = useState<any[]>([]);
  const [hasPayments, setHasPayments] = useState(false);

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
      // handleCancel();
      // navigate('/operations');
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
      // handleCancel();
      // navigate('/operations');
    } catch (error) {
      console.error('Error creating split tickets:', error);
    }
  };

  const handleCancel = () => {
    setSelectedCategory(null);
    setSelectedColor(null);
    setSelectedServices([]);
    setShoes([]);
    setRetailItems([]);
    setOperationStatus('none');
  };

  const handleClearLastEntry = () => {
    if (shoes.length > 0) {
      setShoes(prev => prev.slice(0, -1));
    } else if (retailItems.length > 0) {
      setRetailItems(prev => prev.slice(0, -1));
    }
  };

  const handleDeleteItem = () => {
    if (selectedCategory || selectedColor || selectedServices.length > 0) {
      setSelectedCategory(null);
      setSelectedColor(null);
      setSelectedServices([]);
    }
  };

  const toggleCartButton = (buttonName: string) => {
    setActiveCartButtons(prevState => {
      if (buttonName === 'pickup' && prevState.includes('delivery')) {
        return prevState.filter(name => name !== 'delivery').concat(buttonName);
      } else if (buttonName === 'delivery' && prevState.includes('pickup')) {
        return prevState.filter(name => name !== 'pickup').concat(buttonName);
      } else if (prevState.includes(buttonName)) {
        return prevState.filter(name => name !== buttonName);
      } else {
        return [...prevState, buttonName];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Categories and Colors (Indigo Theme) */}
        <div className="col-span-3 space-y-4">
          {/* Categories */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg border-t-4 border-t-indigo-500">
            <h2 className="text-sm font-semibold mb-3 text-white flex items-center">
              <Scissors className="text-indigo-400 mr-2 w-4 h-4" />
              Category
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    if (category.id === 'other') {
                      setCustomCategoryName('');
                    } else {
                      setCustomCategoryName('');
                    }
                  }}
                  className={`bg-gray-900 hover:bg-gray-700 p-3 rounded-xl transition-all duration-300 group
                    ${selectedCategory === category.id ? 'ring-2 ring-indigo-500 bg-gray-700' : 'border border-gray-700 hover:border-indigo-500'}
                  `}
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{category.icon}</div>
                  <div className="text-[10px] text-gray-300 group-hover:text-white transition-colors truncate">{category.name}</div>
                </button>
              ))}
            </div>

            {/* Custom Category Input - Shows when "Other" is selected */}
            {selectedCategory === 'other' && (
              <div className="mt-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
                <label className="block text-sm text-gray-300 mb-2">
                  Please specify the service type:
                </label>
                <input
                  type="text"
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  placeholder="e.g., Bag Repair, Belt Replacement, etc."
                  className="w-full bg-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  autoFocus
                />
                {customCategoryName && (
                  <p className="text-sm text-green-400 mt-2">
                    Custom: {customCategoryName}
                  </p>
                )}

                {/* Manual Price Option */}
                {customCategoryName && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        id="useManualPrice"
                        checked={useManualPrice}
                        onChange={(e) => {
                          setUseManualPrice(e.target.checked);
                          if (e.target.checked) {
                            setSelectedServices([]);
                          } else {
                            setManualPrice('');
                          }
                        }}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      <label htmlFor="useManualPrice" className="text-sm text-gray-300 cursor-pointer">
                        Set custom price instead of selecting services
                      </label>
                    </div>

                    {useManualPrice && (
                      <div className="space-y-2">
                        <label className="block text-sm text-gray-300">
                          Enter total price (UGX):
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={manualPrice}
                          onChange={(e) => setManualPrice(e.target.value)}
                          placeholder="e.g., 50000"
                          className="w-full bg-gray-600 rounded-lg px-4 py-3 text-white text-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          autoFocus
                        />
                        {manualPrice && (
                          <p className="text-sm text-green-400">
                            Custom price: {formatCurrency(parseInt(manualPrice) || 0)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Quick Add Button */}
                    {selectedCategory === 'other' && customCategoryName && useManualPrice && manualPrice && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleQuickAddToCart()}
                          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Plus size={20} />
                          <span>Quick Add to Cart - {formatCurrency(parseInt(manualPrice) || 0)}</span>
                        </button>
                        <p className="text-xs text-gray-400 text-center mt-2">
                          Adds directly to cart and clears form for next entry
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Colors - Compact 2-line selector */}
          <div className="bg-gray-800 rounded-xl p-3 border border-gray-700 shadow-lg border-t-4 border-t-indigo-400">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-white flex items-center">
                <Palette className="text-indigo-400 mr-2 w-3 h-3" />
                Color
              </h2>
              <span className="text-[10px] text-gray-400">{selectedColor ? colors.find(c => c.id === selectedColor)?.name : 'None'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`relative w-6 h-6 rounded-full transition-all duration-200 flex-shrink-0
                    ${selectedColor === color.id ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-gray-800 scale-110' : 'hover:scale-105 hover:ring-1 hover:ring-gray-500'}
                  `}
                  title={color.name}
                  style={color.isRainbow ? {
                    background: 'linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff)',
                  } : {
                    backgroundColor: color.hexCode,
                    border: color.hexCode === '#FFFFFF' || color.hexCode === '#F5F5DC' ? '1px solid #555' : 'none'
                  }}
                >
                  {selectedColor === color.id && !color.isRainbow && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full shadow"></div>
                    </div>
                  )}
                  {selectedColor === color.id && color.isRainbow && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full shadow"></div>
                    </div>
                  )}
                </button>
              ))}
              <button
                onClick={() => setSelectedColor(null)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-all duration-200 flex-shrink-0
                  ${selectedColor === null ? 'ring-2 ring-gray-500 bg-gray-700 text-white' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600'}
                `}
                title="No Color"
              >
                ✕
              </button>
            </div>
            {/* Color Description Input */}
            {selectedColor && (
              <div className="mt-2">
                <input
                  type="text"
                  value={colorDescription}
                  onChange={(e) => setColorDescription(e.target.value)}
                  placeholder="Color details..."
                  maxLength={60}
                  className="w-full bg-gray-700/50 rounded-lg px-2 py-1.5 text-[10px] text-white placeholder-gray-400 border border-gray-600 focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            )}
          </div>

          {/* Products Section */}
          <ProductSalesSection
            isAdmin={adminMode}
            onProductSelect={handleAddRetailItemToCart}
            onEditProduct={(product) => {
              setEditingProduct(product);
              setProductModalOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            onAddProduct={() => {
              setEditingProduct(null);
              setProductModalOpen(true);
            }}
          />
        </div>

        {/* Middle Column - Customer and Services (Violet Theme) */}
        <div className="col-span-6 space-y-6">
          {/* Customer Section */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg border-t-4 border-t-violet-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-violet-500 bg-opacity-20 rounded-xl">
                  <User className="text-2xl text-violet-400" />
                </div>
                {selectedCustomer ? (
                  <div>
                    <h3 className="text-xl font-semibold text-white">{selectedCustomer.name}</h3>
                    <div className="text-sm text-gray-400 space-y-2 mt-1">
                      <p className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {selectedCustomer.phone}
                      </p>
                      {selectedCustomer.email && (
                        <p className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {selectedCustomer.email}
                        </p>
                      )}
                      <p className="flex items-center text-yellow-400">
                        <Star className="h-4 w-4 mr-2" />
                        {selectedCustomer.loyaltyPoints} points
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">No customer selected</p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowCustomerSearch(prev => !prev)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <Search size={18} className="mr-2" />
                  Find
                </button>
                <button
                  onClick={handleOpenAddCustomer}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Add
                </button>
              </div>
            </div>

            {showCustomerSearch && (
              <div className="mt-4 bg-gray-900 rounded-xl p-4 border border-gray-700">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-gray-700"
                    value={customerSearchTerm}
                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 border border-transparent hover:border-gray-700"
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">{customer.name}</p>
                          <p className="text-sm text-gray-400 mt-1">{customer.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-indigo-400">{customer.totalOrders} orders</p>
                          <p className="text-sm text-green-400 mt-1">{formatCurrency(customer.totalSpent)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Service Selection */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg border-t-4 border-t-violet-400">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Scissors className="text-violet-400 mr-2" />
                  Select Services
                </h2>
                {isAdmin && (
                  <button
                    onClick={() => setAdminMode(!adminMode)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-colors ${adminMode
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                  >
                    <Settings size={16} />
                    <span>{adminMode ? 'Exit Admin Mode' : 'Admin Mode'}</span>
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {selectedServices.length > 0 && (
                  <>
                    <div className="text-sm text-gray-400">
                      {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                    </div>
                    <div className="text-xl font-semibold text-green-400">
                      {formatCurrency(currentSelectionTotal)}
                    </div>
                  </>
                )}
                {adminMode && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleAddService}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Service
                    </button>
                    <button
                      onClick={() => setCategoryModalOpen(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center"
                    >
                      <FolderOpen size={16} className="mr-1" />
                      Manage Categories
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-2">
              <button
                onClick={() => {
                  setSelectedCategoryFilter('all');
                  setServiceSearchTerm('');
                }}
                className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-colors ${selectedCategoryFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                All ({services?.length || 0})
              </button>
              {Array.isArray(services) && Array.from(new Set(services.map(s => s.category || 'other'))).sort().map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategoryFilter(category);
                    setServiceSearchTerm('');
                  }}
                  className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-colors capitalize ${selectedCategoryFilter === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  {category} ({services.filter(s => (s.category || 'other') === category).length})
                </button>
              ))}
            </div>

            {/* Service Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-10 py-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-gray-700"
                value={serviceSearchTerm}
                onChange={(e) => setServiceSearchTerm(e.target.value)}
              />
              {serviceSearchTerm && (
                <button
                  onClick={() => setServiceSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  title="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Services Grid */}
            {(() => {
              const filteredServices = Array.isArray(services) ? services.filter(service => {
                // When searching, ignore category filter and search across all categories
                if (serviceSearchTerm !== '') {
                  return service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase());
                }

                // When not searching, apply category filter
                return selectedCategoryFilter === 'all' ||
                  (service.category || 'other') === selectedCategoryFilter;
              }) : [];

              return (
                <>
                  {/* Search result count */}
                  {serviceSearchTerm && filteredServices.length > 0 && (
                    <div className="text-sm text-gray-400 mb-3">
                      Found {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} matching "{serviceSearchTerm}"
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {servicesLoading ? (
                      <div className="col-span-2 text-center text-gray-400 py-8">
                        Loading services...
                      </div>
                    ) : !Array.isArray(services) || services.length === 0 ? (
                      <div className="col-span-2 text-center text-gray-400 py-8">
                        No services available. Please add services first.
                      </div>
                    ) : filteredServices.length === 0 ? (
                      <div className="col-span-2 text-center text-gray-400 py-8">
                        {serviceSearchTerm
                          ? `No services found matching "${serviceSearchTerm}"`
                          : 'No services available in this category.'
                        }
                      </div>
                    ) : (
                      filteredServices.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => {
                            if (!adminMode) {
                              if (selectedServices.includes(service.id)) {
                                setSelectedServices(prev => prev.filter(id => id !== service.id));
                              } else {
                                setSelectedServices(prev => [...prev, service.id]);
                              }
                            }
                          }}
                          className={`p-4 rounded-xl transition-all duration-300 relative ${selectedServices.includes(service.id)
                              ? 'bg-indigo-600 hover:bg-indigo-700'
                              : 'bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-indigo-500'
                            } ${adminMode ? 'cursor-default' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-white">{service.name}</span>
                                {service.category && (
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-600 text-gray-300 capitalize">
                                    {service.category}
                                  </span>
                                )}
                              </div>
                              <span className={`font-semibold ${selectedServices.includes(service.id) ? 'text-white' : 'text-indigo-400'
                                }`}>
                                {formatCurrency(service.price)}
                              </span>
                            </div>

                            {adminMode && (
                              <div className="flex items-center space-x-1 ml-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditService(service);
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                                  title="Edit service"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteService(service.id);
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                  title="Delete service"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </>
              );
            })()}

            {/* Color Selection and Size Selection */}
            {selectedServices.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
                {/* Color Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-400">Color:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedColor(null)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${selectedColor === null
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                      >
                        None
                      </button>
                      {colors.slice(0, 8).map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color.id)}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${selectedColor === color.id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          title={color.name}
                        >
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Size Row - only for shoes, not bags or other */}
                {needsSize(selectedCategory) && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-400">Size:</span>
                      <input
                        type="text"
                        value={sizeInput}
                        onChange={(e) => setSizeInput(e.target.value)}
                        placeholder="e.g., US 9, UK 8.5"
                        className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-40"
                      />
                    </div>
                    <button
                      onClick={handleAddShoe}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <Plus size={18} className="mr-2" />
                      Add to Cart
                    </button>
                  </div>
                )}
                {/* Add to Cart button for bags/other (no size needed) */}
                {!needsSize(selectedCategory) && selectedServices.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddShoe}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <Plus size={18} className="mr-2" />
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Cart (Emerald Theme) */}
        <div className="col-span-3">
          <div id="cart-summary" className="card-bevel p-6 bg-gradient-to-br from-emerald-950/50 via-gray-900 to-gray-900 border-t-4 border-t-emerald-500 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-900/50 border border-emerald-700/50">
                  <Package size={20} className="text-emerald-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-200">Cart Summary</h2>
              </div>
              <div className="flex items-center space-x-3 bg-emerald-900/30 rounded-lg px-4 py-2 border border-emerald-800/50">
                <span className="text-gray-400 text-sm">Total:</span>
                <span className="text-emerald-400 font-semibold">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {shoes.map((shoe, index) => (
                <div key={shoe.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-emerald-600 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-900/30 border border-emerald-700/50">
                        <span className="text-lg">
                          {shoe.category.startsWith('other-')
                            ? '🔧'
                            : categories.find(c => c.id === shoe.category)?.icon
                          }
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-200">
                          {shoe.description}
                          {shoe.manualPrice && (
                            <span className="ml-2 text-xs text-orange-400 bg-orange-900/40 px-2 py-0.5 rounded-full">
                              Custom
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center space-x-3 mt-1">
                          {shoe.color && shoe.color !== 'none' && (() => {
                            const shoeColor = colors.find(c => c.id === shoe.color);
                            if (!shoeColor) return null;
                            return (
                              <div className="flex items-center space-x-1">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={shoeColor.isRainbow ? {
                                    background: 'linear-gradient(135deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff)'
                                  } : {
                                    backgroundColor: shoeColor.hexCode,
                                    border: shoeColor.hexCode === '#FFFFFF' || shoeColor.hexCode === '#F5F5DC' ? '1px solid #555' : 'none'
                                  }}
                                />
                                <span className="text-xs text-gray-400">{shoeColor.name}</span>
                                {shoe.colorDescription && (
                                  <span className="text-xs text-indigo-400 italic ml-1">"{shoe.colorDescription}"</span>
                                )}
                              </div>
                            );
                          })()}
                          {shoe.size && (
                            <span className="text-xs text-emerald-400">Size {shoe.size}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-green-400">
                        {shoe.manualPrice
                          ? formatCurrency(shoe.manualPrice)
                          : formatCurrency(shoe.services.reduce((sum, s) => sum + s.price, 0))
                        }
                      </span>
                      <button
                        onClick={() => handleRemoveShoe(shoe.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 hover:text-red-400 hover:bg-red-900/40 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Retail Items */}
              {retailItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-amber-400 flex items-center">
                      <ShoppingBag size={14} className="mr-2" />
                      Retail Items
                    </h3>
                    <span className="text-xs text-gray-400">{retailItems.length} item(s)</span>
                  </div>
                  {retailItems.map((item) => (
                    <div key={item.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-amber-600 transition-colors group mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-amber-900/30 border border-amber-700/50 flex items-center justify-center">
                              <span className="text-lg">{item.icon || '🛍️'}</span>
                            </div>
                          )}
                          <div>
                            <h4 className="text-sm font-medium text-gray-200">{item.productName}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-400">{formatCurrency(item.unitPrice)} x {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-green-400">
                            {formatCurrency(item.totalPrice)}
                          </span>
                          <button
                            onClick={() => handleRemoveRetailItem(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 hover:text-red-400 hover:bg-red-900/40 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(shoes.length > 0 || retailItems.length > 0) && (
              <div className="mt-6 space-y-4">
                {/* Pickup Date & Time */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 border-l-4 border-l-emerald-500">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-emerald-400" />
                      <span className="text-sm font-medium text-gray-300">Pickup Date & Time</span>
                    </div>
                    {getTentativeReadyDate() && (
                      <span className="text-xs text-emerald-400/70">Suggested: {getTentativeReadyDate()} by 5pm</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="date"
                      value={promisedDate}
                      onChange={(e) => setPromisedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="flex-1 bg-gray-700/50 rounded-lg border border-gray-600 px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="time"
                      value={promisedTime}
                      onChange={(e) => setPromisedTime(e.target.value)}
                      className="w-28 bg-gray-700/50 rounded-lg border border-gray-600 px-3 py-2 text-sm text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    {promisedDate && promisedTime && (
                      <div className="flex items-center px-3 py-2 bg-indigo-900/30 rounded-lg text-xs text-indigo-300 space-x-1">
                        <Clock size={12} />
                        <span>{new Date(`${promisedDate}T${promisedTime}`).toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setPriceOverrideInput(cartPriceOverride !== null ? cartPriceOverride.toString() : calculateTotal().toString());
                      setShowPriceOverrideModal(true);
                    }}
                    className={`p-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${cartPriceOverride !== null
                        ? 'bg-orange-900/40 text-orange-400 border border-orange-500/50'
                        : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50'
                      }`}
                  >
                    <DollarSign size={16} />
                    <span className="text-sm font-medium">
                      {cartPriceOverride !== null ? 'Price Set' : 'Change Price'}
                    </span>
                  </button>
                  <button
                    onClick={() => setShowDiscountModal(true)}
                    className="p-3 rounded-lg flex items-center justify-center space-x-2 bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50 transition-all relative"
                  >
                    <Percent size={16} />
                    <span className="text-sm font-medium">Discount</span>
                    {discountAmount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </button>
                </div>

                {/* Applied Adjustments */}
                {cartPriceOverride !== null && (
                  <div className="flex justify-between items-center bg-orange-900/20 rounded-lg px-4 py-3 border border-orange-500/30">
                    <span className="text-sm text-orange-300">Price Override</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-orange-400">{formatCurrency(cartPriceOverride)}</span>
                      <button
                        onClick={() => setCartPriceOverride(null)}
                        className="text-xs text-orange-500 hover:text-orange-300"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center bg-pink-900/20 rounded-lg px-4 py-3 border border-pink-500/30">
                    <span className="text-sm text-pink-300">Discount</span>
                    <span className="text-sm font-semibold text-pink-400">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                {/* Payment Section */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 border-l-4 border-l-cyan-500 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-200 flex items-center space-x-2">
                        <CreditCard size={16} className="text-cyan-400" />
                        <span>Payment</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {selectedCustomer ? selectedCustomer.name : 'Select a customer'}
                      </p>
                      {selectedCustomer?.accountBalance && selectedCustomer.accountBalance > 0 && (
                        <p className="text-xs text-emerald-400 mt-0.5">Credit: {formatCurrency(selectedCustomer.accountBalance)}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <CreditCard size={16} />
                      <span>Record Payment</span>
                    </button>
                  </div>

                  {operationPayments && operationPayments.length > 0 && (
                    <div className="pt-3 border-t border-gray-700">
                      <div className="flex items-center space-x-2">
                        {operationPayments.map((payment: any, index: number) => (
                          <div key={index} className="flex items-center space-x-2 px-3 py-1.5 bg-green-900/30 rounded-lg border border-green-500/30">
                            <span className="text-xs text-green-400 capitalize">{payment.payment_method.replace('_', ' ')}</span>
                            <span className="text-xs font-semibold text-green-300">{formatCurrency(payment.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Finish Button */}
                {!hasPayments && (
                  <button
                    onClick={handleSubmit}
                    className="w-full p-4 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/30"
                  >
                    <CheckCircle size={20} />
                    <span>Finish</span>
                  </button>
                )}

                {hasPayments && (
                  <div className="text-center text-sm text-gray-400 py-4">
                    Payment recorded. Form will clear automatically.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={handleCustomerModalClose}
        onSave={isEditingCustomer ? updateCustomer : handleAddCustomer}
        initialData={isEditingCustomer ? selectedCustomer : undefined}
      />

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Apply Discount</h2>

            {/* Current Total */}
            <div className="bg-gray-700 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Current Total:</span>
                <span className="text-white font-semibold">{formatCurrency(shoes.reduce((total, shoe) => total + shoe.services.reduce((sum, s) => sum + s.price, 0), 0))}</span>
              </div>
            </div>

            {/* Discount Input */}
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Discount Amount (UGX)
            </label>
            <input
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
              className="w-full bg-gray-700 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
              placeholder="Enter discount amount"
              min="0"
            />

            {/* New Total */}
            <div className="bg-indigo-900/30 rounded-lg p-3 mb-4 border border-indigo-700">
              <div className="flex justify-between items-center">
                <span className="text-indigo-300 font-medium">New Total:</span>
                <span className="text-indigo-400 font-bold text-lg">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDiscountModal(false);
                  setDiscountAmount(0);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDiscountModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
              >
                Apply Discount
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Price Override Modal */}
      {showPriceOverrideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Change Total Price</h2>

            {/* Calculated Total */}
            <div className="bg-gray-700 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Calculated Total:</span>
                <span className="text-white font-semibold">
                  {formatCurrency(shoes.reduce((total, shoe) => {
                    if (shoe.manualPrice) {
                      return total + shoe.manualPrice;
                    }
                    return total + shoe.services.reduce((sum, service) => sum + (service.price || 0) * (service.quantity || 1), 0);
                  }, 0))}
                </span>
              </div>
            </div>

            {/* Price Override Input */}
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Total Price (UGX)
            </label>
            <input
              type="number"
              value={priceOverrideInput}
              onChange={(e) => setPriceOverrideInput(e.target.value)}
              className="w-full bg-gray-700 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-white"
              placeholder="Enter new total price"
              min="0"
            />

            {/* New Total After Discount */}
            {discountAmount > 0 && (
              <div className="bg-indigo-900/30 rounded-lg p-3 mb-4 border border-indigo-700">
                <div className="flex justify-between items-center">
                  <span className="text-indigo-300 font-medium">After Discount:</span>
                  <span className="text-indigo-400 font-bold text-lg">
                    {formatCurrency(Math.max(0, (parseInt(priceOverrideInput) || 0) - discountAmount))}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPriceOverrideModal(false);
                  setPriceOverrideInput('');
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newPrice = parseInt(priceOverrideInput);
                  if (!isNaN(newPrice) && newPrice >= 0) {
                    setCartPriceOverride(newPrice);
                  }
                  setShowPriceOverrideModal(false);
                  setPriceOverrideInput('');
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors duration-200"
              >
                Apply Price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service CRUD Modal */}
      {serviceModalOpen && (
        <ServiceCRUDModal
          isOpen={serviceModalOpen}
          onClose={() => {
            setServiceModalOpen(false);
            setEditingService(null);
          }}
          onSave={handleSaveService}
          service={editingService}
          mode={editingService ? 'edit' : 'add'}
        />
      )}

      {/* Category Manager Modal */}
      {categoryModalOpen && (
        <CategoryManagerModal
          isOpen={categoryModalOpen}
          onClose={() => setCategoryModalOpen(false)}
          services={services}
          onRenameCategory={handleRenameCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {/* Product CRUD Modal */}
      <ProductCRUDModal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
        onDelete={editingProduct ? () => handleDeleteProduct(editingProduct.id) : undefined}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={calculateTotal()}
        customer={selectedCustomer}
        onComplete={async (payments) => {
          await handlePaymentCompletion(payments);
        }}
      />

      {/* Success Modal - Show after operation creation with invoice/receipt */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl overflow-hidden">
            <div className={`p-6 text-center ${createdInvoiceType === 'receipt'
                ? 'bg-gradient-to-r from-emerald-900/50 to-green-900/50'
                : 'bg-gradient-to-r from-orange-900/50 to-amber-900/50'
              }`}>
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${createdInvoiceType === 'receipt'
                  ? 'bg-emerald-500/20'
                  : 'bg-orange-500/20'
                }`}>
                {createdInvoiceType === 'receipt' ? (
                  <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {createdInvoiceType === 'receipt' ? 'Payment Complete!' : 'Drop-off Recorded!'}
              </h3>
              <p className="text-sm text-gray-300">
                {createdInvoiceType === 'receipt'
                  ? 'Receipt has been generated automatically'
                  : 'Invoice has been generated automatically'}
              </p>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-center text-gray-400 text-sm">
                Would you like to print the {createdInvoiceType}?
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    if (createdOperationId) {
                      try {
                        // First create the invoice/receipt
                        const invoiceRes = await fetch('http://localhost:3000/api/invoices', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            operationId: createdOperationId,
                            type: createdInvoiceType
                          })
                        });

                        let invoiceId = null;

                        if (invoiceRes.ok) {
                          // New invoice created successfully
                          const invoice = await invoiceRes.json();
                          invoiceId = invoice.id;
                        } else {
                          // Check if invoice already exists
                          const err = await invoiceRes.json();
                          if (err && err.invoiceId) {
                            // Use existing invoice
                            invoiceId = err.invoiceId;
                          } else {
                            // Real error
                            toast.error(err?.error || 'Failed to create invoice');
                            setShowSuccessModal(false);
                            setCreatedOperationId(null);
                            return;
                          }
                        }

                        // Now print with the invoice ID
                        if (invoiceId) {
                          const printRes = await fetch(`http://localhost:3000/api/invoices/${invoiceId}/print`, {
                            method: 'POST'
                          });
                          const printData = await printRes.json();
                          if (printData.success) {
                            toast.success(printData.simulated ? 'Print simulated (no printer)' : 'Receipt printed');
                          } else {
                            toast.error(printData.error || 'Print failed');
                          }
                        }
                      } catch (error) {
                        console.error('Print error:', error);
                        toast.error('Failed to print');
                      }
                    }
                    setShowSuccessModal(false);
                    setCreatedOperationId(null);
                  }}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${createdInvoiceType === 'receipt'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                >
                  <Printer size={18} />
                  <span>Print {createdInvoiceType === 'receipt' ? 'Receipt' : 'Invoice'}</span>
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setCreatedOperationId(null);
                  }}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
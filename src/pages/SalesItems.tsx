import React, { useState } from 'react';
import { ShoppingCart, Minus, Plus, Printer, X, Scan, Search, Tag, Package, DollarSign, Plus as PlusIcon } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';

interface SalesItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url?: string;
}

interface CartItem {
  item: SalesItem;
  quantity: number;
}

// Sample items data
const sampleItems: SalesItem[] = [
  { id: '1', name: 'Grip-N-Shine', price: 8.99, category: 'Shine', image_url: 'https://images.unsplash.com/photo-1534653299134-96a171b61581?w=400' },
  { id: '2', name: 'Kiwi Desert Boot Care Kit', price: 13.99, category: 'Boot Trees', image_url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400' },
  { id: '3', name: 'Kiwi Shine Kit', price: 14.99, category: 'Shine', image_url: 'https://images.unsplash.com/photo-1563903530908-afdd155d057a?w=400' },
  { id: '4', name: 'Kiwi Travel Kit', price: 13.99, category: 'Kits', image_url: 'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?w=400' },
  { id: '5', name: 'Rochester Executive Shoe Care', price: 79.99, category: 'Kits', image_url: 'https://images.unsplash.com/photo-1553808373-2c0eff3a4246?w=400' },
  { id: '6', name: 'Shine Butler', price: 29.99, category: 'Shine', image_url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400' },
  { id: '7', name: 'Shoe Shine Box Empty', price: 29.99, category: 'Kits', image_url: 'https://images.unsplash.com/photo-1563903530908-afdd155d057a?w=400' },
  { id: '8', name: 'Shoe Shine Box Kit', price: 42.99, category: 'Kits', image_url: 'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?w=400' },
  { id: '9', name: 'Shoebox Supplies', price: 13.99, category: 'Supplies', image_url: 'https://images.unsplash.com/photo-1553808373-2c0eff3a4246?w=400' },
];

const categories = [
  ['Boot Trees', 'Brushes', 'Cleaners', 'Conditioners', 'Dyes', 'Foot Aids', 'Insoles', 'Laces', "Men's Shoe Trees", 'Shoe Horns'],
  ['Shoe Polish', 'Shoe Shine Kits', 'Stretchers', 'Tools & Misc. Items', 'Waterproofers', "Women's Shoe Trees", 'Shine', 'UPS']
];

export default function SalesItems() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [discountOrUpcharge, setDiscountOrUpcharge] = useState(0);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddToCart = (item: SalesItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
    updateTotals();
  };

  const updateTotals = () => {
    const newSubtotal = cart.reduce((sum, item) => sum + (item.quantity * item.item.price), 0);
    const newTax = newSubtotal * 0.07; // 7% tax rate
    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newSubtotal + newTax + discountOrUpcharge);
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = sampleItems.find(item => item.id === barcodeInput);
    if (item) {
      handleAddToCart(item);
      setBarcodeInput('');
    }
  };

  const filteredItems = selectedCategory
    ? sampleItems.filter(item => item.category === selectedCategory)
    : sampleItems;

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-blue-600 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/ShoeMax.png" alt="ShoeMax" className="h-6" />
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-blue-300" size={20} />
            <input
              type="text"
              placeholder="Search items..."
              className="w-96 px-4 py-2 pl-10 bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
          >
            <Plus size={18} />
            <span>Add Item</span>
          </button>
          <button 
            onClick={() => setShowCart(!showCart)}
            className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
          >
            <ShoppingCart size={18} />
            <span>Cart ({cart.length})</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
            <Package size={18} />
            <span>Quantity</span>
          </button>
          <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            <Tag size={18} />
            <span>Discount</span>
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="bg-gray-900 p-4 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex space-x-8">
            <div>
              <span className="text-gray-400">Subtotal</span>
              <div className="text-white">${subtotal.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-gray-400">Discount/Upcharge</span>
              <div className="text-white">${discountOrUpcharge.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-gray-400">Tax</span>
              <div className="text-white">${tax.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-gray-400">Total</span>
              <div className="text-green-500 font-bold">${total.toFixed(2)}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
              <span>Taxable</span>
            </button>
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
              <span>Receipt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 grid grid-cols-10 gap-2">
        {categories[0].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`p-2 text-white rounded-lg ${
              selectedCategory === category
                ? 'bg-blue-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="px-4 grid grid-cols-8 gap-2">
        {categories[1].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`p-2 text-white rounded-lg ${
              selectedCategory === category
                ? 'bg-blue-600'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-5 gap-4">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleAddToCart(item)}
              className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
            >
              <div className="aspect-square bg-gray-700 relative overflow-hidden">
                <img
                  src={item.image_url || '/placeholder.png'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium text-lg mb-2">{item.name}</h3>
                <p className="text-green-500 font-bold">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl transform transition-transform duration-300 ${
          showCart ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-500">
            <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
            <button onClick={() => setShowCart(false)} className="text-white hover:text-gray-200">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 mb-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.item.image_url || '/placeholder.png'}
                    alt={item.item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{item.item.name}</div>
                    <div className="text-sm text-gray-600">
                      ${item.item.price.toFixed(2)} x {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      setCart(prevCart =>
                        prevCart.map((cartItem, i) =>
                          i === index
                            ? { ...cartItem, quantity: Math.max(1, cartItem.quantity - 1) }
                            : cartItem
                        )
                      );
                      updateTotals();
                    }}
                    className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => {
                      setCart(prevCart =>
                        prevCart.map((cartItem, i) =>
                          i === index
                            ? { ...cartItem, quantity: cartItem.quantity + 1 }
                            : cartItem
                        )
                      );
                      updateTotals();
                    }}
                    className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => console.log('Checkout button clicked')}
              disabled={cart.length === 0}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>Complete Purchase</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories.flat()}
        onSave={(product) => {
          // Add the new product to the items list
          const newItem: SalesItem = {
            id: String(sampleItems.length + 1),
            name: product.name,
            price: product.price,
            category: product.category,
            image_url: product.image || undefined
          };
          sampleItems.push(newItem);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}

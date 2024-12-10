import React, { useState, useEffect } from 'react';

interface SalesItem {
  id: string;
  name: string;
  price: number;
  category_id: string;
  image_path?: string;
}

interface CartItem {
  quantity: number;
  item: SalesItem;
}

export default function SalesItems() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<SalesItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Fetch categories and items from your API
    fetchCategories();
    fetchItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/sales-categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/sales-items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleItemClick = (item: SalesItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { quantity: 1, item }];
    });
    updateTotals();
  };

  const updateTotals = () => {
    const newSubtotal = cart.reduce((sum, item) => sum + (item.quantity * item.item.price), 0);
    const newTax = newSubtotal * 0.07; // 7% tax rate
    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newSubtotal + newTax);
  };

  return (
    <div className="flex h-screen p-4">
      <div className="flex-grow mr-4">
        {/* Categories Grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="h-15 bg-[#8FA093] text-white hover:bg-[#7A8A7D] p-2 rounded"
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-4 gap-2">
          {items
            .filter(item => !selectedCategory || item.category_id === selectedCategory)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="h-30 bg-[#FFFFD4] text-black hover:bg-[#FFFFE4] p-2 rounded flex flex-col items-center justify-between border border-gray-300"
              >
                {item.image_path && (
                  <img
                    src={item.image_path}
                    alt={item.name}
                    className="h-15 mb-2"
                  />
                )}
                <span className="text-sm">{item.name}</span>
                <span className="text-base">${item.price.toFixed(2)}</span>
              </button>
            ))}
        </div>
      </div>

      <div className="w-1/4">
        {/* Cart and Actions */}
        <div className="bg-white p-4 mb-4 rounded shadow">
          <div className="mb-4">
            {cart.map((cartItem) => (
              <div key={cartItem.item.id} className="flex justify-between mb-2">
                <span>{cartItem.quantity}x {cartItem.item.name}</span>
                <span>${(cartItem.quantity * cartItem.item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 pt-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-[#2E5090] text-white hover:bg-[#1E4080] p-2 rounded mb-2">
          Quantity
        </button>
        <button className="w-full bg-[#2E5090] text-white hover:bg-[#1E4080] p-2 rounded mb-2">
          Delete
        </button>
        <button className="w-full bg-red-600 text-white hover:bg-red-700 p-2 rounded mb-4">
          Discount
        </button>

        {/* Discount Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {['-$1.00', '$1.00', '$3.00', '$5.00', '$10.00', '$20.00'].map((amount) => (
            <button
              key={amount}
              className="bg-[#C4A484] text-white hover:bg-[#B39474] p-2 rounded"
            >
              {amount}
            </button>
          ))}
          <button className="bg-[#C4A484] text-white hover:bg-[#B39474] p-2 rounded">
            Adjust Price
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, Printer, ShoppingCart, Search, List, X } from 'lucide-react';

interface SupplyItem {
  itemNo: string;
  vendor: string;
  upcSku: string;
  description: string;
  location: string;
  cost: number;
  onHand: number;
  minStock: number;
}

interface Category {
  name: string;
  items: SupplyItem[];
}

export default function SuppliesPage() {
  const [activeTab, setActiveTab] = useState<'retail' | 'supplies' | 'raw' | 'tools' | 'others'>('supplies');
  const [selectedCategory, setSelectedCategory] = useState<string>('Glue & Thinner');

  const categories: Category[] = [
    { name: 'Buckles', items: [] },
    { name: 'Cleaners', items: [] },
    { name: 'Dowel Tubes', items: [] },
    { name: 'Dye', items: [] },
    { name: 'Elastics', items: [] },
    { name: 'Glue & Thinner', items: [
      { itemNo: '', vendor: '', upcSku: '', description: 'Cement', location: '', cost: 0, onHand: 0, minStock: 0 },
      { itemNo: '', vendor: '', upcSku: '', description: 'Fast Fix Activator', location: '', cost: 0, onHand: 0, minStock: 0 },
      { itemNo: '', vendor: '', upcSku: '', description: 'Five Star Super Glue', location: '', cost: 0, onHand: 0, minStock: 0 },
      { itemNo: '', vendor: '', upcSku: '', description: 'Thinner', location: '', cost: 0, onHand: 0, minStock: 0 }
    ] },
    { name: 'Heels', items: [] },
    { name: 'Insoles - Pads & Sock Lining', items: [] },
    { name: 'Leather & Rubber', items: [] },
    { name: 'Nails', items: [] },
    { name: 'Needles', items: [] },
    { name: 'Rivets', items: [] },
    { name: 'Sand Paper', items: [] },
    { name: 'Shanks', items: [] }
  ];

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Top Navigation */}
      <div className="flex space-x-1 p-2 bg-gray-700">
        <button 
          className={`btn-bevel px-6 py-2 rounded ${activeTab === 'retail' ? 'bg-emerald-700' : 'bg-gray-600'}`}
          onClick={() => setActiveTab('retail')}
        >
          Retail Items
        </button>
        <button 
          className={`btn-bevel px-6 py-2 rounded ${activeTab === 'supplies' ? 'bg-emerald-700' : 'bg-gray-600'}`}
          onClick={() => setActiveTab('supplies')}
        >
          Supplies
        </button>
        <button 
          className={`btn-bevel px-6 py-2 rounded ${activeTab === 'raw' ? 'bg-emerald-700' : 'bg-gray-600'}`}
          onClick={() => setActiveTab('raw')}
        >
          Raw Materials
        </button>
        <button 
          className={`btn-bevel px-6 py-2 rounded ${activeTab === 'tools' ? 'bg-emerald-700' : 'bg-gray-600'}`}
          onClick={() => setActiveTab('tools')}
        >
          Tools
        </button>
        <button 
          className={`btn-bevel px-6 py-2 rounded ${activeTab === 'others' ? 'bg-emerald-700' : 'bg-gray-600'}`}
          onClick={() => setActiveTab('others')}
        >
          Others
        </button>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Sidebar - Categories */}
        <div className="w-64 bg-gray-700 p-2">
          <div className="font-medium mb-2 px-2">Main Item</div>
          <div className="space-y-0.5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`w-full text-left px-2 py-1.5 rounded ${
                  selectedCategory === category.name ? 'bg-gray-600' : 'hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 text-left">Item No</th>
                  <th className="px-4 py-2 text-left">Vendor</th>
                  <th className="px-4 py-2 text-left">UPC/SKU</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-right">Cost</th>
                  <th className="px-4 py-2 text-right">On Hand</th>
                  <th className="px-4 py-2 text-right">Min Stock</th>
                </tr>
              </thead>
              <tbody>
                {categories.find(c => c.name === selectedCategory)?.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'bg-green-100/10' : ''}>
                    <td className="px-4 py-2">{item.itemNo}</td>
                    <td className="px-4 py-2">{item.vendor}</td>
                    <td className="px-4 py-2">{item.upcSku}</td>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2">{item.location}</td>
                    <td className="px-4 py-2 text-right">{item.cost}</td>
                    <td className="px-4 py-2 text-right">{item.onHand}</td>
                    <td className="px-4 py-2 text-right">{item.minStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar - Actions */}
        <div className="w-32 bg-gray-700 p-2 space-y-2">
          <button className="btn-bevel bg-amber-600 w-full p-2 rounded text-center">
            Cost
          </button>
          <button className="btn-bevel bg-amber-600 w-full p-2 rounded text-center">
            Minimum Stock
          </button>
          <button className="btn-bevel bg-amber-600 w-full p-2 rounded text-center">
            Add Stock
          </button>
          <button className="btn-bevel bg-gray-600 w-full p-2 rounded text-center">
            Export
          </button>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="h-16 bg-gray-900 flex items-center justify-between px-4">
        <div className="flex space-x-2">
          <button className="btn-bevel bg-green-700 px-4 py-2 rounded flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </button>
          <button className="btn-bevel bg-blue-700 px-4 py-2 rounded flex items-center">
            <Edit2 className="h-5 w-5 mr-2" />
            Edit Item
          </button>
          <button className="btn-bevel bg-red-700 px-4 py-2 rounded flex items-center">
            <Trash2 className="h-5 w-5 mr-2" />
            Delete Item
          </button>
          <button className="btn-bevel bg-purple-700 px-4 py-2 rounded flex items-center">
            <Copy className="h-5 w-5 mr-2" />
            Copy Item
          </button>
          <button className="btn-bevel bg-cyan-700 px-4 py-2 rounded flex items-center">
            <Printer className="h-5 w-5 mr-2" />
            Print Label
          </button>
          <button className="btn-bevel bg-yellow-700 px-4 py-2 rounded flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </button>
          <button className="btn-bevel bg-indigo-700 px-4 py-2 rounded flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Item
          </button>
          <button className="btn-bevel bg-gray-700 px-4 py-2 rounded flex items-center">
            <List className="h-5 w-5 mr-2" />
            Print List
          </button>
          <button className="btn-bevel bg-orange-700 px-4 py-2 rounded flex items-center">
            <Copy className="h-5 w-5 mr-2" />
            Copy Items
          </button>
        </div>
        <button className="btn-bevel bg-green-700 px-4 py-2 rounded flex items-center">
          <X className="h-5 w-5 mr-2" />
          Close
        </button>
      </div>
    </div>
  );
}
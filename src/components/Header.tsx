import { ClipboardList, ShoppingBag } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="h-8 w-8" />
            <h1 className="text-2xl font-bold">RepairPro</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <a href="#dashboard" className="hover:text-indigo-200 transition-colors">
              Dashboard
            </a>
            <a href="#new-order" className="hover:text-indigo-200 transition-colors">
              New Order
            </a>
            <a href="#customers" className="hover:text-indigo-200 transition-colors">
              Customers
            </a>
          </nav>
          <button className="flex items-center space-x-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors">
            <ClipboardList className="h-5 w-5" />
            <span>New Repair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
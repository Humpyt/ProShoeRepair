import React from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie,
  faBullhorn,
  faCircleQuestion,
  faCalendarCheck,
  faMessage,
  faHandHoldingHand,
  faRotateLeft,
  faCreditCard,
  faMoneyBillTrendUp,
  faClockRotateLeft,
  faTruckFast,
  faTicket,
  faChartLine,
  faCartShopping,
  faCogs,
  faMagnifyingGlass,
  faBoxesStacked,
  faWarehouse,
  faBoxOpen,
  faMoneyBillTransfer,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';

export default function StorePage() {
  const quickInfo = [
    { label: 'Hold & Quick drop', count: 3, icon: faHandHoldingHand, color: '#4CAF50' },
    { label: 'No charge & Do over', count: 1, icon: faRotateLeft, color: '#2196F3' },
    { label: 'Credit', count: 2, icon: faCreditCard, color: '#9C27B0' },
    { label: 'Adjusted payment', count: 0, icon: faMoneyBillTrendUp, color: '#FF9800' },
    { label: 'Overdue', count: 5, icon: faClockRotateLeft, color: '#F44336' },
    { label: 'Ready by today', count: 8, icon: faBoxOpen, color: '#00BCD4' },
    { label: 'Delivery', count: 4, icon: faTruckFast, color: '#3F51B5' }
  ];

  const quickAccess = [
    { icon: faTicket, label: 'Ticket Search', color: '#E91E63' },
    { icon: faBoxesStacked, label: 'Assembly', color: '#673AB7' },
    { icon: faWarehouse, label: 'Racking', color: '#FF5722' },
    { icon: faHandshake, label: 'Pickup Order', color: '#795548' },
    { icon: faTruckFast, label: 'Deliveries', color: '#607D8B' },
    { icon: faMoneyBillTransfer, label: 'COD Payment', color: '#8BC34A' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          <button className="btn-bevel accent-primary px-6 py-3 rounded-lg flex items-center">
            <FontAwesomeIcon icon={faUserTie} className="text-[#4CAF50]" />
            <span className="ml-2">Management</span>
          </button>
          <button className="btn-bevel accent-secondary px-6 py-3 rounded-lg flex items-center">
            <FontAwesomeIcon icon={faBullhorn} className="text-[#FF5722]" />
            <span className="ml-2">Marketing</span>
          </button>
          <button className="btn-bevel accent-tertiary px-6 py-3 rounded-lg flex items-center">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-[#2196F3]" />
            <span className="ml-2">Help</span>
          </button>
        </div>
        
        <div className="bg-black px-6 py-3 rounded-lg border border-gray-800">
          <span className="font-mono text-indigo-400 text-2xl digital-clock">
            {format(new Date(), 'hh:mm a MM/dd/yy')}
          </span>
        </div>

        <div className="flex space-x-4">
          <button className="btn-bevel accent-primary px-6 py-3 rounded-lg flex items-center">
            <FontAwesomeIcon icon={faCalendarCheck} className="text-[#4CAF50] mr-2" />
            Schedule
          </button>
          <button className="btn-bevel accent-secondary px-6 py-3 rounded-lg flex items-center">
            <FontAwesomeIcon icon={faMessage} className="text-[#2196F3] mr-2" />
            Message
          </button>
        </div>
      </div>

      {/* Quick Information */}
      <div className="card-bevel p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-indigo-400">Quick Information</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickInfo.map((item, index) => (
            <button
              key={index}
              className="btn-bevel bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-left transition-colors group"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={item.icon} className={`text-[${item.color}] mr-3`} />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-sm group-hover:bg-indigo-500">
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <button className="btn-bevel accent-primary p-3 rounded-lg text-center flex items-center justify-center">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#4CAF50] mr-2" />
              Search
            </button>
            <button className="btn-bevel accent-secondary p-3 rounded-lg text-center flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="text-[#FF5722] mr-2" />
              Graphs
            </button>
            <button className="btn-bevel accent-tertiary p-3 rounded-lg text-center flex items-center justify-center">
              <FontAwesomeIcon icon={faCartShopping} className="text-[#2196F3] mr-2" />
              Sales Item
            </button>
            <button className="btn-bevel accent-primary p-3 rounded-lg text-center flex items-center justify-center">
              <FontAwesomeIcon icon={faCogs} className="text-[#9C27B0] mr-2" />
              Operations
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="card-bevel p-6">
        <h2 className="text-lg font-semibold mb-4 text-indigo-400">Quick Access</h2>
        <div className="grid grid-cols-6 gap-4">
          {quickAccess.map((item, index) => (
            <button
              key={index}
              className="btn-bevel bg-gray-800 p-4 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-700 transition-colors group"
            >
              <div className="transform group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={item.icon} className={`text-[${item.color}] text-2xl`} />
              </div>
              <span className="text-sm group-hover:text-indigo-400 transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
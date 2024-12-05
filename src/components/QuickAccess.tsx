import React from 'react';
import { CustomIcons } from './Icons';

export default function QuickAccess() {
  return (
    <div className="grid grid-cols-6 gap-4">
      <button className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-600">
        <CustomIcons.TicketSearch />
        <span>Ticket Search</span>
      </button>
      <button className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-600">
        <CustomIcons.Assembly />
        <span>Assembly</span>
      </button>
      <button className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-600">
        <CustomIcons.Racking />
        <span>Racking</span>
      </button>
      <button className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-600">
        <CustomIcons.DropPickup />
        <span>Pickup Order</span>
      </button>
      <button className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-600">
        <CustomIcons.OpenDrawer />
        <span>Deliveries</span>
      </button>
      <button className="bg-gray-700 p-4 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-600">
        <CustomIcons.TimeClock />
        <span>COD Payment</span>
      </button>
    </div>
  );
}
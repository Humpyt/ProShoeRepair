import React from 'react';
import { CustomIcons } from './Icons';

export default function RightSidebar() {
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="space-y-4 flex-1">
        <button className="btn-bevel accent-primary w-full p-4 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-indigo-700 transition-colors">
          <CustomIcons.DropPickup />
          <span className="text-sm">Drop & Pickup</span>
        </button>

        <button className="btn-bevel accent-secondary w-full p-4 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-emerald-700 transition-colors">
          <CustomIcons.OpenDrawer />
          <span className="text-sm">Open Drawer</span>
        </button>

        <button className="btn-bevel accent-tertiary w-full p-4 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-amber-700 transition-colors">
          <CustomIcons.TimeClock />
          <span className="text-sm">Time Clock</span>
        </button>
      </div>

      <button className="btn-bevel bg-red-600 hover:bg-red-700 w-full p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-colors mt-4">
        <CustomIcons.Exit />
        <span className="text-sm">Exit</span>
      </button>
    </div>
  );
}
import React from 'react';
import { CustomIcons } from './Icons';

export default function TopBar() {
  return (
    <div className="bg-gray-700 p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <button className="flex items-center space-x-2 bg-gray-600 p-2 rounded hover:bg-gray-500">
          <CustomIcons.Management />
          <span>Management</span>
        </button>
        <button className="flex items-center space-x-2 bg-gray-600 p-2 rounded hover:bg-gray-500">
          <CustomIcons.Marketing />
          <span>Marketing</span>
        </button>
        <button className="flex items-center space-x-2 bg-gray-600 p-2 rounded hover:bg-gray-500">
          <CustomIcons.Help />
          <span>Help</span>
        </button>
      </div>
      <div className="flex space-x-4">
        <button className="bg-gray-600 p-2 rounded hover:bg-gray-500">Schedule</button>
        <button className="bg-gray-600 p-2 rounded hover:bg-gray-500">Message</button>
      </div>
    </div>
  );
}
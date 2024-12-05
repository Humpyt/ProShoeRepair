import React from 'react';
import { QrCode, Plus } from 'lucide-react';

export default function QRCodesPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">QR Code Management</h1>
          <p className="text-gray-400">Generate and manage QR codes</p>
        </div>
        <button className="btn-bevel accent-primary px-6 py-3 rounded-lg flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Generate QR Code
        </button>
      </div>

      <div className="card-bevel p-6">
        <h2 className="text-lg font-semibold mb-4 text-indigo-400">Generated QR Codes</h2>
        {/* Add your QR codes content here */}
      </div>
    </div>
  );
}
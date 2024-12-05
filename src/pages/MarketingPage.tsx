import React from 'react';
import { Megaphone, Mail, MessageSquare } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketing</h1>
          <p className="text-gray-400">Manage marketing campaigns and communications</p>
        </div>
        <button className="btn-bevel accent-primary px-6 py-3 rounded-lg flex items-center">
          <Megaphone className="h-5 w-5 mr-2" />
          New Campaign
        </button>
      </div>

      <div className="card-bevel p-6">
        <h2 className="text-lg font-semibold mb-4 text-indigo-400">Active Campaigns</h2>
        {/* Add your marketing content here */}
      </div>
    </div>
  );
}
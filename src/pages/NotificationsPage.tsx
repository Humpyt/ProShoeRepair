import React from 'react';

const NotificationsPage = () => {
  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold text-white mb-4">Notifications</h1>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg backdrop-blur-sm bg-opacity-50">
          <h2 className="text-xl font-semibold text-white mb-2">System Update</h2>
          <p className="text-gray-400">A new update will be applied tonight at 2:00 AM.</p>
          <span className="text-gray-500 text-sm">Received: 1 hour ago</span>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg backdrop-blur-sm bg-opacity-50">
          <h2 className="text-xl font-semibold text-white mb-2">New Feature</h2>
          <p className="text-gray-400">Check out the new analytics dashboard available now!</p>
          <span className="text-gray-500 text-sm">Received: 3 hours ago</span>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg backdrop-blur-sm bg-opacity-50">
          <h2 className="text-xl font-semibold text-white mb-2">Reminder</h2>
          <p className="text-gray-400">Don't forget to submit your weekly report by Friday.</p>
          <span className="text-gray-500 text-sm">Received: 5 hours ago</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

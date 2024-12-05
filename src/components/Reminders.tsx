import React from 'react';
import { Bell, Calendar, Clock } from 'lucide-react';

export default function Reminders() {
  const reminders = [
    {
      title: 'Staff Meeting',
      time: '10:00 AM',
      date: 'Today',
      priority: 'high'
    },
    {
      title: 'Inventory Check',
      time: '2:00 PM',
      date: 'Tomorrow',
      priority: 'medium'
    },
    {
      title: 'Monthly Report Due',
      time: '5:00 PM',
      date: 'Mar 15',
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white flex items-center">
          <Bell className="h-5 w-5 mr-2 text-indigo-400" />
          Reminders
        </h3>
        <button className="text-sm text-indigo-400 hover:text-indigo-300">
          Add New
        </button>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(reminder.priority)}`} />
              <div>
                <p className="text-sm font-medium text-white">{reminder.title}</p>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{reminder.date}</span>
                  <Clock className="h-3 w-3 ml-2 mr-1" />
                  <span>{reminder.time}</span>
                </div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { X, Target, TrendingUp } from 'lucide-react';
import type { Staff } from '../types';

interface StaffTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staffId: string, newProgress: number) => void;
  staff: Staff | null;
  dailyTarget: number;
}

export function StaffTargetModal({ isOpen, onClose, onSave, staff, dailyTarget }: StaffTargetModalProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (staff) {
      setProgress(staff.currentProgress);
    }
  }, [staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (staff) {
      try {
        const token = localStorage.getItem('auth_token');
        await fetch(`${API_ENDPOINTS.business/targets/staff}/${staff.id}/targets`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ daily_target: progress })
        });
        onSave(staff.id, progress);
      } catch (error) {
        console.error('Failed to update target:', error);
      }
    }
  };

  if (!isOpen || !staff) return null;

  const progressPercentage = Math.round((progress / dailyTarget) * 100);
  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'text-green-600';
    if (progressPercentage >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Daily Progress</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Target className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">Daily Target:</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              ${(dailyTarget / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">Current Progress:</span>
            </div>
            <span className={`text-sm font-medium ${getProgressColor()}`}>
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className={`h-2 rounded-full ${
                progressPercentage >= 100
                  ? 'bg-green-600'
                  : progressPercentage >= 90
                  ? 'bg-yellow-600'
                  : 'bg-red-600'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Update Progress Amount ($)
            </label>
            <input
              type="number"
              required
              min="0"
              max={dailyTarget * 1.5}
              step="1000"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffTargetModal;
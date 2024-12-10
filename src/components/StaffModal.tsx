import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Staff } from '../types';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: Staff | Omit<Staff, 'id'>) => void;
  staff?: Staff | null;
}

export function StaffModal({ isOpen, onClose, onSave, staff }: StaffModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'technician',
    specialization: [] as ('shoe' | 'bag')[],
    active: true,
    currentWorkload: 0
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        role: staff.role,
        specialization: staff.specialization,
        active: staff.active,
        currentWorkload: staff.currentWorkload
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'technician',
        specialization: [],
        active: true,
        currentWorkload: 0
      });
    }
  }, [staff]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const staffData = {
      ...formData,
      ...(staff && { id: staff.id })
    };
    onSave(staffData);
    onClose();
  };

  const handleSpecializationChange = (type: 'shoe' | 'bag') => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(type)
        ? prev.specialization.filter(t => t !== type)
        : [...prev.specialization, type]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 shadow-xl border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-300 hover:bg-gray-800 p-1 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                transition-colors"
              placeholder="Enter staff name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                transition-colors"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Role
            </label>
            <select
              className="w-full rounded-lg bg-gray-800 border-gray-700 text-white
                focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                transition-colors"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="technician">Technician</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Specialization
            </label>
            <div className="flex gap-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded bg-gray-800 border-gray-700 text-indigo-500 
                    focus:ring-indigo-500 focus:ring-offset-gray-900"
                  checked={formData.specialization.includes('shoe')}
                  onChange={() => handleSpecializationChange('shoe')}
                />
                <span className="ml-2 text-gray-300">Shoe Repair</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded bg-gray-800 border-gray-700 text-indigo-500 
                    focus:ring-indigo-500 focus:ring-offset-gray-900"
                  checked={formData.specialization.includes('bag')}
                  onChange={() => handleSpecializationChange('bag')}
                />
                <span className="ml-2 text-gray-300">Bag Repair</span>
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded bg-gray-800 border-gray-700 text-indigo-500 
                  focus:ring-indigo-500 focus:ring-offset-gray-900"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              <span className="ml-2 text-gray-300">Active Status</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg
                hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg
                hover:bg-indigo-700 transition-colors"
            >
              {staff ? 'Save Changes' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffModal;
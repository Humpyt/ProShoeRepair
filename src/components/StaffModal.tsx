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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as Staff['role'] })}
            >
              <option value="technician">Technician</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  checked={formData.specialization.includes('shoe')}
                  onChange={() => handleSpecializationChange('shoe')}
                />
                <span className="ml-2">Shoe Repair</span>
              </label>
              <br />
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  checked={formData.specialization.includes('bag')}
                  onChange={() => handleSpecializationChange('bag')}
                />
                <span className="ml-2">Bag Repair</span>
              </label>
            </div>
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
              {staff ? 'Save Changes' : 'Add Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffModal;
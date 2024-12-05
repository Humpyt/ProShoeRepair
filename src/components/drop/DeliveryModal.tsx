import React, { useState } from 'react';
import { X, MapPin, Truck } from 'lucide-react';
import type { DeliveryInfo, Location } from '../../types/drop';

interface DeliveryModalProps {
  onSave: (deliveryInfo: DeliveryInfo) => void;
  onClose: () => void;
  isOpen: boolean;
}

const kampalaLocations: Location[] = [
  { id: 'ntinda', name: 'Ntinda', deliveryCharge: 5000, estimatedTime: '1-2 hours' },
  { id: 'nakawa', name: 'Nakawa', deliveryCharge: 5000, estimatedTime: '1-2 hours' },
  { id: 'kololo', name: 'Kololo', deliveryCharge: 7000, estimatedTime: '1-2 hours' },
  { id: 'bukoto', name: 'Bukoto', deliveryCharge: 5000, estimatedTime: '1-2 hours' },
  { id: 'naguru', name: 'Naguru', deliveryCharge: 6000, estimatedTime: '1-2 hours' },
  { id: 'bugolobi', name: 'Bugolobi', deliveryCharge: 6000, estimatedTime: '1-2 hours' },
  { id: 'muyenga', name: 'Muyenga', deliveryCharge: 8000, estimatedTime: '2-3 hours' },
  { id: 'munyonyo', name: 'Munyonyo', deliveryCharge: 10000, estimatedTime: '2-3 hours' },
];

export function DeliveryModal({ onSave, onClose, isOpen }: DeliveryModalProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [customAddress, setCustomAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const location = kampalaLocations.find(loc => loc.id === selectedLocation);
    
    const deliveryInfo: DeliveryInfo = {
      method: 'delivery',
      location: selectedLocation,
      address: customAddress,
      deliveryCharge: location?.deliveryCharge || 0
    };

    onSave(deliveryInfo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Delivery Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Location
            </label>
            <div className="grid grid-cols-2 gap-3">
              {kampalaLocations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => setSelectedLocation(location.id)}
                  className={`p-3 rounded-lg border ${
                    selectedLocation === location.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="font-medium">{location.name}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    UGX {location.deliveryCharge.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {location.estimatedTime}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Address
            </label>
            <textarea
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter detailed address..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
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
              <Truck className="h-4 w-4 mr-2" />
              Confirm Delivery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

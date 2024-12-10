import React, { useState, useEffect } from 'react';
import { Printer, Save, X } from 'lucide-react';
import { printerService } from '../services/printer';
import toast from 'react-hot-toast';

interface PrinterConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrinterConfig({ isOpen, onClose }: PrinterConfigProps) {
  const [config, setConfig] = useState({
    type: 'EPSON',
    interface: 'printer:auto',
    characterSet: 'PC437_USA',
    width: 42,
    options: {
      timeout: 5000
    }
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const currentConfig = await printerService.getConfig();
      setConfig(currentConfig);
    } catch (error) {
      console.error('Failed to load printer config:', error);
      toast.error('Failed to load printer configuration');
    }
  };

  const handleSave = async () => {
    try {
      await printerService.updateConfig(config);
      toast.success('Printer configuration saved');
      onClose();
    } catch (error) {
      console.error('Failed to save printer config:', error);
      toast.error('Failed to save printer configuration');
    }
  };

  const handleTestPrint = async () => {
    try {
      await printerService.printReceipt({
        orderNumber: 'TEST-123',
        customerName: 'Test Customer',
        items: [
          {
            description: 'Test Item',
            quantity: 1,
            price: 1000
          }
        ],
        subtotal: 1000,
        total: 1000,
        date: new Date()
      });
      toast.success('Test receipt printed');
    } catch (error) {
      console.error('Failed to print test receipt:', error);
      toast.error('Failed to print test receipt');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-lg p-6 shadow-xl border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Printer className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-semibold text-white">Printer Configuration</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 hover:bg-gray-800 p-1 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Printer Type
            </label>
            <select
              value={config.type}
              onChange={(e) => setConfig({ ...config, type: e.target.value })}
              className="w-full rounded-lg bg-gray-800 border-gray-700 text-white"
            >
              <option value="EPSON">EPSON</option>
              <option value="STAR">STAR</option>
              <option value="BIXOLON">BIXOLON</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Interface
            </label>
            <input
              type="text"
              value={config.interface}
              onChange={(e) => setConfig({ ...config, interface: e.target.value })}
              className="w-full rounded-lg bg-gray-800 border-gray-700 text-white"
              placeholder="printer:auto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Character Set
            </label>
            <select
              value={config.characterSet}
              onChange={(e) => setConfig({ ...config, characterSet: e.target.value })}
              className="w-full rounded-lg bg-gray-800 border-gray-700 text-white"
            >
              <option value="PC437_USA">PC437 (USA)</option>
              <option value="PC850_MULTILINGUAL">PC850 (Multilingual)</option>
              <option value="PC860_PORTUGUESE">PC860 (Portuguese)</option>
              <option value="PC863_CANADIAN_FRENCH">PC863 (Canadian French)</option>
              <option value="PC865_NORDIC">PC865 (Nordic)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Receipt Width (characters)
            </label>
            <input
              type="number"
              value={config.width}
              onChange={(e) => setConfig({ ...config, width: parseInt(e.target.value) })}
              className="w-full rounded-lg bg-gray-800 border-gray-700 text-white"
              min="24"
              max="80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Timeout (ms)
            </label>
            <input
              type="number"
              value={config.options.timeout}
              onChange={(e) => setConfig({
                ...config,
                options: { ...config.options, timeout: parseInt(e.target.value) }
              })}
              className="w-full rounded-lg bg-gray-800 border-gray-700 text-white"
              min="1000"
              max="30000"
              step="1000"
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handleTestPrint}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Test Receipt
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

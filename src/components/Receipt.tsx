import React from 'react';
import { Printer } from 'lucide-react';
import { printerService, type ReceiptData } from '../services/printer';
import { formatCurrency } from '../utils/formatCurrency';

interface ReceiptProps {
  data: ReceiptData;
  onPrint?: () => void;
}

export function Receipt({ data, onPrint }: ReceiptProps) {
  const handlePrint = async () => {
    try {
      await printerService.printReceipt(data);
      onPrint?.();
    } catch (error) {
      console.error('Failed to print receipt:', error);
      // You might want to show a toast notification here
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-6">
      {/* Receipt Preview */}
      <div className="space-y-4 font-mono text-sm">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold">SHOE REPAIR POS</h2>
          <p>123 Main Street</p>
          <p>Phone: (555) 123-4567</p>
        </div>

        {/* Order Info */}
        <div className="border-t border-b border-gray-200 py-2">
          <p><strong>Order #:</strong> {data.orderNumber}</p>
          <p><strong>Date:</strong> {data.date.toLocaleDateString()}</p>
          <p><strong>Customer:</strong> {data.customerName}</p>
          {data.customerPhone && (
            <p><strong>Phone:</strong> {data.customerPhone}</p>
          )}
        </div>

        {/* Items */}
        <div className="space-y-2">
          <p className="font-bold">ITEMS</p>
          {data.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <p className="font-bold">{item.description}</p>
                <p className="text-gray-600">{item.quantity}x @ {formatCurrency(item.price)}</p>
              </div>
              <p className="font-bold">{formatCurrency(item.quantity * item.price)}</p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between">
            <p>Subtotal:</p>
            <p>{formatCurrency(data.subtotal)}</p>
          </div>
          {data.tax && (
            <div className="flex justify-between">
              <p>Tax:</p>
              <p>{formatCurrency(data.tax)}</p>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <p>Total:</p>
            <p>{formatCurrency(data.total)}</p>
          </div>
        </div>

        {/* Promised Date */}
        {data.promisedDate && (
          <div className="text-center border-t border-gray-200 pt-2">
            <p>Ready for pickup on:</p>
            <p className="font-bold text-lg">
              {data.promisedDate.toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Notes */}
        {data.notes && (
          <div className="border-t border-gray-200 pt-2">
            <p className="font-bold">Notes:</p>
            <p>{data.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center border-t border-gray-200 pt-2">
          <p>Thank you for your business!</p>
          <p className="text-sm text-gray-600">Please keep this receipt</p>
        </div>
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
      >
        <Printer className="h-5 w-5" />
        Print Receipt
      </button>
    </div>
  );
}

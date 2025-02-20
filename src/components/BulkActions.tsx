import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExport,
  faFileImport,
  faBarcode,
  faPrint,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

interface BulkActionsProps {
  selectedItems: string[];
  onExport: () => void;
  onImport: () => void;
  onPrintBarcodes: () => void;
  onPrintLabels: () => void;
  onDelete: () => void;
}

export default function BulkActions({
  selectedItems,
  onExport,
  onImport,
  onPrintBarcodes,
  onPrintLabels,
  onDelete
}: BulkActionsProps) {
  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-2 z-50">
      <div className="flex space-x-2">
        <button
          onClick={onExport}
          className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faFileExport} />
          <span>Export</span>
        </button>
        <button
          onClick={onImport}
          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faFileImport} />
          <span>Import</span>
        </button>
        <button
          onClick={onPrintBarcodes}
          className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faBarcode} />
          <span>Print Barcodes</span>
        </button>
        <button
          onClick={onPrintLabels}
          className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faPrint} />
          <span>Print Labels</span>
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faTrash} />
          <span>Delete</span>
        </button>
      </div>
      <div className="text-center text-sm text-gray-400 mt-1">
        {selectedItems.length} items selected
      </div>
    </div>
  );
}

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarcode,
  faPrint,
  faHistory,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

interface QuickItemActionsProps {
  itemId: string;
  onPrintBarcode: (id: string) => void;
  onPrintLabel: (id: string) => void;
  onViewHistory: (id: string) => void;
  onViewAnalytics: (id: string) => void;
}

export default function QuickItemActions({
  itemId,
  onPrintBarcode,
  onPrintLabel,
  onViewHistory,
  onViewAnalytics
}: QuickItemActionsProps) {
  const actions = [
    {
      icon: faBarcode,
      label: 'Print Barcode',
      onClick: () => onPrintBarcode(itemId),
      color: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
    },
    {
      icon: faPrint,
      label: 'Print Label',
      onClick: () => onPrintLabel(itemId),
      color: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
    },
    {
      icon: faHistory,
      label: 'View History',
      onClick: () => onViewHistory(itemId),
      color: 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
    },
    {
      icon: faChartLine,
      label: 'Analytics',
      onClick: () => onViewAnalytics(itemId),
      color: 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
    }
  ];

  return (
    <div className="absolute top-0 right-0 mt-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="flex space-x-1">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-2 rounded-lg ${action.color} transition-colors duration-200`}
            title={action.label}
          >
            <FontAwesomeIcon icon={action.icon} className="w-4 h-4" />
          </button>
        ))}
      </div>
    </div>
  );
}

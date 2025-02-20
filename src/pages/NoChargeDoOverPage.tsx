import React, { useState } from 'react';
import { Card, Typography, Button, TextField, Chip, Box } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Phone, Mail, MessageCircle } from 'lucide-react';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface DoOverItem {
  id: string;
  customerName: string;
  reason: string;
  date: Date;
  contactStatus: 'pending' | 'contacted' | 'unreachable';
  staffNote?: string;
}

const NoChargeDoOverPage: React.FC = () => {
  const [newNote, setNewNote] = useState('');

  // Sample data for the pie chart
  const chartData = {
    labels: ['Manufacturing Defect', 'Service Error', 'Customer Dissatisfaction', 'Material Issue', 'Other'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        '#4F46E5',
        '#7C3AED',
        '#EC4899',
        '#8B5CF6',
        '#6366F1'
      ],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#6B7280',
          font: {
            size: 12
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  // Sample do-over items
  const doOverItems = [
    {
      id: '1',
      customerName: 'John Smith',
      reason: 'Manufacturing Defect',
      date: new Date(),
      contactStatus: 'contacted',
      staffNote: 'Customer reported sole separation after first wear'
    },
    {
      id: '2',
      customerName: 'Emma Wilson',
      reason: 'Service Error',
      date: new Date(),
      contactStatus: 'pending',
      staffNote: 'Wrong color polish applied'
    }
  ];

  const getContactStatusColor = (status: string) => {
    switch (status) {
      case 'contacted':
        return 'success';
      case 'pending':
        return 'warning';
      case 'unreachable':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="text-gray-800 font-semibold">
          No Charge & Do Over Details
        </Typography>
        <Button 
          variant="contained" 
          className="bg-blue-600 hover:bg-blue-700"
        >
          Export Report
        </Button>
      </div>

      {/* Stats and Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stats Cards */}
        <Card className="p-4 shadow-md col-span-1">
          <Typography variant="h6" className="mb-4 text-gray-700">
            Quick Statistics
          </Typography>
          <div className="space-y-4">
            <div>
              <Typography variant="subtitle2" className="text-gray-600">
                Total No Charge Items
              </Typography>
              <Typography variant="h4" className="text-blue-600">
                24
              </Typography>
            </div>
            <div>
              <Typography variant="subtitle2" className="text-gray-600">
                Pending Contact
              </Typography>
              <Typography variant="h4" className="text-orange-600">
                5
              </Typography>
            </div>
            <div>
              <Typography variant="subtitle2" className="text-gray-600">
                This Month's Do-Overs
              </Typography>
              <Typography variant="h4" className="text-purple-600">
                12
              </Typography>
            </div>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card className="p-4 shadow-md col-span-2">
          <Typography variant="h6" className="mb-4 text-gray-700">
            Do-Over Reasons Distribution
          </Typography>
          <div className="h-64">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Items List */}
      <Card className="p-6 shadow-md">
        <Typography variant="h6" className="mb-4 text-gray-700">
          Recent Do-Overs
        </Typography>
        <div className="space-y-4">
          {doOverItems.map((item) => (
            <Card key={item.id} className="p-4 border border-gray-200">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <Typography variant="subtitle1" className="font-medium">
                      {item.customerName}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      Reason: {item.reason}
                    </Typography>
                  </div>
                  <Chip 
                    label={item.contactStatus}
                    color={getContactStatusColor(item.contactStatus)}
                    size="small"
                  />
                </div>

                {/* Staff Note */}
                <div className="bg-gray-50 p-3 rounded-md">
                  <Typography variant="body2" className="text-gray-700">
                    <span className="font-medium">Staff Note:</span> {item.staffNote}
                  </Typography>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2">
                    <Button
                      size="small"
                      startIcon={<Phone className="w-4 h-4" />}
                      variant="outlined"
                      className="text-blue-600 border-blue-600"
                    >
                      Call
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Mail className="w-4 h-4" />}
                      variant="outlined"
                      className="text-purple-600 border-purple-600"
                    >
                      Email
                    </Button>
                    <Button
                      size="small"
                      startIcon={<MessageCircle className="w-4 h-4" />}
                      variant="outlined"
                      className="text-green-600 border-green-600"
                    >
                      SMS
                    </Button>
                  </div>
                  <Button
                    size="small"
                    variant="contained"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NoChargeDoOverPage;

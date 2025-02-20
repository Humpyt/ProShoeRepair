import React from 'react';
import { Card, Typography, Button } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, 
         TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { AccessTime, Info, Person } from '@mui/icons-material';

interface HoldItem {
  id: string;
  customerName: string;
  itemDescription: string;
  holdDate: Date;
  expectedCompletion: Date;
  status: 'pending' | 'in-progress' | 'ready';
}

const HoldQuickDropPage: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="text-gray-800 font-semibold">
          Hold & Quick Drop Details
        </Typography>
        <div className="flex gap-4">
          <Button 
            variant="contained" 
            color="primary"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add New Hold
          </Button>
          <Button 
            variant="outlined"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Export List
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
          <Typography variant="subtitle1" className="text-gray-600 mb-2">
            Total Items on Hold
          </Typography>
          <Typography variant="h3" className="text-blue-600 font-bold">
            15
          </Typography>
        </Card>
        <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
          <Typography variant="subtitle1" className="text-gray-600 mb-2">
            Due Today
          </Typography>
          <Typography variant="h3" className="text-orange-600 font-bold">
            5
          </Typography>
        </Card>
        <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
          <Typography variant="subtitle1" className="text-gray-600 mb-2">
            Quick Drops
          </Typography>
          <Typography variant="h3" className="text-green-600 font-bold">
            3
          </Typography>
        </Card>
      </div>

      {/* Timeline Section */}
      <Card className="p-6 mb-6 shadow-md">
        <Typography variant="h6" className="mb-4 text-gray-800">
          Today's Timeline
        </Typography>
        <Timeline>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <div className="mb-4">
                <Typography variant="subtitle1" className="font-medium">
                  John Doe - Leather Shoes
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Expected completion: 2:00 PM
                </Typography>
              </div>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color="secondary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <div className="mb-4">
                <Typography variant="subtitle1" className="font-medium">
                  Sarah Smith - Boot Repair
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Expected completion: 3:30 PM
                </Typography>
              </div>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Card>

      {/* Items List */}
      <Card className="p-6 shadow-md">
        <Typography variant="h6" className="mb-4 text-gray-800">
          Current Hold Items
        </Typography>
        <div className="space-y-4">
          {/* Sample Item Card */}
          <Card className="p-4 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <Typography variant="subtitle1" className="font-medium">
                  James Wilson
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  2x Dress Shoes - Polish & Repair
                </Typography>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <AccessTime className="w-4 h-4 mr-1" />
                  <span>Hold since: Jan 18, 2025</span>
                </div>
              </div>
              <Button 
                variant="outlined" 
                size="small"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                View Details
              </Button>
            </div>
          </Card>
          
          {/* Add more item cards here */}
        </div>
      </Card>
    </div>
  );
};

export default HoldQuickDropPage;

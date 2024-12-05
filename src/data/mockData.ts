import type { Staff, RepairItem } from '../types';

export const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'Mike Johnson',
    email: 'mike@repairpro.com',
    role: 'technician',
    specialization: ['shoe', 'bag'],
    active: true,
    currentWorkload: 3,
    dailyTarget: 750000,
    currentProgress: 680000
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@repairpro.com',
    role: 'technician',
    specialization: ['shoe'],
    active: true,
    currentWorkload: 2,
    dailyTarget: 750000,
    currentProgress: 725000
  }
];

export const mockServices = [
  {
    id: '1',
    name: 'Heel Replacement',
    type: 'shoe',
    description: 'Complete heel replacement with premium materials',
    price: 45000,
    estimatedDays: 2,
    active: true
  },
  {
    id: '2',
    name: 'Sole Repair',
    type: 'shoe',
    description: 'Full sole repair and restoration',
    price: 35000,
    estimatedDays: 3,
    active: true
  }
];

export const pendingRepairs: RepairItem[] = [
  {
    id: '1',
    type: 'shoe',
    customerName: 'John Smith',
    contactNumber: '555-0123',
    description: 'Heel replacement',
    status: 'pending',
    dateReceived: '2024-03-10',
    estimatedCompletion: '2024-03-12',
    price: 45000,
    selectedServices: ['1']
  },
  {
    id: '2',
    type: 'shoe',
    customerName: 'Mary Johnson',
    contactNumber: '555-0124',
    description: 'Sole repair',
    status: 'pending',
    dateReceived: '2024-03-09',
    estimatedCompletion: '2024-03-11',
    price: 25000,
    selectedServices: ['2']
  }
];

export const mockRepairs: RepairItem[] = [
  {
    id: '3',
    type: 'shoe',
    customerName: 'John Doe',
    contactNumber: '555-0125',
    description: 'Heel replacement and sole repair',
    status: 'in-progress',
    dateReceived: '2024-03-10',
    estimatedCompletion: '2024-03-12',
    price: 45000,
    assignedStaffId: '1',
    selectedServices: ['1', '2']
  },
  {
    id: '4',
    type: 'shoe',
    customerName: 'Jane Smith',
    contactNumber: '555-0126',
    description: 'Sole repair and polishing',
    status: 'in-progress',
    dateReceived: '2024-03-09',
    estimatedCompletion: '2024-03-11',
    price: 80000,
    assignedStaffId: '2',
    selectedServices: ['2']
  }
];

export const completedRepairs: RepairItem[] = [
  {
    id: '5',
    type: 'shoe',
    customerName: 'Robert Brown',
    contactNumber: '555-0127',
    description: 'Sole replacement',
    status: 'completed',
    dateReceived: '2024-03-08',
    estimatedCompletion: '2024-03-10',
    price: 75000,
    assignedStaffId: '1',
    selectedServices: ['2']
  }
];

export const mockPickups: RepairItem[] = [
  {
    id: '7',
    type: 'shoe',
    customerName: 'William Taylor',
    contactNumber: '555-0129',
    description: 'Heel replacement and polishing',
    status: 'ready-for-pickup',
    dateReceived: '2024-03-08',
    estimatedCompletion: '2024-03-10',
    price: 55000,
    assignedStaffId: '1',
    selectedServices: ['1'],
    balanceDue: 25000
  }
];
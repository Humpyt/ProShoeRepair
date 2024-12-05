import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Customer } from '../types';

interface ShoeItem {
  id: string;
  category: string;
  color: string;
  services: string[];
}

interface Operation {
  id: string;
  customer: Customer | null;
  shoes: ShoeItem[];
  status: 'pending' | 'in_progress' | 'completed' | 'held' | 'cancelled';
  totalAmount: number;
  discount?: number;
  isNoCharge?: boolean;
  isDoOver?: boolean;
  isDelivery?: boolean;
  isPickup?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OperationContextType {
  operations: Operation[];
  addOperation: (operation: Omit<Operation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOperation: (id: string, operation: Partial<Operation>) => Promise<void>;
  deleteOperation: (id: string) => Promise<void>;
  getOperation: (id: string) => Operation | undefined;
}

const OperationContext = createContext<OperationContextType | undefined>(undefined);

export function OperationProvider({ children }: { children: React.ReactNode }) {
  const [operations, setOperations] = useState<Operation[]>([]);

  const addOperation = useCallback(async (operation: Omit<Operation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newOperation: Operation = {
      ...operation,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };

    try {
      const response = await fetch('http://localhost:3000/api/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOperation),
      });

      if (!response.ok) {
        throw new Error('Failed to add operation');
      }

      const savedOperation = await response.json();
      setOperations(prev => [...prev, savedOperation]);
    } catch (error) {
      console.error('Error adding operation:', error);
      throw error;
    }
  }, []);

  const updateOperation = useCallback(async (id: string, updates: Partial<Operation>) => {
    try {
      const response = await fetch(`http://localhost:3000/api/operations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...updates, updatedAt: new Date().toISOString() }),
      });

      if (!response.ok) {
        throw new Error('Failed to update operation');
      }

      const updatedOperation = await response.json();
      setOperations(prev => prev.map(op => op.id === id ? updatedOperation : op));
    } catch (error) {
      console.error('Error updating operation:', error);
      throw error;
    }
  }, []);

  const deleteOperation = useCallback(async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/operations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete operation');
      }

      setOperations(prev => prev.filter(op => op.id !== id));
    } catch (error) {
      console.error('Error deleting operation:', error);
      throw error;
    }
  }, []);

  const getOperation = useCallback((id: string) => {
    return operations.find(op => op.id === id);
  }, [operations]);

  return (
    <OperationContext.Provider value={{
      operations,
      addOperation,
      updateOperation,
      deleteOperation,
      getOperation,
    }}>
      {children}
    </OperationContext.Provider>
  );
}

export function useOperation() {
  const context = useContext(OperationContext);
  if (context === undefined) {
    throw new Error('useOperation must be used within an OperationProvider');
  }
  return context;
}

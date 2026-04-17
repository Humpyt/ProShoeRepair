import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

interface DataRefreshContextType {
  dataVersion: number;
  triggerRefresh: (source?: string) => void;
  lastRefreshSource: string | null;
  operationsVersion: number;
  triggerOperationsRefresh: (source?: string) => void;
  salesVersion: number;
  triggerSalesRefresh: (source?: string) => void;
  invoicesVersion: number;
  triggerInvoicesRefresh: (source?: string) => void;
  businessTargetsVersion: number;
  triggerBusinessTargetsRefresh: (source?: string) => void;
}

const DataRefreshContext = createContext<DataRefreshContextType | undefined>(undefined);

export function DataRefreshProvider({ children }: { children: ReactNode }) {
  const [dataVersion, setDataVersion] = useState(0);
  const [lastRefreshSource, setLastRefreshSource] = useState<string | null>(null);
  const [operationsVersion, setOperationsVersion] = useState(0);
  const [salesVersion, setSalesVersion] = useState(0);
  const [invoicesVersion, setInvoicesVersion] = useState(0);
  const [businessTargetsVersion, setBusinessTargetsVersion] = useState(0);

  const triggerRefresh = useCallback((source: string = 'unknown') => {
    setDataVersion(v => v + 1);
    setLastRefreshSource(source);
  }, []);

  const triggerOperationsRefresh = useCallback((source: string = 'unknown') => {
    setOperationsVersion(v => v + 1);
    setLastRefreshSource(source);
  }, []);

  const triggerSalesRefresh = useCallback((source: string = 'unknown') => {
    setSalesVersion(v => v + 1);
    setLastRefreshSource(source);
  }, []);

  const triggerInvoicesRefresh = useCallback((source: string = 'unknown') => {
    setInvoicesVersion(v => v + 1);
    setLastRefreshSource(source);
  }, []);

  const triggerBusinessTargetsRefresh = useCallback((source: string = 'unknown') => {
    setBusinessTargetsVersion(v => v + 1);
    setLastRefreshSource(source);
  }, []);

  const value = useMemo(() => ({
    dataVersion,
    triggerRefresh,
    lastRefreshSource,
    operationsVersion,
    triggerOperationsRefresh,
    salesVersion,
    triggerSalesRefresh,
    invoicesVersion,
    triggerInvoicesRefresh,
    businessTargetsVersion,
    triggerBusinessTargetsRefresh,
  }), [dataVersion, lastRefreshSource, operationsVersion, salesVersion, invoicesVersion, businessTargetsVersion]);

  return (
    <DataRefreshContext.Provider value={value}>
      {children}
    </DataRefreshContext.Provider>
  );
}

export function useDataRefresh() {
  const context = useContext(DataRefreshContext);
  if (!context) {
    throw new Error('useDataRefresh must be used within a DataRefreshProvider');
  }
  return context;
}

export function useOperationsRefresh() {
  const { operationsVersion, triggerOperationsRefresh } = useDataRefresh();
  return { operationsVersion, triggerOperationsRefresh };
}

export function useSalesRefresh() {
  const { salesVersion, triggerSalesRefresh } = useDataRefresh();
  return { salesVersion, triggerSalesRefresh };
}

export function useInvoicesRefresh() {
  const { invoicesVersion, triggerInvoicesRefresh } = useDataRefresh();
  return { invoicesVersion, triggerInvoicesRefresh };
}

export function useBusinessTargetsRefresh() {
  const { businessTargetsVersion, triggerBusinessTargetsRefresh } = useDataRefresh();
  return { businessTargetsVersion, triggerBusinessTargetsRefresh };
}

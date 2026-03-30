import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../config/api';

export interface RetailProduct {
  id: string;
  name: string;
  category: string;
  description?: string;
  default_price: number;
  icon?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface RetailProductContextType {
  products: RetailProduct[];
  categories: string[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (product: Omit<RetailProduct, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<RetailProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const RetailProductContext = createContext<RetailProductContextType | undefined>(undefined);

export const RetailProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<RetailProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`${API_ENDPOINTS.retailProducts}`),
        fetch(`${API_ENDPOINTS.retailProducts}/categories`),
      ]);

      if (!productsRes.ok) {
        throw new Error('Failed to fetch retail products');
      }

      const productsData = await productsRes.json();
      setProducts(productsData);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch retail products';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (product: Omit<RetailProduct, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.retailProducts}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Failed to create retail product');
      }

      await fetchProducts();
      toast.success('Retail product created successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create retail product';
      toast.error(message);
      throw err;
    }
  };

  const updateProduct = async (id: string, productUpdate: Partial<RetailProduct>) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.retailProducts}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productUpdate),
      });

      if (!response.ok) {
        throw new Error('Failed to update retail product');
      }

      await fetchProducts();
      toast.success('Retail product updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update retail product';
      toast.error(message);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.retailProducts}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete retail product');
      }

      await fetchProducts();
      toast.success('Retail product deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete retail product';
      toast.error(message);
      throw err;
    }
  };

  const contextValue: RetailProductContextType = {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <RetailProductContext.Provider value={contextValue}>
      {children}
    </RetailProductContext.Provider>
  );
};

export function useRetailProducts() {
  const context = useContext(RetailProductContext);
  if (context === undefined) {
    throw new Error('useRetailProducts must be used within a RetailProductProvider');
  }
  return context;
}

import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, ShoppingBag, X } from 'lucide-react';
import { useRetailProducts, type RetailProduct } from '../../contexts/RetailProductContext';

interface ProductSalesSectionProps {
  isAdmin: boolean;
  onProductSelect: (product: RetailProduct, customPrice?: number) => void;
  onEditProduct: (product: RetailProduct) => void;
  onDeleteProduct: (id: string) => void;
  onAddProduct: () => void;
}

interface PriceInputModalProps {
  isOpen: boolean;
  product: RetailProduct | null;
  onClose: () => void;
  onConfirm: (price: number) => void;
}

const PriceInputModal: React.FC<PriceInputModalProps> = ({ isOpen, product, onClose, onConfirm }) => {
  const [customPrice, setCustomPrice] = useState('');

  if (!isOpen || !product) return null;

  const handleConfirm = () => {
    const price = parseInt(customPrice);
    if (!price || price <= 0) {
      return; // Don't confirm if no valid price
    }
    onConfirm(price);
    setCustomPrice('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-xl p-4 w-64 border border-gray-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-white">Enter Price</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-gray-300 mb-3 truncate">{product.name}</p>

        <div className="mb-3">
          <input
            type="number"
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0"
            autoFocus
            className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-lg text-center
              focus:border-amber-500 focus:ring-2 focus:ring-amber-500 outline-none"
          />
          <p className="text-[10px] text-gray-500 mt-1 text-center">UGX</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!customPrice || parseInt(customPrice) <= 0}
            className="flex-1 px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg
              hover:from-amber-700 hover:to-amber-800 transition-colors text-xs font-medium
              disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

// Creative color palette for product categories
const CATEGORY_COLORS: Record<string, { bg: string; border: string; hover: string; text: string }> = {
  'Care Products': { bg: 'bg-emerald-600/20', border: 'border-emerald-500/50', hover: 'hover:bg-emerald-600/40', text: 'text-emerald-300' },
  'Cleaning': { bg: 'bg-blue-600/20', border: 'border-blue-500/50', hover: 'hover:bg-blue-600/40', text: 'text-blue-300' },
  'Accessories': { bg: 'bg-purple-600/20', border: 'border-purple-500/50', hover: 'hover:bg-purple-600/40', text: 'text-purple-300' },
  'Bags & Cases': { bg: 'bg-amber-600/20', border: 'border-amber-500/50', hover: 'hover:bg-amber-600/40', text: 'text-amber-300' },
  'Leather Goods': { bg: 'bg-rose-600/20', border: 'border-rose-500/50', hover: 'hover:bg-rose-600/40', text: 'text-rose-300' },
  'default': { bg: 'bg-gray-600/20', border: 'border-gray-500/50', hover: 'hover:bg-gray-600/40', text: 'text-gray-300' },
};

const getCategoryStyle = (category: string) => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['default'];
};

const ProductSalesSection: React.FC<ProductSalesSectionProps> = ({
  isAdmin,
  onProductSelect,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
}) => {
  const { products } = useRetailProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<RetailProduct | null>(null);

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.sort();
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleProductClick = (product: RetailProduct) => {
    setSelectedProduct(product);
    setPriceModalOpen(true);
  };

  const handlePriceConfirm = (price: number) => {
    if (selectedProduct) {
      onProductSelect(selectedProduct, price);
    }
    setSelectedProduct(null);
  };

  const handlePriceModalClose = () => {
    setPriceModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg border-t-4 border-t-amber-500 overflow-hidden">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShoppingBag className="text-amber-400 w-4 h-4" />
            Products
          </h2>
          {isAdmin && (
            <button
              onClick={onAddProduct}
              className="flex items-center gap-1 px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white
                text-[10px] font-medium rounded-lg transition-colors"
            >
              <Plus size={12} />
              Add
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full pl-7 pr-3 py-1.5 bg-gray-700/50 border border-gray-600 rounded-lg text-white
              text-[11px] placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Category Filter - Compact horizontal scroll */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors
              ${selectedCategory === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors
                ${selectedCategory === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid - 4 columns x 9 rows max */}
      <div className="p-2 max-h-[calc(100vh-480px)] overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            {filteredProducts.slice(0, 36).map((product) => {
              const style = getCategoryStyle(product.category);
              return (
                <div key={product.id} className="relative group">
                  <button
                    onClick={() => handleProductClick(product)}
                    className={`w-full ${style.bg} ${style.border} border rounded-lg py-2 px-1.5
                      transition-all duration-200 text-center ${style.hover}`}
                  >
                    <span className={`${style.text} text-[10px] font-medium leading-tight block truncate`}>
                      {product.name}
                    </span>
                  </button>

                  {/* Admin Controls */}
                  {isAdmin && (
                    <div className="absolute -top-1 -right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProduct(product);
                        }}
                        className="p-1 bg-blue-600 hover:bg-blue-700 rounded text-white shadow-lg"
                      >
                        <Edit2 size={8} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${product.name}"?`)) {
                            onDeleteProduct(product.id);
                          }
                        }}
                        className="p-1 bg-red-600 hover:bg-red-700 rounded text-white shadow-lg"
                      >
                        <Trash2 size={8} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {filteredProducts.length > 36 && (
          <p className="text-[10px] text-gray-500 text-center mt-2">
            +{filteredProducts.length - 36} more products
          </p>
        )}
      </div>

      {/* Price Input Modal */}
      <PriceInputModal
        isOpen={priceModalOpen}
        product={selectedProduct}
        onClose={handlePriceModalClose}
        onConfirm={handlePriceConfirm}
      />
    </div>
  );
};

export default ProductSalesSection;

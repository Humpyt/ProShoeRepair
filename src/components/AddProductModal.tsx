import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faImage,
  faUpload,
  faBarcode,
  faBox,
  faDollarSign,
  faTag
} from '@fortawesome/free-solid-svg-icons';

interface Product {
  id: string;
  name: string;
  category: string;
  type: 'product' | 'service';
  price: number;
  stock?: number;
  description: string;
  image?: string;
  sku?: string;
  barcode?: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  categories: string[];
}

export default function AddProductModal({
  isOpen,
  onClose,
  onSave,
  categories
}: AddProductModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [product, setProduct] = useState<Product>({
    id: Math.random().toString(36).substr(2, 9),
    name: '',
    category: categories[0],
    type: 'product',
    price: 0,
    stock: 0,
    description: '',
    sku: '',
    barcode: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setProduct({ ...product, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateBarcode = () => {
    // Generate a random 12-digit number for demonstration
    const barcode = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    setProduct({ ...product, barcode });
  };

  const handleSave = () => {
    onSave(product);
    setCurrentStep(1);
    setImagePreview(null);
    setProduct({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      category: categories[0],
      type: 'product',
      price: 0,
      stock: 0,
      description: '',
      sku: '',
      barcode: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Add New Product</h2>
            <div className="flex mt-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    step === currentStep
                      ? 'bg-indigo-500'
                      : step < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="mt-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faImage}
                      className="text-gray-600 text-5xl"
                    />
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <FontAwesomeIcon
                      icon={faUpload}
                      className="text-white text-2xl"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) =>
                      setProduct({ ...product, name: e.target.value })
                    }
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                    placeholder="Product name"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Category</label>
                  <select
                    value={product.category}
                    onChange={(e) =>
                      setProduct({ ...product, category: e.target.value })
                    }
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Price</label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          price: parseFloat(e.target.value)
                        })
                      }
                      className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Stock</label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faBox}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="number"
                      value={product.stock}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          stock: parseInt(e.target.value)
                        })
                      }
                      className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-400 mb-2">Description</label>
                  <textarea
                    value={product.description}
                    onChange={(e) =>
                      setProduct({ ...product, description: e.target.value })
                    }
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                    rows={3}
                    placeholder="Product description"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">SKU</label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faTag}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={product.sku}
                      onChange={(e) =>
                        setProduct({ ...product, sku: e.target.value })
                      }
                      className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                      placeholder="SKU"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Barcode</label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faBarcode}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={product.barcode}
                      onChange={(e) =>
                        setProduct({ ...product, barcode: e.target.value })
                      }
                      className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-indigo-500 focus:outline-none"
                      placeholder="Barcode"
                    />
                    <button
                      onClick={generateBarcode}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-500 hover:text-indigo-400"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">Preview</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white ml-2">{product.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white ml-2">{product.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Price:</span>
                    <span className="text-white ml-2">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Stock:</span>
                    <span className="text-white ml-2">{product.stock}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          )}
          <div className="ml-auto">
            <button
              onClick={
                currentStep === 3
                  ? handleSave
                  : () => setCurrentStep(currentStep + 1)
              }
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            >
              {currentStep === 3 ? 'Add Product' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Part } from '../types/Part';
import { X, Package, Truck, DollarSign, ShoppingCart, AlertCircle } from 'lucide-react';

interface PartModalProps {
  part: Part;
  onClose: () => void;
}

const PartModal: React.FC<PartModalProps> = ({ part, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Adding to cart:', part);
    // You can implement cart functionality or redirect to purchase
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Part Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Part Image */}
            <div className="space-y-4">
              <div className="relative h-80 bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={part.partImage}
                  alt={part.partName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
                {part.availableQty <= 5 && part.availableQty > 0 && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Low Stock
                  </div>
                )}
                {part.availableQty === 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>

            {/* Part Information */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {part.partName}
                </h1>
                <div className="flex items-center text-3xl font-bold text-blue-600 mb-4">
                  <DollarSign className="w-8 h-8" />
                  <span>{part.price.toFixed(2)}</span>
                </div>
              </div>

              {/* Compatibility */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Vehicle Compatibility
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Make:</span>
                    <span className="font-semibold">{part.vehicleMake}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model:</span>
                    <span className="font-semibold">{part.vehicleModel}</span>
                  </div>
                </div>
              </div>

              {/* Part Category */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Part Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold">{part.partCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className={`font-semibold ${
                      part.availableQty > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {part.availableQty > 0 ? `${part.availableQty} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Warning */}
              {part.availableQty <= 5 && part.availableQty > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-orange-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">Low Stock Alert</span>
                  </div>
                  <p className="text-orange-700 mt-1">
                    Only {part.availableQty} units remaining. Order soon to avoid disappointment.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={part.availableQty === 0}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                    part.availableQty === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {part.availableQty === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Additional Information */}
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Free shipping on orders over $50</p>
                <p>• 30-day return policy</p>
                <p>• Genuine and aftermarket parts available</p>
                <p>• Expert customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartModal;
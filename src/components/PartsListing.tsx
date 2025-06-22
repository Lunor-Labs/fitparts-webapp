import React, { useState, useEffect } from 'react';
import { Part, PartFilters } from '../types/Part';
import { dummyParts } from '../data/dummyParts';
import { Search, Filter, X, Package, DollarSign, Truck, Eye, Database, TrendingUp, AlertTriangle } from 'lucide-react';
import PartModal from './PartModal';

const PartsListing: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<PartFilters>({
    make: '',
    model: '',
    category: '',
    searchTerm: ''
  });

  // Unique values for filter dropdowns
  const [uniqueMakes, setUniqueMakes] = useState<string[]>([]);
  const [uniqueModels, setUniqueModels] = useState<string[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  // Statistics for showcase
  const [stats, setStats] = useState({
    totalParts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    averagePrice: 0
  });

  useEffect(() => {
    // Simulate loading from Firestore
    setTimeout(() => {
      fetchParts();
    }, 1000);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [parts, filters]);

  const fetchParts = async () => {
    try {
      setLoading(true);
      
      // Using dummy data instead of Firestore for demonstration
      const partsData = dummyParts;
      setParts(partsData);
      
      // Extract unique values for filters
      const makes = [...new Set(partsData.map(part => part.vehicleMake))].sort();
      const models = [...new Set(partsData.map(part => part.vehicleModel))].sort();
      const categories = [...new Set(partsData.map(part => part.partCategory))].sort();
      
      setUniqueMakes(makes);
      setUniqueModels(models);
      setUniqueCategories(categories);

      // Calculate statistics
      const totalParts = partsData.length;
      const lowStockItems = partsData.filter(part => part.availableQty > 0 && part.availableQty <= 5).length;
      const outOfStockItems = partsData.filter(part => part.availableQty === 0).length;
      const averagePrice = partsData.reduce((sum, part) => sum + part.price, 0) / totalParts;

      setStats({
        totalParts,
        lowStockItems,
        outOfStockItems,
        averagePrice
      });
    } catch (error) {
      console.error('Error fetching parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = parts;

    if (filters.make) {
      filtered = filtered.filter(part => 
        part.vehicleMake.toLowerCase().includes(filters.make.toLowerCase())
      );
    }

    if (filters.model) {
      filtered = filtered.filter(part => 
        part.vehicleModel.toLowerCase().includes(filters.model.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(part => 
        part.partCategory.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(part => 
        part.partName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        part.partCategory.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        part.vehicleMake.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        part.vehicleModel.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredParts(filtered);
  };

  const clearFilters = () => {
    setFilters({
      make: '',
      model: '',
      category: '',
      searchTerm: ''
    });
  };

  const openModal = (part: Part) => {
    setSelectedPart(part);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPart(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Parts Database</h3>
          <p className="text-gray-600">Fetching the latest inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Statistics */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Vehicle Parts Catalog
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Browse our extensive collection of genuine and aftermarket parts
          </p>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalParts}</div>
              <div className="text-sm text-gray-600">Total Parts</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">${stats.averagePrice.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Avg. Price</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</div>
              <div className="text-sm text-gray-600">Low Stock</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.outOfStockItems}</div>
              <div className="text-sm text-gray-600">Out of Stock</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search parts, makes, models..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Make Filter */}
            <div>
              <select
                value={filters.make}
                onChange={(e) => setFilters({...filters, make: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Makes ({uniqueMakes.length})</option>
                {uniqueMakes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>

            {/* Model Filter */}
            <div>
              <select
                value={filters.model}
                onChange={(e) => setFilters({...filters, model: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Models ({uniqueModels.length})</option>
                {uniqueModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Categories ({uniqueCategories.length})</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters and Clear Button */}
          {(filters.make || filters.model || filters.category || filters.searchTerm) && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                <Filter className="w-4 h-4" />
                <span>Active filters:</span>
                {filters.searchTerm && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    Search: "{filters.searchTerm}"
                  </span>
                )}
                {filters.make && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    Make: {filters.make}
                  </span>
                )}
                {filters.model && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                    Model: {filters.model}
                  </span>
                )}
                {filters.category && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                    Category: {filters.category}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition-colors duration-200 hover:bg-blue-50 px-3 py-1 rounded-lg"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredParts.length}</span> of <span className="font-semibold text-gray-900">{parts.length}</span> parts
          </p>
          {filteredParts.length !== parts.length && (
            <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Filtered results
            </div>
          )}
        </div>

        {/* Parts Grid */}
        {filteredParts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No parts found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredParts.map((part) => (
              <div
                key={part.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group border border-gray-100"
              >
                {/* Part Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={part.partImage}
                    alt={part.partName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  {part.availableQty <= 5 && part.availableQty > 0 && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Only {part.availableQty} left!
                    </div>
                  )}
                  {part.availableQty === 0 && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Out of Stock
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Part Details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {part.partName}
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                      <Truck className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="font-medium">{part.vehicleMake} {part.vehicleModel}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                      <Package className="w-4 h-4 mr-2 text-green-600" />
                      <span className="font-medium">{part.partCategory}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-2xl font-bold text-blue-600">
                      <DollarSign className="w-6 h-6" />
                      <span>{part.price.toFixed(2)}</span>
                    </div>
                    <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      part.availableQty > 5 
                        ? 'text-green-700 bg-green-100' 
                        : part.availableQty > 0 
                        ? 'text-orange-700 bg-orange-100' 
                        : 'text-red-700 bg-red-100'
                    }`}>
                      {part.availableQty > 0 ? `${part.availableQty} in stock` : 'Out of stock'}
                    </div>
                  </div>

                  <button
                    onClick={() => openModal(part)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Demo Features Showcase */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">🚀 Demo Features Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <h3 className="font-semibold mb-2">✨ Real-time Search & Filtering</h3>
              <p className="text-sm text-blue-100">Try searching for "brake", filtering by "Honda", or selecting "Engine" category</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <h3 className="font-semibold mb-2">📊 Smart Inventory Management</h3>
              <p className="text-sm text-blue-100">Notice low stock warnings and out-of-stock indicators on parts</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <h3 className="font-semibold mb-2">🔍 Detailed Part Modals</h3>
              <p className="text-sm text-blue-100">Click "View Details" on any part to see the comprehensive modal view</p>
            </div>
          </div>
        </div>
      </div>

      {/* Part Modal */}
      {showModal && selectedPart && (
        <PartModal part={selectedPart} onClose={closeModal} />
      )}
    </div>
  );
};

export default PartsListing;
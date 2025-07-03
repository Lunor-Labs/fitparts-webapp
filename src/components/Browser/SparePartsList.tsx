import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { Phone, MessageCircle, ArrowLeft, Star, MapPin, Eye, Heart, Filter, Grid, List, Search, DollarSign, Package } from 'lucide-react';
import { db } from '../../config/firebase';
import { SparePart, Shop, Category } from '../../types';

interface SparePartsListProps {
  category: Category;
  onBack: () => void;
}

const SparePartsList: React.FC<SparePartsListProps> = ({ category, onBack }) => {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [shops, setShops] = useState<{ [key: string]: Shop }>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    loadParts();
  }, [category.id]);

  const loadParts = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'spareParts'),
        where('categoryId', '==', category.id),
        where('isApproved', '==', true)
      );
      
      const snapshot = await getDocs(q);
      const partsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SparePart[];
      
      setParts(partsList);

      // Load shop details for each part
      const shopIds = [...new Set(partsList.map(part => part.shopId))];
      const shopData: { [key: string]: Shop } = {};
      
      for (const shopId of shopIds) {
        const shopDoc = await getDocs(query(collection(db, 'shops'), where('id', '==', shopId)));
        if (!shopDoc.empty) {
          shopData[shopId] = shopDoc.docs[0].data() as Shop;
        }
      }
      
      setShops(shopData);
    } catch (error) {
      console.error('Error loading spare parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async (part: SparePart, type: 'phone' | 'whatsapp') => {
    try {
      // Update click analytics
      await updateDoc(doc(db, 'spareParts', part.id), {
        contactCount: increment(1)
      });
      
      const shop = shops[part.shopId];
      if (type === 'phone' && shop?.phone) {
        window.open(`tel:${shop.phone}`, '_blank');
      } else if (type === 'whatsapp' && shop?.whatsapp) {
        const message = `Hi! I'm interested in your ${part.name} spare part.`;
        window.open(`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
      }
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  };

  const handlePartClick = async (part: SparePart) => {
    try {
      await updateDoc(doc(db, 'spareParts', part.id), {
        clickCount: increment(1)
      });
    } catch (error) {
      console.error('Error updating click count:', error);
    }
  };

  const getFilteredAndSortedParts = () => {
    let filtered = parts.filter(part => {
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           part.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCondition = filterCondition === 'all' || part.condition === filterCondition;
      const matchesAvailability = filterAvailability === 'all' || part.availability === filterAvailability;
      
      return matchesSearch && matchesCondition && matchesAvailability;
    });

    // Sort parts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'popular':
          return b.clickCount - a.clickCount;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  };

  const filteredParts = getFilteredAndSortedParts();

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800 border-green-200';
      case 'used': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'refurbished': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'bg-green-100 text-green-800 border-green-200';
      case 'out-of-stock': return 'bg-red-100 text-red-800 border-red-200';
      case 'on-order': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-8">
          <div className="flex justify-center items-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-300 animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="font-medium">Back</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
              </div>
              <p className="text-gray-600">
                <Package className="h-4 w-4 inline mr-1" />
                {filteredParts.length} parts available
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search parts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
            </div>

            {/* Condition Filter */}
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="all">All Conditions</option>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>

            {/* Availability Filter */}
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="all">All Availability</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="on-order">On Order</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {filteredParts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No spare parts found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchTerm || filterCondition !== 'all' || filterAvailability !== 'all'
                ? 'No parts match your current filters. Try adjusting your search criteria.'
                : 'No spare parts are available in this category yet.'
              }
            </p>
            {(searchTerm || filterCondition !== 'all' || filterAvailability !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCondition('all');
                  setFilterAvailability('all');
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredParts.map((part, index) => {
              const shop = shops[part.shopId];
              return (
                <div
                  key={part.id}
                  className={`group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                  onClick={() => handlePartClick(part)}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Grid View */}
                      {part.imageUrls.length > 0 && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={part.imageUrls[0]}
                            alt={part.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-3 right-3 flex space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getConditionColor(part.condition)}`}>
                              {part.condition}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(part.availability)}`}>
                              {part.availability.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-5">
                        <div className="mb-3">
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                            {part.name}
                          </h3>
                          {part.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{part.description}</p>
                          )}
                        </div>

                        {part.price && (
                          <div className="mb-4">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-xl font-bold text-green-600">${part.price}</span>
                            </div>
                          </div>
                        )}

                        {shop && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm font-semibold text-gray-900">{shop.name}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span className="line-clamp-1">{shop.address}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{part.clickCount}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{part.contactCount}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {shop?.phone && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleContact(part, 'phone');
                              }}
                              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                            >
                              <Phone className="h-4 w-4" />
                              <span>Call</span>
                            </button>
                          )}
                          {shop?.whatsapp && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleContact(part, 'whatsapp');
                              }}
                              className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2.5 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span>WhatsApp</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      {part.imageUrls.length > 0 && (
                        <div className="w-32 h-32 flex-shrink-0">
                          <img
                            src={part.imageUrls[0]}
                            alt={part.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {part.name}
                          </h3>
                          {part.price && (
                            <span className="text-lg font-bold text-green-600">${part.price}</span>
                          )}
                        </div>
                        
                        {part.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{part.description}</p>
                        )}

                        <div className="flex items-center space-x-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getConditionColor(part.condition)}`}>
                            {part.condition}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor(part.availability)}`}>
                            {part.availability.replace('-', ' ')}
                          </span>
                        </div>

                        {shop && (
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <Star className="h-4 w-4 text-yellow-400" />
                                <span className="text-sm font-semibold text-gray-900">{shop.name}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <MapPin className="h-3 w-3" />
                                <span className="line-clamp-1">{shop.address}</span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              {shop?.phone && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleContact(part, 'phone');
                                  }}
                                  className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                                >
                                  <Phone className="h-3 w-3" />
                                  <span>Call</span>
                                </button>
                              )}
                              {shop?.whatsapp && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleContact(part, 'whatsapp');
                                  }}
                                  className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                                >
                                  <MessageCircle className="h-3 w-3" />
                                  <span>WhatsApp</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SparePartsList;
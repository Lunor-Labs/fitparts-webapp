import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { Phone, MessageCircle, ArrowLeft, Star, MapPin } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{parts.length} parts available</p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Categories</span>
          </button>
        </div>

        {parts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No spare parts found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parts.map((part) => {
              const shop = shops[part.shopId];
              return (
                <div
                  key={part.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  onClick={() => handlePartClick(part)}
                >
                  {part.imageUrls.length > 0 && (
                    <img
                      src={part.imageUrls[0]}
                      alt={part.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{part.name}</h3>
                    {part.description && (
                      <p className="text-sm text-gray-600 mb-3">{part.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        part.condition === 'new' ? 'bg-green-100 text-green-800' :
                        part.condition === 'used' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {part.condition}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        part.availability === 'in-stock' ? 'bg-green-100 text-green-800' :
                        part.availability === 'out-of-stock' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {part.availability}
                      </span>
                    </div>

                    {part.price && (
                      <div className="mb-3">
                        <span className="text-lg font-bold text-gray-900">${part.price}</span>
                      </div>
                    )}

                    {shop && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-900">{shop.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{shop.address}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      {shop?.phone && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContact(part, 'phone');
                          }}
                          className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
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
                          className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>WhatsApp</span>
                        </button>
                      )}
                    </div>
                  </div>
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
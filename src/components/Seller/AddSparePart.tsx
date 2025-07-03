import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ChevronRight, ArrowLeft, Upload, Plus, X } from 'lucide-react';
import { db, storage } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { Category, Shop } from '../../types';
import CategoryProposal from './CategoryProposal';

interface AddSparePartProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddSparePart: React.FC<AddSparePartProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPath, setCurrentPath] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [userShop, setUserShop] = useState<Shop | null>(null);
  const [showCategoryProposal, setShowCategoryProposal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    condition: 'used' as 'new' | 'used' | 'refurbished',
    availability: 'in-stock' as 'in-stock' | 'out-of-stock' | 'on-order',
    imageFiles: [] as File[]
  });

  useEffect(() => {
    loadUserShop();
    loadCategories();
  }, [user, currentPath]);

  const loadUserShop = async () => {
    if (!user) return;
    
    try {
      const q = query(collection(db, 'shops'), where('sellerId', '==', user.id));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setUserShop(snapshot.docs[0].data() as Shop);
      }
    } catch (error) {
      console.error('Error loading user shop:', error);
    }
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;
      const q = query(
        collection(db, 'categories'),
        where('parentId', '==', parentId),
        where('isApproved', '==', true)
      );
      
      const snapshot = await getDocs(q);
      const categoryList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      
      setCategories(categoryList);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category: Category) => {
    // Check if this category has children
    const q = query(
      collection(db, 'categories'),
      where('parentId', '==', category.id),
      where('isApproved', '==', true)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // This is a leaf category, select it
      setSelectedCategory(category);
    } else {
      // Navigate deeper
      setCurrentPath([...currentPath, category]);
    }
  };

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, imageFiles: [...formData.imageFiles, ...files] });
  };

  const removeImage = (index: number) => {
    const newFiles = formData.imageFiles.filter((_, i) => i !== index);
    setFormData({ ...formData, imageFiles: newFiles });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userShop || !selectedCategory || !formData.name.trim()) return;

    setSubmitting(true);
    try {
      // Upload images
      const imageUrls: string[] = [];
      for (const file of formData.imageFiles) {
        const imageRef = ref(storage, `spare-parts/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(imageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        imageUrls.push(url);
      }

      // Create spare part document
      await addDoc(collection(db, 'spareParts'), {
        sellerId: user.id,
        shopId: userShop.id,
        categoryId: selectedCategory.id,
        categoryPath: selectedCategory.path,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: formData.price ? parseFloat(formData.price) : null,
        condition: formData.condition,
        availability: formData.availability,
        imageUrls,
        isApproved: false, // Requires admin approval
        createdAt: new Date(),
        updatedAt: new Date(),
        clickCount: 0,
        contactCount: 0
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding spare part:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!userShop) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Required</h3>
          <p className="text-gray-600 mb-4">
            You need to set up your shop before adding spare parts.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Setup Shop
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add Spare Part</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            {!selectedCategory ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Select Category</h4>
                    <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                      <span>Root</span>
                      {currentPath.map((category, index) => (
                        <React.Fragment key={category.id}>
                          <ChevronRight className="h-4 w-4" />
                          <span>{category.name}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {currentPath.length > 0 && (
                      <button
                        onClick={handleBack}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowCategoryProposal(true)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Propose Category</span>
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No categories found at this level.</p>
                    <button
                      onClick={() => setShowCategoryProposal(true)}
                      className="mt-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Propose a new category
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category)}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3">
                          {category.imageUrl && (
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          <span className="font-medium text-gray-900">{category.name}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900">Selected Category</h4>
                      <p className="text-blue-700">{selectedCategory.path.join(' → ')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Part Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter part name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="refurbished">Refurbished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability *
                    </label>
                    <select
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                      <option value="on-order">On Order</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the spare part..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.imageFiles.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {formData.imageFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Adding Part...' : 'Add Spare Part'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {showCategoryProposal && (
        <CategoryProposal
          parentCategory={currentPath.length > 0 ? currentPath[currentPath.length - 1] : undefined}
          onClose={() => setShowCategoryProposal(false)}
          onSuccess={() => {
            // Optionally reload categories or show success message
          }}
        />
      )}
    </>
  );
};

export default AddSparePart;
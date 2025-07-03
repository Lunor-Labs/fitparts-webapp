import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { db } from '../../config/firebase';
import { Category } from '../../types';

interface CategoryBrowserProps {
  onSelectCategory: (category: Category) => void;
}

const CategoryBrowser: React.FC<CategoryBrowserProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPath, setCurrentPath] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, [currentPath]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;
      const q = query(
        collection(db, 'categories'),
        where('parentId', '==', parentId),
        where('isApproved', '==', true),
        orderBy('order', 'asc')
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

  const handleCategoryClick = (category: Category) => {
    // Check if this is a leaf category by attempting to load children
    const checkChildren = async () => {
      const q = query(
        collection(db, 'categories'),
        where('parentId', '==', category.id),
        where('isApproved', '==', true)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // This is a leaf category, show spare parts
        onSelectCategory(category);
      } else {
        // Navigate deeper
        setCurrentPath([...currentPath, category]);
      }
    };
    
    checkChildren();
  };

  const handleBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = ['All Categories'];
    currentPath.forEach(category => {
      breadcrumbs.push(category.name);
    });
    return breadcrumbs;
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
            <h2 className="text-xl font-semibold text-gray-900">Browse Categories</h2>
            <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
              {getBreadcrumbs().map((crumb, index) => (
                <React.Fragment key={index}>
                  <span>{crumb}</span>
                  {index < getBreadcrumbs().length - 1 && <ChevronRight className="h-4 w-4" />}
                </React.Fragment>
              ))}
            </div>
          </div>
          {currentPath.length > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found at this level.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  {category.imageUrl && (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">Level {category.level}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBrowser;
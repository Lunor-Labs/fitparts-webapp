import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ChevronRight, ArrowLeft, Grid, List, Search, Filter } from 'lucide-react';
import { db } from '../../config/firebase';
import { Category } from '../../types';

interface CategoryBrowserProps {
  onSelectCategory: (category: Category) => void;
}

const CategoryBrowser: React.FC<CategoryBrowserProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPath, setCurrentPath] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setCurrentPath([]);
    } else {
      setCurrentPath(currentPath.slice(0, index + 1));
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ name: 'All Categories', id: 'root', index: -1 }];
    currentPath.forEach((category, index) => {
      breadcrumbs.push({ name: category.name, id: category.id, index });
    });
    return breadcrumbs;
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Categories</h2>
              
              {/* Breadcrumbs */}
              <nav className="flex items-center space-x-2 text-sm">
                {getBreadcrumbs().map((crumb, index) => (
                  <React.Fragment key={crumb.id}>
                    <button
                      onClick={() => handleBreadcrumbClick(crumb.index)}
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium hover:underline"
                    >
                      {crumb.name}
                    </button>
                    {index < getBreadcrumbs().length - 1 && (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {currentPath.length > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="font-medium">Back</span>
                </button>
              )}
              
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
          </div>

          {/* Search Bar */}
          {categories.length > 6 && (
            <div className="mt-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No categories found' : 'No categories available'}
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchTerm 
                ? `No categories match "${searchTerm}". Try adjusting your search.`
                : 'No categories are available at this level.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-3'
          }>
            {filteredCategories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  viewMode === 'grid'
                    ? 'bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 hover:shadow-blue-100'
                    : 'bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-300 hover:bg-blue-50'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {viewMode === 'grid' ? (
                  <>
                    {/* Grid View */}
                    <div className="relative">
                      {category.imageUrl ? (
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden bg-gray-100 group-hover:scale-110 transition-transform duration-300">
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl font-bold text-blue-600">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">Level {category.level}</p>
                      
                      <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl"></div>
                    </div>
                    
                    <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                      <span className="text-sm font-medium mr-2">Explore</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </>
                ) : (
                  <>
                    {/* List View */}
                    <div className="flex items-center space-x-4">
                      {category.imageUrl ? (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <span className="text-lg font-bold text-blue-600">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">Level {category.level}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                  </>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBrowser;
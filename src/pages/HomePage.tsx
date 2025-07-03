import React, { useState } from 'react';
import { Search, ArrowRight, Package, Users, Star } from 'lucide-react';
import CategoryBrowser from '../components/Browser/CategoryBrowser';
import SparePartsList from '../components/Browser/SparePartsList';
import { Category } from '../types';

const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBackToBrowser = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 md:p-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Find the Perfect Spare Parts for Your Vehicle
          </h1>
          <p className="text-lg md:text-xl mb-6 text-blue-100">
            Connect with trusted sellers and find quality spare parts for any vehicle make and model.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Browsing
            </button>
            <button className="border border-blue-300 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Become a Seller
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <Package className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">10,000+</h3>
          <p className="text-gray-600">Quality Parts</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">500+</h3>
          <p className="text-gray-600">Trusted Sellers</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <Star className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">50,000+</h3>
          <p className="text-gray-600">Happy Customers</p>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {selectedCategory ? (
          <SparePartsList 
            category={selectedCategory} 
            onBack={handleBackToBrowser}
          />
        ) : (
          <CategoryBrowser onSelectCategory={handleCategorySelect} />
        )}
      </div>

      {/* How It Works Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Browse Categories</h3>
            <p className="text-gray-600">Navigate through our comprehensive catalog of vehicle parts organized by make, model, and section.</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Find Your Part</h3>
            <p className="text-gray-600">Discover the exact spare part you need from our network of verified sellers.</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Connect & Buy</h3>
            <p className="text-gray-600">Contact sellers directly via phone or WhatsApp to negotiate and complete your purchase.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
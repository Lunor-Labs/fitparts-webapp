import React, { useState } from 'react';
import { Search, ArrowRight, Package, Users, Star, Zap, Shield, Clock } from 'lucide-react';
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
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white rounded-2xl p-8 md:p-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-4xl">
          <div className="inline-flex items-center space-x-2 bg-blue-500/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Zap className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-medium text-blue-100">Find Parts Instantly</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Find the Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Spare Parts
            </span>
            for Your Vehicle
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl leading-relaxed">
            Connect with trusted sellers and discover quality spare parts for any vehicle make and model. Fast, reliable, and affordable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2">
              <Search className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Start Browsing</span>
            </button>
            <button className="group border-2 border-blue-300 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <Package className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Become a Seller</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-yellow-300/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">10,000+</h3>
          <p className="text-gray-600 font-medium">Quality Parts Available</p>
          <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        </div>
        
        <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:border-green-200 transition-all duration-300 hover:-translate-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
          <p className="text-gray-600 font-medium">Trusted Sellers</p>
          <div className="mt-4 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        </div>
        
        <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:border-yellow-200 transition-all duration-300 hover:-translate-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            <Star className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">50,000+</h3>
          <p className="text-gray-600 font-medium">Happy Customers</p>
          <div className="mt-4 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
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

      {/* Features Section */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose SpareParts Finder?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience the fastest and most reliable way to find automotive spare parts</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast Search</h3>
            <p className="text-gray-600 leading-relaxed">Find exactly what you need in seconds with our intelligent search and filtering system.</p>
          </div>
          
          <div className="group text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Sellers</h3>
            <p className="text-gray-600 leading-relaxed">All our sellers are thoroughly vetted to ensure you get quality parts from trusted sources.</p>
          </div>
          
          <div className="group text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Availability</h3>
            <p className="text-gray-600 leading-relaxed">Browse and contact sellers anytime, anywhere. Our platform never sleeps.</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Get the parts you need in three simple steps</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-purple-200"></div>
          
          <div className="group text-center relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
              <Search className="h-8 w-8 text-white" />
            </div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Browse Categories</h3>
            <p className="text-gray-600 leading-relaxed">Navigate through our comprehensive catalog of vehicle parts organized by make, model, and section.</p>
          </div>
          
          <div className="group text-center relative">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Find Your Part</h3>
            <p className="text-gray-600 leading-relaxed">Discover the exact spare part you need from our network of verified sellers with detailed information.</p>
          </div>
          
          <div className="group text-center relative">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
              <ArrowRight className="h-8 w-8 text-white" />
            </div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Connect & Buy</h3>
            <p className="text-gray-600 leading-relaxed">Contact sellers directly via phone or WhatsApp to negotiate and complete your purchase securely.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
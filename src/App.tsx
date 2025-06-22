import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Car, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  ArrowDown,
  Package,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import PartsListing from './components/PartsListing';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'parts'>('landing');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [searchFilters, setSearchFilters] = useState({
    make: '',
    model: '',
    year: '',
    category: ''
  });

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Found the exact brake pads I needed for my 2018 Honda Civic. Fast shipping and genuine parts!",
      vehicle: "2018 Honda Civic"
    },
    {
      name: "Mike Rodriguez",
      rating: 5,
      text: "Great selection of aftermarket parts. Saved me hundreds compared to the dealership.",
      vehicle: "2020 Ford F-150"
    },
    {
      name: "Emma Chen",
      rating: 5,
      text: "Verified sellers made me feel confident in my purchase. Excellent customer service too!",
      vehicle: "2019 Toyota Camry"
    }
  ];

  const features = [
    {
      icon: Car,
      title: "Wide Range of Genuine & Aftermarket Parts",
      description: "From OEM replacements to performance upgrades, we have parts for every vehicle and budget."
    },
    {
      icon: ShieldCheck,
      title: "Verified Seller Shops",
      description: "All our sellers are thoroughly vetted and rated by customers to ensure quality and reliability."
    },
    {
      icon: Truck,
      title: "Quick Shipping and Returns",
      description: "Fast nationwide shipping with easy returns. Get your parts when you need them most."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const scrollToSearch = () => {
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to parts listing view
    setCurrentView('parts');
  };

  const navigateToPartsListing = () => {
    setCurrentView('parts');
  };

  const navigateToLanding = () => {
    setCurrentView('landing');
  };

  if (currentView === 'parts') {
    return (
      <div>
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={navigateToLanding}
                className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                PartsMarketplace
              </button>
              <div className="flex items-center space-x-4">
                <button
                  onClick={navigateToLanding}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </nav>
        <PartsListing />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
            alt="Modern automotive workshop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/85 to-slate-800/90"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-6 py-2 mb-8">
            <Zap className="w-4 h-4 text-blue-300" />
            <span className="text-blue-200 text-sm font-medium">Trusted by 50,000+ Vehicle Owners</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="block text-white mb-2">Find the Perfect</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
              Part for Your Ride
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Search by car make, model, and category. No sign-up needed.<br />
            <span className="text-lg text-blue-200">Genuine & aftermarket parts from verified sellers nationwide.</span>
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <Shield className="w-6 h-6 text-blue-300" />
              <span className="text-white font-medium">Verified Sellers</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <Truck className="w-6 h-6 text-green-300" />
              <span className="text-white font-medium">Fast Shipping</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <Clock className="w-6 h-6 text-purple-300" />
              <span className="text-white font-medium">24/7 Support</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={scrollToSearch}
              className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 border border-blue-500/50"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Search className="w-6 h-6" />
                Start Searching Parts Now
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
            
            <button 
              onClick={navigateToPartsListing}
              className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            >
              <Package className="w-6 h-6" />
              Browse All Parts
              <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-200 text-sm">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">100K+</div>
              <div className="text-blue-200 text-sm">Parts Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-200 text-sm">Verified Sellers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200 text-sm">Customer Support</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <button 
            onClick={scrollToSearch}
            className="animate-bounce bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30 hover:bg-white/30 transition-colors duration-300"
          >
            <ArrowDown className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 animate-float">
            <Car className="w-8 h-8 text-blue-300" />
          </div>
        </div>
        <div className="absolute top-40 right-10 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 animate-float delay-1000">
            <Package className="w-8 h-8 text-purple-300" />
          </div>
        </div>
        <div className="absolute bottom-40 left-20 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 animate-float delay-500">
            <ShieldCheck className="w-8 h-8 text-green-300" />
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Quick Part Search</h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">Find exactly what you need in seconds with our advanced search filters</p>
          </div>
          
          <form onSubmit={handleSearch} className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">Vehicle Make</label>
                <select 
                  value={searchFilters.make}
                  onChange={(e) => setSearchFilters({...searchFilters, make: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">Select Make</option>
                  <option value="honda">Honda</option>
                  <option value="toyota">Toyota</option>
                  <option value="ford">Ford</option>
                  <option value="chevrolet">Chevrolet</option>
                  <option value="nissan">Nissan</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">Model</label>
                <select 
                  value={searchFilters.model}
                  onChange={(e) => setSearchFilters({...searchFilters, model: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">Select Model</option>
                  <option value="civic">Civic</option>
                  <option value="camry">Camry</option>
                  <option value="f150">F-150</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">Year</label>
                <select 
                  value={searchFilters.year}
                  onChange={(e) => setSearchFilters({...searchFilters, year: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">Select Year</option>
                  {Array.from({length: 25}, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">Part Category</label>
                <select 
                  value={searchFilters.category}
                  onChange={(e) => setSearchFilters({...searchFilters, category: e.target.value})}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">Select Category</option>
                  <option value="brakes">Brakes</option>
                  <option value="engine">Engine</option>
                  <option value="transmission">Transmission</option>
                  <option value="suspension">Suspension</option>
                  <option value="electrical">Electrical</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
              >
                <Search className="w-6 h-6" />
                Search Parts
              </button>
              <button 
                type="button"
                onClick={navigateToPartsListing}
                className="sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
              >
                <Package className="w-6 h-6" />
                Browse All
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our Marketplace?
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              We connect you with trusted sellers and quality parts, making vehicle maintenance simple and affordable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-10 rounded-3xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-2xl group bg-gradient-to-br from-white to-gray-50"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-xl">
              Join thousands of satisfied customers who found their perfect parts
            </p>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-12 lg:p-16 max-w-5xl mx-auto border border-gray-100">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-2xl lg:text-3xl text-gray-800 mb-8 italic leading-relaxed font-medium">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div>
                  <p className="font-bold text-gray-900 text-xl mb-2">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-gray-600 text-lg">
                    {testimonials[currentTestimonial].vehicle}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-10 gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-700/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            Ready to Find Your Parts?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of customers who trust us for their vehicle part needs. 
            Start your search today and get back on the road faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={scrollToSearch}
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Start Searching Parts Now
            </button>
            <button 
              onClick={navigateToPartsListing}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Browse All Parts
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6">PartsMarketplace</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your trusted source for quality vehicle parts from verified sellers nationwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 bg-gray-800 p-3 rounded-full">
                  <Phone className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 bg-gray-800 p-3 rounded-full">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={navigateToPartsListing}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    Browse Parts
                  </button>
                </li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Seller Login</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Track Order</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Returns</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Support
                  </a>
                </li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Shipping Info</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-5 h-5" />
                  <span>1-800-PARTS-24</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-5 h-5" />
                  <span>support@partsmarketplace.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5" />
                  <span>Available Nationwide</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-10 mt-16 text-center">
            <p className="text-gray-400">
              © 2024 PartsMarketplace. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
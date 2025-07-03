import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Package, Store, Plus, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { SparePart, Shop as ShopType, CategoryProposal } from '../../types';
import ShopSetup from './ShopSetup';
import AddSparePart from './AddSparePart';
import CategoryProposalModal from './CategoryProposal';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [shop, setShop] = useState<ShopType | null>(null);
  const [parts, setParts] = useState<SparePart[]>([]);
  const [proposals, setProposals] = useState<CategoryProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showShopSetup, setShowShopSetup] = useState(false);
  const [showAddPart, setShowAddPart] = useState(false);
  const [showCategoryProposal, setShowCategoryProposal] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load shop data
      const shopQuery = query(collection(db, 'shops'), where('sellerId', '==', user.id));
      const shopSnapshot = await getDocs(shopQuery);
      if (!shopSnapshot.empty) {
        const shopData = shopSnapshot.docs[0].data();
        setShop({ 
          id: shopSnapshot.docs[0].id, 
          ...shopData,
          createdAt: shopData.createdAt?.toDate ? shopData.createdAt.toDate() : new Date(shopData.createdAt),
          updatedAt: shopData.updatedAt?.toDate ? shopData.updatedAt.toDate() : new Date(shopData.updatedAt)
        } as ShopType);
      }

      // Load spare parts
      const partsQuery = query(collection(db, 'spareParts'), where('sellerId', '==', user.id));
      const partsSnapshot = await getDocs(partsQuery);
      const partsList = partsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
        };
      }) as SparePart[];
      setParts(partsList);

      // Load category proposals
      const proposalsQuery = query(collection(db, 'categoryProposals'), where('sellerId', '==', user.id));
      const proposalsSnapshot = await getDocs(proposalsQuery);
      const proposalsList = proposalsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          reviewedAt: data.reviewedAt?.toDate ? data.reviewedAt.toDate() : (data.reviewedAt ? new Date(data.reviewedAt) : undefined)
        };
      }) as CategoryProposal[];
      setProposals(proposalsList);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user?.isApproved) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <Clock className="h-8 w-8 text-yellow-600" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">Account Pending Approval</h3>
            <p className="text-yellow-700">
              Your seller account is currently under review. You'll be able to access all features once approved by our admin team.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <div className="flex space-x-3">
            {!shop && (
              <button
                onClick={() => setShowShopSetup(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Setup Shop</span>
              </button>
            )}
            <button
              onClick={() => setShowAddPart(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Part</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Parts</p>
                <p className="text-2xl font-bold text-gray-900">{parts.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Parts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {parts.filter(p => p.isApproved).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {parts.reduce((sum, p) => sum + p.clickCount, 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shop Status</p>
                <p className="text-sm font-medium text-gray-900">
                  {shop ? (shop.isApproved ? 'Approved' : 'Pending') : 'Not Setup'}
                </p>
              </div>
              <Store className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {['overview', 'parts', 'proposals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {shop && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Shop Information</h3>
                  <button
                    onClick={() => setShowShopSetup(true)}
                    className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
                  >
                    Edit Shop
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Shop Name</p>
                    <p className="font-medium text-gray-900">{shop.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shop.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {shop.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">{shop.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">{shop.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'parts' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Spare Parts</h3>
              {parts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No spare parts added yet.</p>
                  <button
                    onClick={() => setShowAddPart(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Part
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {parts.map((part) => (
                    <div
                      key={part.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        {part.imageUrls.length > 0 && (
                          <img
                            src={part.imageUrls[0]}
                            alt={part.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{part.name}</h4>
                          <p className="text-sm text-gray-600">{part.condition} • {part.availability}</p>
                          <p className="text-xs text-gray-500">{part.categoryPath.join(' → ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{part.clickCount} views</p>
                          <p className="text-sm text-gray-600">{part.contactCount} contacts</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          part.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {part.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Category Proposals</h3>
                <button
                  onClick={() => setShowCategoryProposal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Propose Category</span>
                </button>
              </div>
              {proposals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No category proposals submitted yet.</p>
                  <button
                    onClick={() => setShowCategoryProposal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Your First Proposal
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{proposal.name}</h4>
                        <p className="text-sm text-gray-600">{proposal.reason}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted on {proposal.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(proposal.status)}
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {proposal.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showShopSetup && (
        <ShopSetup
          existingShop={shop}
          onClose={() => setShowShopSetup(false)}
          onSuccess={loadDashboardData}
        />
      )}

      {showAddPart && (
        <AddSparePart
          onClose={() => setShowAddPart(false)}
          onSuccess={loadDashboardData}
        />
      )}

      {showCategoryProposal && (
        <CategoryProposalModal
          onClose={() => setShowCategoryProposal(false)}
          onSuccess={loadDashboardData}
        />
      )}
    </>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Package, Eye, TrendingUp, CheckCircle, XCircle, Clock, Settings } from 'lucide-react';
import { db } from '../../config/firebase';
import { User, Shop, SparePart, CategoryProposal } from '../../types';
import CategoryManager from './CategoryManager';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [parts, setParts] = useState<SparePart[]>([]);
  const [proposals, setProposals] = useState<CategoryProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Load users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
        };
      }) as User[];
      setUsers(usersList);

      // Load shops
      const shopsSnapshot = await getDocs(collection(db, 'shops'));
      const shopsList = shopsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)
        };
      }) as Shop[];
      setShops(shopsList);

      // Load spare parts
      const partsSnapshot = await getDocs(collection(db, 'spareParts'));
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
      const proposalsSnapshot = await getDocs(collection(db, 'categoryProposals'));
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
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isApproved: true
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isApproved: true } : user
      ));
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleApproveShop = async (shopId: string) => {
    try {
      await updateDoc(doc(db, 'shops', shopId), {
        isApproved: true
      });
      setShops(shops.map(shop => 
        shop.id === shopId ? { ...shop, isApproved: true } : shop
      ));
    } catch (error) {
      console.error('Error approving shop:', error);
    }
  };

  const handleApprovePart = async (partId: string) => {
    try {
      await updateDoc(doc(db, 'spareParts', partId), {
        isApproved: true
      });
      setParts(parts.map(part => 
        part.id === partId ? { ...part, isApproved: true } : part
      ));
    } catch (error) {
      console.error('Error approving part:', error);
    }
  };

  const handleApproveProposal = async (proposalId: string) => {
    try {
      await updateDoc(doc(db, 'categoryProposals', proposalId), {
        status: 'approved',
        reviewedAt: new Date()
      });
      setProposals(proposals.map(proposal => 
        proposal.id === proposalId ? { ...proposal, status: 'approved' as const } : proposal
      ));
    } catch (error) {
      console.error('Error approving proposal:', error);
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    try {
      await updateDoc(doc(db, 'categoryProposals', proposalId), {
        status: 'rejected',
        reviewedAt: new Date()
      });
      setProposals(proposals.map(proposal => 
        proposal.id === proposalId ? { ...proposal, status: 'rejected' as const } : proposal
      ));
    } catch (error) {
      console.error('Error rejecting proposal:', error);
    }
  };

  const getAnalyticsData = () => {
    const topParts = parts
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 10)
      .map(part => ({
        name: part.name,
        clicks: part.clickCount,
        contacts: part.contactCount
      }));

    const categoryData = parts.reduce((acc, part) => {
      const category = part.categoryPath[part.categoryPath.length - 1];
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
      name,
      value
    }));

    return { topParts, categoryChartData };
  };

  const { topParts, categoryChartData } = getAnalyticsData();

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Shops</p>
              <p className="text-2xl font-bold text-gray-900">{shops.length}</p>
            </div>
            <Package className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Parts</p>
              <p className="text-2xl font-bold text-gray-900">{parts.length}</p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
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
            <Eye className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['overview', 'users', 'shops', 'parts', 'proposals', 'categories', 'analytics'].map((tab) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Users</span>
                <span className="text-sm font-medium text-gray-900">
                  {users.filter(u => !u.isApproved).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Shops</span>
                <span className="text-sm font-medium text-gray-900">
                  {shops.filter(s => !s.isApproved).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Parts</span>
                <span className="text-sm font-medium text-gray-900">
                  {parts.filter(p => !p.isApproved).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Category Proposals</span>
                <span className="text-sm font-medium text-gray-900">
                  {proposals.filter(p => p.status === 'pending').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Total clicks increased by 15%</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">3 new sellers registered</span>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">12 new parts added</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && <CategoryManager />}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{user.displayName || user.email}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      Joined {user.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    {!user.isApproved && (
                      <button
                        onClick={() => handleApproveUser(user.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'shops' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Management</h3>
            <div className="space-y-4">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{shop.name}</h4>
                    <p className="text-sm text-gray-600">{shop.address}</p>
                    <p className="text-xs text-gray-500">
                      Created {shop.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shop.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {shop.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    {!shop.isApproved && (
                      <button
                        onClick={() => handleApproveShop(shop.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'parts' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spare Parts Management</h3>
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
                      <p className="text-sm text-gray-600">{part.categoryPath.join(' → ')}</p>
                      <p className="text-xs text-gray-500">
                        {part.clickCount} views • {part.contactCount} contacts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      part.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {part.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    {!part.isApproved && (
                      <button
                        onClick={() => handleApprovePart(part.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'proposals' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Proposals</h3>
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{proposal.name}</h4>
                    <p className="text-sm text-gray-600">{proposal.reason}</p>
                    <p className="text-xs text-gray-500">
                      Submitted {proposal.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                      proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {proposal.status}
                    </span>
                    {proposal.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveProposal(proposal.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectProposal(proposal.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Parts</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topParts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Parts by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
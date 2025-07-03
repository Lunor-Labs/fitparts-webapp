import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Edit, Trash2, Upload, Save, X, ChevronRight, FolderPlus } from 'lucide-react';
import { db, storage } from '../../config/firebase';
import { Category } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const CategoryManager: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPath, setCurrentPath] = useState<Category[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    imageFile: null as File | null,
    order: 0
  });

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

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      let imageUrl = '';
      
      // Upload image if provided
      if (formData.imageFile) {
        const imageRef = ref(storage, `categories/${Date.now()}_${formData.imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, formData.imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;
      const level = currentPath.length;
      const path = [...currentPath.map(c => c.name), formData.name];

      await addDoc(collection(db, 'categories'), {
        name: formData.name,
        parentId,
        level,
        path,
        imageUrl,
        isApproved: true, // Admin-created categories are auto-approved
        createdAt: new Date(),
        order: formData.order
      });

      setFormData({ name: '', imageFile: null, order: 0 });
      setShowAddForm(false);
      loadCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !formData.name.trim()) return;

    try {
      let imageUrl = editingCategory.imageUrl || '';
      
      // Upload new image if provided
      if (formData.imageFile) {
        const imageRef = ref(storage, `categories/${Date.now()}_${formData.imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, formData.imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await updateDoc(doc(db, 'categories', editingCategory.id), {
        name: formData.name,
        imageUrl,
        order: formData.order,
        updatedAt: new Date()
      });

      setEditingCategory(null);
      setFormData({ name: '', imageFile: null, order: 0 });
      loadCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCategoryClick = (category: Category) => {
    setCurrentPath([...currentPath, category]);
  };

  const handleBack = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index));
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      imageFile: null,
      order: category.order || 0
    });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setFormData({ name: '', imageFile: null, order: 0 });
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ name: 'Root Categories', id: 'root' }];
    currentPath.forEach((category, index) => {
      breadcrumbs.push({ name: category.name, id: category.id, index });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
            {getBreadcrumbs().map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                <button
                  onClick={() => crumb.id === 'root' ? setCurrentPath([]) : handleBreadcrumbClick(crumb.index)}
                  className="hover:text-blue-600 transition-colors"
                >
                  {crumb.name}
                </button>
                {index < getBreadcrumbs().length - 1 && <ChevronRight className="h-4 w-4" />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex space-x-3">
          {currentPath.length > 0 && (
            <button
              onClick={handleBack}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Category</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', imageFile: null, order: 0 });
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentPath.length === 0 ? 'Root Categories' : `${currentPath[currentPath.length - 1].name} Subcategories`}
          </h3>
          
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <FolderPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No categories found at this level.</p>
              <p className="text-sm text-gray-400 mt-2">Click "Add Category" to create the first category.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {category.imageUrl && (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      {editingCategory?.id === category.id ? (
                        <form onSubmit={handleEditCategory} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                          <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Order"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                            className="text-xs"
                          />
                          <button
                            type="submit"
                            className="bg-green-600 text-white p-1 rounded hover:bg-green-700 transition-colors"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="bg-gray-600 text-white p-1 rounded hover:bg-gray-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </form>
                      ) : (
                        <>
                          <h4 className="font-medium text-gray-900">{category.name}</h4>
                          <p className="text-sm text-gray-500">
                            Level {category.level} • Order: {category.order || 0}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    >
                      <span>Browse</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => startEdit(category)}
                      className="bg-yellow-600 text-white p-1 rounded hover:bg-yellow-700 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="bg-red-600 text-white p-1 rounded hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
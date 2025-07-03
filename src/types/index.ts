export interface User {
  id: string;
  email: string;
  role: 'seller' | 'admin';
  displayName?: string;
  createdAt: Date;
  isApproved?: boolean;
}

export interface Shop {
  id: string;
  sellerId: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  level: number;
  path: string[];
  imageUrl?: string;
  isApproved: boolean;
  proposedBy?: string;
  createdAt: Date;
  order?: number;
}

export interface SparePart {
  id: string;
  sellerId: string;
  shopId: string;
  categoryId: string;
  categoryPath: string[];
  name: string;
  description?: string;
  price?: number;
  condition: 'new' | 'used' | 'refurbished';
  availability: 'in-stock' | 'out-of-stock' | 'on-order';
  imageUrls: string[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  clickCount: number;
  contactCount: number;
}

export interface CategoryProposal {
  id: string;
  sellerId: string;
  name: string;
  parentId?: string;
  level: number;
  path: string[];
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface Analytics {
  itemClicks: { [itemId: string]: number };
  sellerEngagement: { [sellerId: string]: { clicks: number; contacts: number } };
  categoryViews: { [categoryId: string]: number };
  topItems: Array<{ id: string; name: string; clicks: number }>;
  topSellers: Array<{ id: string; name: string; engagement: number }>;
}
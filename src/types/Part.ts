export interface Part {
  id: string;
  partName: string;
  partImage: string;
  partCategory: string;
  vehicleMake: string;
  vehicleModel: string;
  price: number;
  availableQty: number;
}

export interface PartFilters {
  make: string;
  model: string;
  category: string;
  searchTerm: string;
}
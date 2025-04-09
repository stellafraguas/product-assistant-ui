export interface Product {
  id?: number;
  name: string;
  description: string;
  categoryId: number;
  categoryDisplayName: string;
  price: number;
  active: boolean;
  createdBy?: string;
  lastUpdatedBy?: string;
  createdAt?: string;
  lastUpdatedAt?: string;
}

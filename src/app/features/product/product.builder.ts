import { Product } from './product.model';

export class ProductBuilder {
  static fromForm(form: any): Product {
    return {
      id: form.id,
      name: form.name,
      description: form.description,
      categoryId: form.categoryId,
      categoryDisplayName: form.categoryDisplayName,
      price: form.price,
      active: form.active,
      createdBy: form.createdBy ?? '',
      lastUpdatedBy: form.lastUpdatedBy ?? '',
      createdAt: form.createdAt ?? new Date().toISOString(),
      lastUpdatedAt: form.lastUpdatedAt ?? new Date().toISOString()
    };
  }
}

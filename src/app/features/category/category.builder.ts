import { Category } from '../models/category';

export class CategoryBuilder {
  private category: Category;

  constructor() {
    this.category = {
      categoryId: 1,
      categoryDisplayName: 'Default Category'
    };
  }

  withCategoryId(id: number): CategoryBuilder {
    this.category.categoryId = id;
    return this;
  }

  withCategoryDisplayName(name: string): CategoryBuilder {
    this.category.categoryDisplayName = name;
    return this;
  }

  build(): Category {
    return { ...this.category };
  }
}

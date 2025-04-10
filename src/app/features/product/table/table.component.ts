import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';
import { ProductService } from '../product.service';
import { CategoryService } from '../../category/category.service';
import { Product } from '../product.model';
import { Category } from '../../category/category.model';
import { ProductBuilder } from '../product.builder';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  products: Product[] = [];
  categories: Category[] = [];
  newProductForm: FormGroup | null = null;
  editProductForm: FormGroup | null = null;
  editingProductId: number | null = null;
  isAdmin = false;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe(data => {
      this.products = data.sort((a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
    });
  }

  loadCategories(callback?: () => void): void {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data.sort((a, b) => a.categoryId - b.categoryId);
      if (callback) callback();
    });
  }

  addRow(): void {
    this.cancel();
    this.newProductForm = this.fb.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      categoryId: new FormControl(null, Validators.required),
      categoryDisplayName: new FormControl('', Validators.required),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
      active: new FormControl(true, Validators.required),
      createdBy: new FormControl(this.isAdmin ? 'admin' : 'user', Validators.required),
      createdAt: new FormControl(new Date().toISOString().slice(0, 16), Validators.required)
    });

    this.loadCategories(() => this.syncCategoryFields(this.newProductForm!));
  }

  edit(product: Product): void {
    this.cancel();
    this.editingProductId = product.id ?? null;

    this.editProductForm = this.fb.group({
      name: new FormControl(product.name, Validators.required),
      description: new FormControl(product.description, Validators.required),
      categoryId: new FormControl(product.categoryId, Validators.required),
      categoryDisplayName: new FormControl(product.categoryDisplayName, Validators.required),
      price: new FormControl(product.price, [Validators.required, Validators.min(0)]),
      active: new FormControl(product.active, Validators.required),
      lastUpdatedBy: new FormControl(this.isAdmin ? 'admin' : 'user', Validators.required),
      lastUpdatedAt: new FormControl(new Date().toISOString().slice(0, 16), Validators.required)
    });

    this.loadCategories(() => this.syncCategoryFields(this.editProductForm!));
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      const headers = this.isAdmin
        ? new HttpHeaders({ Authorization: 'Basic ' + btoa('admin:admin') })
        : new HttpHeaders();

      this.productService.delete(id, headers).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  cancel(): void {
    this.editingProductId = null;
    if (this.newProductForm) this.newProductForm.reset();
    if (this.editProductForm) this.editProductForm.reset();
    this.newProductForm = null;
    this.editProductForm = null;
  }

  save(): void {
    if (this.newProductForm?.valid) {
      const product = ProductBuilder.fromForm(this.newProductForm.value);
      this.productService.create(product).subscribe(created => {
        this.loadProducts();
        this.cancel();
      });
    } else if (this.editProductForm?.valid && this.editingProductId !== null) {
      const updatedProduct = ProductBuilder.fromForm(this.editProductForm.value);
      this.productService.update(this.editingProductId, updatedProduct).subscribe(() => {
        this.loadProducts();
        this.cancel();
      });
    }
  }

  toggleAdmin(): void {
    this.isAdmin = !this.isAdmin;
  }

  private syncCategoryFields(form: FormGroup): void {
    form.get('categoryId')?.valueChanges.subscribe((id: number | string | null) => {
      const numericId = Number(id);
      const matched = this.categories.find(c => c.categoryId === numericId);
      if (matched) {
        form.get('categoryDisplayName')?.setValue(matched.categoryDisplayName, { emitEvent: false });
      }
    });

    form.get('categoryDisplayName')?.valueChanges.subscribe((displayName: string) => {
      const matched = this.categories.find(c => c.categoryDisplayName === displayName);
      if (matched) {
        form.get('categoryId')?.setValue(matched.categoryId, { emitEvent: false });
      }
    });
  }

}

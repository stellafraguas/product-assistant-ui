import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
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
      createdBy: new FormControl('user', Validators.required),
      createdAt: new FormControl(new Date().toISOString().slice(0, 16), Validators.required)
    });

    this.loadCategories(() => this.syncCategoryFields(this.newProductForm!));
  }

  cancel(): void {
    if (this.newProductForm) this.newProductForm.reset();
    this.newProductForm = null;
  }

  save(): void {
    if (this.newProductForm?.valid) {
      const product = ProductBuilder.fromForm(this.newProductForm.value);
      this.productService.create(product).subscribe(created => {
        this.loadProducts();
        this.cancel();
      });
    }
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

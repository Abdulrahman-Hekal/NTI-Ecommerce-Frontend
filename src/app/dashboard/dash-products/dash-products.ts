import { CommonModule, CurrencyPipe, NgOptimizedImage, provideImgixLoader } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IProduct, IProductQuery } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/productsService/products.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoriesService } from '../../core/services/categoriesService/categories.service';
import { ICategory } from '../../core/models/category.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dash-products',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CurrencyPipe, NgOptimizedImage],
  providers: [provideImgixLoader(environment.staticUrl)],
  templateUrl: './dash-products.html',
  styleUrl: './dash-products.css',
})
export class DashProducts implements OnInit {
  // Properties
  productsList = signal<IProduct[]>([]);
  categories = signal<ICategory[]>([]);
  maxPriceInProducts = signal(1000);
  targetProduct = signal<IProduct>({} as IProduct);
  isSuccess = signal(false);
  isError = signal(false);
  alertMessage = signal('');
  // Forms
  // TDF
  searchInput = '';
  selectedCategory = '';
  selectedSubCategory = '';
  minPrice = 0;
  maxPrice = this.maxPriceInProducts();
  sortBy = '';
  // Reactive
  productForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    stock: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    categoryId: new FormControl(''),
    subCategoryId: new FormControl('', Validators.required),
    image: new FormControl(null),
  });
  updateProductForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    stock: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    categoryId: new FormControl(''),
    subCategoryId: new FormControl('', Validators.required),
    image: new FormControl(null),
  });
  // Injections
  private readonly _productsService = inject(ProductsService);
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
    this.getMaxPrice();
  }

  // Methods
  // Get
  getProducts(query?: IProductQuery) {
    this._productsService
      .getAllProducts(query)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.productsList.set(res.data);
        },
        error: (res) => {
          this.alertMessage.set(res.error.message);
          this.isError.set(true);
          setTimeout(() => {
            this.isError.set(false);
          }, 2500);
        },
      });
  }
  getMaxPrice() {
    const query = { sortBy: '-price' };
    this._productsService
      .getAllProducts(query)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.maxPriceInProducts.set(res.data[0].price);
          this.maxPrice = this.maxPriceInProducts();
        },
        error: (res) => {
          this.alertMessage.set(res.error.message);
          this.isError.set(true);
          setTimeout(() => {
            this.isError.set(false);
          }, 2500);
        },
      });
  }
  getCategories() {
    this._categoriesService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.categories.set(res.data);
          this.productForm.patchValue({ categoryId: res.data[0]._id });
          this.productForm.patchValue({ subCategoryId: res.data[0].subCategories[0]._id });
        },
        error: (res) => {
          this.alertMessage.set(res.error.message);
          this.isError.set(true);
          setTimeout(() => {
            this.isError.set(false);
          }, 2500);
        },
      });
  }

  // Search
  search() {
    const query = { search: this.searchInput };
    this.getProducts(query);
  }

  // Filters
  applyFilters() {
    const query = {
      minPrice: this.minPrice.toString(),
      maxPrice: this.maxPrice.toString(),
    } as IProductQuery;
    if (this.selectedCategory) {
      query.category = this.selectedCategory;
    }
    if (this.selectedSubCategory) {
      query.subCategory = this.selectedSubCategory;
    }
    if (this.sortBy) {
      query.sortBy = this.sortBy;
    }
    this.getProducts(query);
  }

  // Add
  setImgForAdd(e: any) {
    if (e.target.files.length > 0) {
      this.productForm.patchValue({ image: e.target.files[0] });
    }
  }
  addProduct() {
    if (this.productForm.valid) {
      if (this.productForm.value.image) {
        const formData = new FormData();
        formData.append('title', this.productForm.value.title ?? '');
        formData.append('description', this.productForm.value.description ?? '');
        formData.append('price', this.productForm.value.price?.toString() ?? '');
        formData.append('stock', this.productForm.value.stock?.toString() ?? '');
        formData.append('subCategoryId', this.productForm.value.subCategoryId ?? '');
        formData.append('image', this.productForm.value.image ?? '');
        this._productsService
          .addProduct(formData)
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe({
            next: (res) => {
              this.getProducts();
              this.productForm.reset();
              this.productForm.patchValue({ image: null });
              this.alertMessage.set(res.message);
              this.isSuccess.set(true);
              setTimeout(() => {
                this.isSuccess.set(false);
              }, 2500);
            },
            error: (res) => {
              this.alertMessage.set(res.error.message);
              this.isError.set(true);
              setTimeout(() => {
                this.isError.set(false);
              }, 2500);
            },
          });
      } else {
        this.alertMessage.set('Product image is required');
        this.isError.set(true);
        setTimeout(() => {
          this.isError.set(false);
        }, 2500);
      }
    } else {
      this.alertMessage.set('The Form is not Valid');
      this.isError.set(true);
      setTimeout(() => {
        this.isError.set(false);
      }, 2500);
    }
  }

  // Update
  updateProduct(product: IProduct) {
    this.targetProduct.set(product);
    this.updateProductForm.patchValue({
      title: this.targetProduct().title,
      description: this.targetProduct().description,
      price: this.targetProduct().price,
      stock: this.targetProduct().stock,
      categoryId: this.targetProduct().category._id,
      subCategoryId: this.targetProduct().subCategory._id,
    });
  }
  setImgForUpdate(e: any) {
    if (e.target.files.length > 0) {
      this.updateProductForm.patchValue({ image: e.target.files[0] });
    }
  }
  confirmUpdate() {
    if (this.updateProductForm.valid) {
      const formData = new FormData();
      formData.append('title', this.updateProductForm.value.title ?? '');
      formData.append('description', this.updateProductForm.value.description ?? '');
      formData.append('price', this.updateProductForm.value.price?.toString() ?? '');
      formData.append('stock', this.updateProductForm.value.stock?.toString() ?? '');
      formData.append('subCategoryId', this.updateProductForm.value.subCategoryId ?? '');
      if (this.updateProductForm.value.image) {
        formData.append('image', this.updateProductForm.value.image);
      }
      this._productsService
        .updateProduct(this.targetProduct()._id, formData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this.getProducts();
            this.updateProductForm.reset();
            this.updateProductForm.patchValue({ image: null });
            this.alertMessage.set(res.message);
            this.isSuccess.set(true);
            setTimeout(() => {
              this.isSuccess.set(false);
            }, 2500);
          },
          error: (res) => {
            this.alertMessage.set(res.error.message);
            this.isError.set(true);
            setTimeout(() => {
              this.isError.set(false);
            }, 2500);
          },
        });
    } else {
      this.alertMessage.set('The Form is not Valid');
      this.isError.set(true);
      setTimeout(() => {
        this.isError.set(false);
      }, 2500);
    }
  }

  // Delete
  setTarget(product: IProduct) {
    this.targetProduct.set(product);
  }
  confirmDelete() {
    this._productsService
      .deleteProduct(this.targetProduct()._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.getProducts();
          this.alertMessage.set(res.message);
          this.isSuccess.set(true);
          setTimeout(() => {
            this.isSuccess.set(false);
          }, 2500);
        },
        error: (res) => {
          this.alertMessage.set(res.error.message);
          this.isError.set(true);
          setTimeout(() => {
            this.isError.set(false);
          }, 2500);
        },
      });
  }
}

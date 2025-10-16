import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Testimonial } from './testimonial/testimonial';
import { IProduct, IProductQuery } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/productsService/products.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductCard } from './product-card/product-card';
import { FormsModule } from '@angular/forms';
import { ICategory } from '../../core/models/category.model';
import { CategoriesService } from '../../core/services/categoriesService/categories.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [Testimonial, ProductCard, FormsModule, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Properties
  products = signal<IProduct[]>([]);
  categories = signal<ICategory[]>([]);
  maxPriceInProducts = signal(1000);
  isSuccess = signal(false);
  isError = signal(false);
  alertMessage = signal('');
  // Forms
  searchInput = '';
  selectedCategory = '';
  selectedSubCategory = '';
  minPrice = 0;
  maxPrice = this.maxPriceInProducts();
  sortBy = '';
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
  // get
  getProducts(query?: IProductQuery) {
    this._productsService
      .getAllProducts(query)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.products.set(res.data);
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
}

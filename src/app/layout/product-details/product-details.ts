import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { IProduct } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/productsService/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CommonModule,
  CurrencyPipe,
  NgOptimizedImage,
  provideImgixLoader,
  TitleCasePipe,
} from '@angular/common';
import { environment } from '../../../environments/environment';
import { CartService } from '../../core/services/cartService/cart.service';
import { LocalCartService } from '../../core/services/localCartService/local.cart.service';
import { AuthService } from '../../core/services/authService/auth.service';
import { ERole } from '../../core/models/enums';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../core/services/categoriesService/categories.service';
import { ICategory } from '../../core/models/category.model';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, NgOptimizedImage, TitleCasePipe, CurrencyPipe, ReactiveFormsModule],
  providers: [provideImgixLoader(environment.staticUrl)],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  // Properties
  product = signal<IProduct>({} as IProduct);
  categories = signal<ICategory[]>([]);
  isLoggedin = signal(false);
  isAdmin = signal(false);
  isSuccess = signal(false);
  isError = signal(false);
  alertMessage = signal('');
  // Forms
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
  private readonly _authService = inject(AuthService);
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _productsService = inject(ProductsService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _cartService = inject(CartService);
  private readonly _localCartService = inject(LocalCartService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
    this.isLoggedin.set(this._authService.isLoggedin());
    this.isAdmin.set(
      this._authService.isRole(ERole.admin) || this._authService.isRole(ERole.superAdmin)
    );
    this.getProduct();
    this.getCategories();
  }

  // Methods
  // get
  getProduct() {
    const slug = this._activatedRoute.snapshot.paramMap.get('slug');
    if (slug) {
      this._productsService
        .getProductBySlug(slug)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this.product.set(res.data);
          },
          error: (res) => {
            this._router.navigate(['/not-found']);
          },
        });
    } else {
      this._router.navigate(['/home']);
    }
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

  // add
  addToCart() {
    if (this.isLoggedin()) {
      const data = { productId: this.product()._id, quantity: 1 };
      this._cartService
        .addToCart(data)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
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
      const data = {
        productId: this.product()._id,
        title: this.product().title,
        image: this.product().image,
        stock: this.product().stock,
        priceAtAdding: this.product().price,
        quantity: 1,
      };
      this._localCartService.addToLocalCart(data);
      this.alertMessage.set('Product Added to your Cart Successfully');
      this.isSuccess.set(true);
      setTimeout(() => {
        this.isSuccess.set(false);
      }, 2500);
    }
  }

  // Update
  updateProduct() {
    this.updateProductForm.patchValue({
      title: this.product().title,
      description: this.product().description,
      price: this.product().price,
      stock: this.product().stock,
      categoryId: this.product().category._id,
      subCategoryId: this.product().subCategory._id,
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
        .updateProduct(this.product()._id, formData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this._router.navigate([`/product/${res.data.slug}`]).then((_) => this.getProduct());
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
  confirmDelete() {
    this._productsService
      .deleteProduct(this.product()._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this._router.navigate(['/home']);
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

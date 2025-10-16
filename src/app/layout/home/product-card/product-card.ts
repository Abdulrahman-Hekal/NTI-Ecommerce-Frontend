import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { IProduct } from '../../../core/models/product.model';
import { CommonModule, CurrencyPipe, NgOptimizedImage, provideImgixLoader } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/authService/auth.service';
import { CartService } from '../../../core/services/cartService/cart.service';
import { LocalCartService } from '../../../core/services/localCartService/local.cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-card',
  imports: [NgOptimizedImage, CurrencyPipe, RouterLink, CommonModule],
  providers: [provideImgixLoader(environment.staticUrl)],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard implements OnInit {
  // Properties
  product = input<IProduct>({} as IProduct);
  isPriority = input<boolean>(false);
  isLoggedin = signal(false);
  isSuccess = signal(false);
  isError = signal(false);
  alertMessage = signal('');
  // Injections
  private readonly _authService = inject(AuthService);
  private readonly _cartService = inject(CartService);
  private readonly _localCartService = inject(LocalCartService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit() {
    this.isLoggedin.set(this._authService.isLoggedin());
  }

  // Methods
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
}

import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CartService } from '../../core/services/cartService/cart.service';
import { LocalCartService } from '../../core/services/localCartService/local.cart.service';
import { AuthService } from '../../core/services/authService/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICart, IItem } from '../../core/models/cart.model';
import { CommonModule, CurrencyPipe, NgOptimizedImage, provideImgixLoader } from '@angular/common';
import { environment } from '../../../environments/environment';
import { OrdersService } from '../../core/services/ordersService/orders.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../core/services/usersService/users.service';
import { IUser } from '../../core/models/user.model';
import { IOrderData } from '../../core/models/order.model';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, NgOptimizedImage, CurrencyPipe, RouterLink, FormsModule],
  providers: [provideImgixLoader(environment.staticUrl)],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  // Properties
  cart = signal<ICart>({} as ICart);
  userData = signal<IUser>({} as IUser);
  isLoggedin = signal(false);
  isPriceChanged = signal(false);
  isSuccess = signal(false);
  isError = signal(false);
  alertMessage = signal('');
  // Injections
  private readonly _authService = inject(AuthService);
  private readonly _usersService = inject(UsersService);
  private readonly _ordersService = inject(OrdersService);
  private readonly _cartService = inject(CartService);
  private readonly _localCartService = inject(LocalCartService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
    this.isLoggedin.set(this._authService.isLoggedin());
    this.getCart();
    this.getUser();
  }

  // Methods
  // get
  getCart() {
    if (this.isLoggedin()) {
      this._cartService
        .getCart()
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this.cart.set(res.data);
            this.isPriceChanged.set(this.cart().items.some((item) => item.isChanged));
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
      const localCart = this._localCartService.getLocalCart();
      if (localCart) {
        let totalQuantity = 0;
        let totalPrice = 0;
        let items: IItem[] = [];
        localCart.forEach((item) => {
          totalPrice += Number(item.priceAtAdding);
          totalQuantity += Number(item.quantity);
          items.push({
            _id: '',
            product: {
              _id: item.productId,
              title: item.title,
              price: item.priceAtAdding,
              stock: item.stock,
              image: item.image,
            },
            quantity: item.quantity,
            priceAtAdding: item.priceAtAdding,
            isChanged: false,
          });
        });
        this.cart.set({
          _id: '',
          user: '',
          items: items,
          totalQuantity: totalQuantity,
          totalPrice: totalPrice,
          createdAt: '',
          updatedAt: '',
          __v: 0,
        });
      }
    }
  }
  getUser() {
    this._usersService
      .getLoggedInUser()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.userData.set(res.data);
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

  // quantity buttons
  increaseQuantity(product: any, input: HTMLInputElement) {
    const max = Number(input.max);
    let current = Number(input.value) || 1;
    if (current < max) {
      current++;
      input.value = String(current);
      this.updateQuantity(product, { target: input });
    } else {
      this.alertMessage.set('You hit the maximum quantity in our stock');
      this.isError.set(true);
      setTimeout(() => {
        this.isError.set(false);
      }, 2500);
    }
  }
  decreaseQuantity(product: any, input: HTMLInputElement) {
    const min = Number(input.min) || 1;
    let current = Number(input.value) || min;
    if (current > min) {
      current--;
      input.value = String(current);
      this.updateQuantity(product, { target: input });
    }
  }

  // update
  updateQuantity(product: any, event: any) {
    const itemData = {
      productId: product._id,
      quantity: event.target.value,
    };
    if (this.isLoggedin()) {
      this._cartService
        .addToCart(itemData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this.getCart();
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
        productId: product._id,
        title: product.title,
        image: product.image,
        stock: product.stock,
        priceAtAdding: product.price,
        quantity: event.target.value,
      };
      this._localCartService.addToLocalCart(data);
      this.getCart();
    }
  }

  // delete
  removeFromCart(productId: string) {
    if (this.isLoggedin()) {
      this._cartService
        .removeFromCart(productId)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this.getCart();
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
      this._localCartService.removeFromLocalCart(productId);
      this.getCart();
      this.alertMessage.set('Product Removed From your cart successfully');
      this.isSuccess.set(true);
      setTimeout(() => {
        this.isSuccess.set(false);
      }, 2500);
    }
  }

  // handle changed prices
  returnToCart(item: IItem) {
    this._cartService
      .returnToCart(item.product._id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.getCart();
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

  // make order
  makeOrder() {
    const products: { productId: string; quantity: number }[] = [];
    this.cart().items.forEach((item) => {
      if (!item.isChanged) {
        const product = { productId: item.product._id, quantity: item.quantity };
        products.push(product);
      }
    });
    const address = this.userData().addresses.find((address) => address.isDefault);
    const phone = this.userData().phones.find((phone) => phone.isDefault);
    if (address && phone) {
      const data: IOrderData = {
        products: products,
        shippingAddress: address,
        phone: phone.number,
      };
      this._ordersService
        .makeOrder(data)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (res) => {
            this._cartService
              .clearCart()
              .pipe(takeUntilDestroyed(this._destroyRef))
              .subscribe({
                next: (res) => {
                  this.getCart();
                },
                error: (res) => {
                  this.alertMessage.set(res.error.message);
                  this.isError.set(true);
                  setTimeout(() => {
                    this.isError.set(false);
                  }, 2500);
                },
              });
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
      this.alertMessage.set(
        'You do not have address or phone number, enter them from your profile'
      );
      this.isError.set(true);
      setTimeout(() => {
        this.isError.set(false);
      }, 3500);
    }
  }
  // TODO: handle is Changed
}

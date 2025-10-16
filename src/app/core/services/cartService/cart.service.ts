import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ICartResponse, IItemData } from '../../models/cart.model';
import { getToken } from '../../utils/localStorage.utils';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly _httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cart`;
  private readonly cartQuantity = new BehaviorSubject<number>(0);
  private getToken() {
    return `Bearer ${getToken() || ''}`;
  }

  // Change the initial value of the BehaviorSubject
  constructor() {
    const token = getToken();
    if (token) {
      this.updateCartQuantity();
    }
  }

  cartQuantity$ = this.cartQuantity.asObservable();

  updateCartQuantity = (quantity?: number) => {
    if (quantity) {
      this.cartQuantity.next(quantity);
    } else {
      fetch(this.baseUrl, {
        headers: { 'Content-Type': 'application/json', Authorization: this.getToken() },
      })
        .then((res) => res.json())
        .then((res) => this.cartQuantity.next(res.data.totalQuantity));
    }
  };

  getCart() {
    return this._httpClient.get<ICartResponse>(`${this.baseUrl}`, {
      headers: { Authorization: this.getToken() },
    });
  }

  addToCart(itemData: IItemData) {
    return this._httpClient
      .post<ICartResponse>(`${this.baseUrl}`, itemData, {
        headers: { Authorization: this.getToken() },
      })
      .pipe(tap((res) => this.updateCartQuantity(res.data.totalQuantity)));
  }

  updateProductQuantity(productId: string, quantity: number) {
    return this._httpClient
      .put<ICartResponse>(
        `${this.baseUrl}/${productId}`,
        { quantity },
        {
          headers: { Authorization: this.getToken() },
        }
      )
      .pipe(tap((res) => this.updateCartQuantity(res.data.totalQuantity)));
  }

  returnToCart(productId: string) {
    return this._httpClient
      .put<ICartResponse>(`${this.baseUrl}/return/${productId}`, null, {
        headers: { Authorization: this.getToken() },
      })
      .pipe(tap((res) => this.updateCartQuantity(res.data.totalQuantity)));
  }

  clearCart() {
    return this._httpClient
      .delete<ICartResponse>(`${this.baseUrl}`, {
        headers: { Authorization: this.getToken() },
      })
      .pipe(tap((res) => this.updateCartQuantity(res.data.totalQuantity)));
  }

  removeFromCart(itemId: string) {
    return this._httpClient
      .delete<ICartResponse>(`${this.baseUrl}/${itemId}`, {
        headers: { Authorization: this.getToken() },
      })
      .pipe(tap((res) => this.updateCartQuantity(res.data.totalQuantity)));
  }
}

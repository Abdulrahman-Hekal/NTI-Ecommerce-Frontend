import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  addToLocalCart,
  getLocalCart,
  getLocalCartQuantity,
  removeFromLocalCart,
} from '../../utils/localStorage.utils';
import { BehaviorSubject } from 'rxjs';
import { ProductsService } from '../productsService/products.service';
import { ILocalItemData } from '../../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class LocalCartService {
  private readonly _productsService = inject(ProductsService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly localCartQuantity = new BehaviorSubject<number>(0);

  localCartQuantity$ = this.localCartQuantity.asObservable();

  updateLocalCartQuantity() {
    this.localCartQuantity.next(getLocalCartQuantity());
  }

  getLocalCart() {
    return getLocalCart();
  }

  addToLocalCart(item: ILocalItemData) {
    addToLocalCart(item);
    this.updateLocalCartQuantity();
  }

  removeFromLocalCart(productId: string) {
    removeFromLocalCart(productId);
    this.updateLocalCartQuantity();
  }
}

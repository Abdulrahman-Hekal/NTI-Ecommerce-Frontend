import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/authService/auth.service';
import { ERole } from '../../core/models/enums';
import { LocalCartService } from '../../core/services/localCartService/local.cart.service';
import { CartService } from '../../core/services/cartService/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [TitleCasePipe, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  // Properties
  username = signal('guest');
  cartQuantity = signal(0);
  isAdmin = signal(false);
  showLoginBtns = signal(true);
  // Injections
  private readonly _authService = inject(AuthService);
  private readonly _cartService = inject(CartService);
  private readonly _localCartService = inject(LocalCartService);
  private readonly _destroyRef = inject(DestroyRef);

  // Life Cycle
  ngOnInit(): void {
    this._authService.authData$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((data) => {
      if (data) {
        this.showLoginBtns.set(false);
        this.username.set(data.name);
        if (data.role !== ERole.user) {
          this.isAdmin.set(true);
        }
        this._cartService.cartQuantity$
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe((data) => this.cartQuantity.set(data));
      } else {
        this.showLoginBtns.set(true);
        this.username.set('guest');
        this.isAdmin.set(false);
        this._localCartService.updateLocalCartQuantity();
        this._localCartService.localCartQuantity$
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe((data) => this.cartQuantity.set(data));
      }
    });
  }
}

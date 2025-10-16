import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ILoginData, ITokenDecode, ITokenResponse } from '../../models/auth.model';
import { IUserData } from '../../models/user.model';
import { BehaviorSubject, tap } from 'rxjs';
import {
  decodeValidToken,
  removeToken,
  storeToken,
  uploadLocalCartToDB,
} from '../../utils/localStorage.utils';
import { Router } from '@angular/router';
import { ERole } from '../../models/enums';
import { CartService } from '../cartService/cart.service';
import { LocalCartService } from '../localCartService/local.cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _cartService = inject(CartService);
  private readonly _localCartService = inject(LocalCartService);
  private readonly baseUrl = `${environment.apiUrl}/users`;
  private readonly authData = new BehaviorSubject<ITokenDecode | null>(null);

  authData$ = this.authData.asObservable();

  isRole(role: ERole) {
    const decodedRole = decodeValidToken()?.role;
    return decodedRole === role;
  }

  isLoggedin(): boolean {
    return decodeValidToken() ? true : false;
  }

  changeLoginState() {
    const decode = decodeValidToken();
    this.authData.next(decode);
  }

  userRegister(userData: IUserData) {
    return this._httpClient.post<ITokenResponse>(`${this.baseUrl}/register`, userData).pipe(
      tap((res) => {
        storeToken(res.data.token);
        this.changeLoginState();
        uploadLocalCartToDB(this._cartService.updateCartQuantity);
        this._router.navigate(['/home']);
      })
    );
  }

  userLogin(loginData: ILoginData, checkOnly = false) {
    return this._httpClient.post<ITokenResponse>(`${this.baseUrl}/login`, loginData).pipe(
      tap((res) => {
        if (!checkOnly) {
          storeToken(res.data.token);
          this.changeLoginState();
          this._cartService.updateCartQuantity();
          this._router.navigate(['/home']);
        }
      })
    );
  }

  userLogout() {
    removeToken();
    this._router.navigate(['/home']);
    this.changeLoginState();
    this._localCartService.updateLocalCartQuantity();
  }
}

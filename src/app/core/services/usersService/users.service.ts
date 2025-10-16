import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IAdminData, IUserData, IUserResponse, IUsersResponse } from '../../models/user.model';
import { ITokenResponse } from '../../models/auth.model';
import { getToken } from '../../utils/localStorage.utils';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;
  private getToken() {
    return `Bearer ${getToken() || ''}`;
  }

  getAllUsers() {
    return this._httpClient.get<IUsersResponse>(`${this.baseUrl}/all`, {
      headers: { Authorization: this.getToken() },
    });
  }

  getAllAdmins() {
    return this._httpClient.get<IUsersResponse>(`${this.baseUrl}/all/admins`, {
      headers: { Authorization: this.getToken() },
    });
  }

  getLoggedInUser() {
    return this._httpClient.get<IUserResponse>(`${this.baseUrl}`, {
      headers: { Authorization: this.getToken() },
    });
  }

  getUserById(userId: string) {
    return this._httpClient.get<IUserResponse>(`${this.baseUrl}/${userId}`, {
      headers: { Authorization: this.getToken() },
    });
  }

  addAdmin(adminData: IAdminData) {
    return this._httpClient.post<ITokenResponse>(`${this.baseUrl}/admin`, adminData, {
      headers: { Authorization: this.getToken() },
    });
  }

  updateCurrentProfile(userData: IUserData) {
    return this._httpClient.put<IUserResponse>(`${this.baseUrl}`, userData, {
      headers: { Authorization: this.getToken() },
    });
  }

  deleteCurrentProfile() {
    return this._httpClient.delete<IUserResponse>(`${this.baseUrl}`, {
      headers: { Authorization: this.getToken() },
    });
  }

  deleteUserById(userId: string) {
    return this._httpClient.delete<IUserResponse>(`${this.baseUrl}/${userId}`, {
      headers: { Authorization: this.getToken() },
    });
  }
}

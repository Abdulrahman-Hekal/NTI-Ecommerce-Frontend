import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IOrderData, IOrderQuery, IOrderResponse, IOrdersResponse } from '../../models/order.model';
import { getToken } from '../../utils/localStorage.utils';
import { EStatus } from '../../models/enums';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly _httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/orders`;
  private getToken() {
    return `Bearer ${getToken() || ''}`;
  }

  getAllOrders(query: IOrderQuery | null = null) {
    if (query) {
      const keys = Object.keys(query) as (keyof typeof query)[];
      let queryString = '?';
      for (const key of keys) {
        queryString += `${key}=${query[key]}`;
        if (key !== keys[keys.length - 1]) {
          queryString += '&';
        }
      }
      return this._httpClient.get<IOrdersResponse>(`${this.baseUrl}/all${queryString}`, {
        headers: { Authorization: this.getToken() },
      });
    }
    return this._httpClient.get<IOrdersResponse>(`${this.baseUrl}/all`, {
      headers: { Authorization: this.getToken() },
    });
  }

  getUserOrders(status: string | null = null) {
    if (status) {
      return this._httpClient.get<IOrdersResponse>(`${this.baseUrl}?status=${status}`, {
        headers: { Authorization: this.getToken() },
      });
    }
    return this._httpClient.get<IOrdersResponse>(`${this.baseUrl}`, {
      headers: { Authorization: this.getToken() },
    });
  }

  makeOrder(orderData: IOrderData) {
    return this._httpClient.post<IOrderResponse>(`${this.baseUrl}`, orderData, {
      headers: { Authorization: this.getToken() },
    });
  }

  updateOrder(orderId: string, orderData: IOrderData) {
    return this._httpClient.put<IOrderResponse>(`${this.baseUrl}/${orderId}`, orderData, {
      headers: { Authorization: this.getToken() },
    });
  }

  changeStatus(orderId: string, status: EStatus) {
    return this._httpClient.patch<IOrderResponse>(
      `${this.baseUrl}/status/${orderId}`,
      { status },
      {
        headers: { Authorization: this.getToken() },
      }
    );
  }

  rejectOrder(orderId: string) {
    return this._httpClient.patch<IOrderResponse>(`${this.baseUrl}/reject/${orderId}`, null, {
      headers: { Authorization: this.getToken() },
    });
  }

  cancelOrder(orderId: string) {
    return this._httpClient.patch<IOrderResponse>(`${this.baseUrl}/cancel/${orderId}`, null, {
      headers: { Authorization: this.getToken() },
    });
  }

  deleteOrder(orderId: string) {
    return this._httpClient.delete<IOrderResponse>(`${this.baseUrl}/${orderId}`, {
      headers: { Authorization: this.getToken() },
    });
  }
}

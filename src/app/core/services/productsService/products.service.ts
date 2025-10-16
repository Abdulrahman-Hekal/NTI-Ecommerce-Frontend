import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IProductQuery, IProductResponse, IProductsResponse } from '../../models/product.model';
import { getToken } from '../../utils/localStorage.utils';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly _httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;
  private getToken() {
    return `Bearer ${getToken() || ''}`;
  }

  getAllProducts(query: IProductQuery | null = null) {
    if (query) {
      const keys = Object.keys(query) as (keyof typeof query)[];
      let queryString = '?';
      for (const key of keys) {
        queryString += `${key}=${query[key]}`;
        if (key !== keys[keys.length - 1]) {
          queryString += '&';
        }
      }
      return this._httpClient.get<IProductsResponse>(`${this.baseUrl}${queryString}`);
    }
    return this._httpClient.get<IProductsResponse>(`${this.baseUrl}`);
  }

  getProductBySlug(slug: string) {
    return this._httpClient.get<IProductResponse>(`${this.baseUrl}/${slug}`);
  }

  getProductById(productId: string) {
    return this._httpClient.get<IProductResponse>(`${this.baseUrl}/id/${productId}`);
  }

  addProduct(productData: FormData) {
    return this._httpClient.post<IProductResponse>(`${this.baseUrl}`, productData, {
      headers: { Authorization: this.getToken() },
    });
  }

  updateProduct(productId: string, productData: FormData) {
    return this._httpClient.put<IProductResponse>(`${this.baseUrl}/${productId}`, productData, {
      headers: { Authorization: this.getToken() },
    });
  }

  deleteProduct(productId: string) {
    return this._httpClient.delete<IProductResponse>(`${this.baseUrl}/${productId}`, {
      headers: { Authorization: this.getToken() },
    });
  }
}

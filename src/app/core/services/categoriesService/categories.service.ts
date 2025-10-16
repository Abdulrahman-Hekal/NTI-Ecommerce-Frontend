import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ICategoriesResponse, ICategoryResponse } from '../../models/category.model';
import { getToken } from '../../utils/localStorage.utils';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly _httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/categories`;
  private getToken() {
    return `Bearer ${getToken() || ''}`;
  }

  getAllCategories() {
    return this._httpClient.get<ICategoriesResponse>(`${this.baseUrl}`);
  }

  addCategory(name: string) {
    return this._httpClient.post<ICategoryResponse>(
      `${this.baseUrl}`,
      { name },
      {
        headers: { Authorization: this.getToken() },
      }
    );
  }

  updateCategory(categoryId: string, name: string) {
    return this._httpClient.put<ICategoryResponse>(
      `${this.baseUrl}/${categoryId}`,
      { name },
      {
        headers: { Authorization: this.getToken() },
      }
    );
  }

  deleteCategory(categoryId: string) {
    return this._httpClient.delete<ICategoryResponse>(`${this.baseUrl}/${categoryId}`, {
      headers: { Authorization: this.getToken() },
    });
  }
}

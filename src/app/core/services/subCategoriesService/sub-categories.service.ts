import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  ISubCategoriesResponse,
  ISubCategoryData,
  ISubCategoryResponse,
} from '../../models/sub-category.model';
import { getToken } from '../../utils/localStorage.utils';

@Injectable({
  providedIn: 'root',
})
export class SubCategoriesService {
  private readonly _httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/sub-categories`;
  private getToken() {
    return `Bearer ${getToken() || ''}`;
  }

  getAllSubCategories() {
    return this._httpClient.get<ISubCategoriesResponse>(`${this.baseUrl}`);
  }

  addSubCategory(subCategoryData: ISubCategoryData) {
    return this._httpClient.post<ISubCategoryResponse>(`${this.baseUrl}`, subCategoryData, {
      headers: { Authorization: this.getToken() },
    });
  }

  updateSubCategory(subCategoryId: string, name: string) {
    return this._httpClient.put<ISubCategoryResponse>(
      `${this.baseUrl}/${subCategoryId}`,
      { name },
      {
        headers: { Authorization: this.getToken() },
      }
    );
  }

  deleteSubCategory(subCategoryId: string) {
    return this._httpClient.delete<ISubCategoryResponse>(`${this.baseUrl}/${subCategoryId}`, {
      headers: { Authorization: this.getToken() },
    });
  }
}

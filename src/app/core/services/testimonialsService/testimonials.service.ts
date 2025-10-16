import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  ITestimonialData,
  ITestimonialResponse,
  ITestimonialsResponse,
} from '../../models/testimonial.model';
import { getToken } from '../../utils/localStorage.utils';

@Injectable({
  providedIn: 'root',
})
export class TestimonialsService {
  private readonly _httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/testimonials`;
  private getToken() {
    return `Bearer ${getToken() || ''}`;
  }

  getNonApprovedTestimonials() {
    return this._httpClient.get<ITestimonialsResponse>(`${this.baseUrl}/all`, {
      headers: { Authorization: this.getToken() },
    });
  }

  getApprovedTestimonials() {
    return this._httpClient.get<ITestimonialsResponse>(`${this.baseUrl}`);
  }

  addTestimonial(testimonialData: ITestimonialData) {
    return this._httpClient.post<ITestimonialResponse>(`${this.baseUrl}`, testimonialData, {
      headers: { Authorization: this.getToken() },
    });
  }

  approveTestimonial(testimonialId: string) {
    return this._httpClient.put<ITestimonialResponse>(`${this.baseUrl}/approve/${testimonialId}`, null, {
      headers: { Authorization: this.getToken() },
    });
  }

  deleteTestimonial(testimonialId: string) {
    return this._httpClient.delete<ITestimonialResponse>(`${this.baseUrl}/${testimonialId}`, {
      headers: { Authorization: this.getToken() },
    });
  }
}

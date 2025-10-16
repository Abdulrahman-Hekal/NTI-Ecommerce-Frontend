import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { IFaqData, IFaqResponse, IFaqsResponse } from '../../models/faq.model';
import { getToken } from '../../utils/localStorage.utils';

@Injectable({
  providedIn: 'root',
})
export class FaqsService {
  private readonly _httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/faqs`;
  private getToken() {
    return `Bearer ${getToken() || ''}`;
  }

  getFaqs() {
    return this._httpClient.get<IFaqsResponse>(`${this.baseUrl}`);
  }

  addFaq(faqData: IFaqData) {
    return this._httpClient.post<IFaqResponse>(`${this.baseUrl}`, faqData, {
      headers: { Authorization: this.getToken() },
    });
  }

  updateFaq(faqId: string, faqData: IFaqData) {
    return this._httpClient.put<IFaqResponse>(`${this.baseUrl}/${faqId}`, faqData, {
      headers: { Authorization: this.getToken() },
    });
  }

  deleteFaq(faqId: string) {
    return this._httpClient.delete<IFaqResponse>(`${this.baseUrl}/${faqId}`, {
      headers: { Authorization: this.getToken() },
    });
  }
}

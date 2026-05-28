import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API } from '../constants/api.constants';
import { FeedbackRequest, FeedbackResponse } from '../models/borrowing.model';
import { PageResponse } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  constructor(private http: HttpClient) {}

  getFeedbacks(bookId: number): Observable<FeedbackResponse[]> {
    return this.http.get<PageResponse<FeedbackResponse>>(`${API.BASE_URL}${API.FEEDBACK.BY_BOOK(bookId)}`, {
      params: { page: 1, size: 20 }
    }).pipe(map(p => p.content));
  }

  submitFeedback(req: FeedbackRequest): Observable<number> {
    return this.http.post<number>(`${API.BASE_URL}${API.FEEDBACK.BASE}`, req);
  }
}

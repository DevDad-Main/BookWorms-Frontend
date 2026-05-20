import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../constants/api.constants';
import { FeedbackRequest, FeedbackResponse } from '../models/borrowing.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  constructor(private http: HttpClient) {}

  getFeedbacks(bookId: number): Observable<FeedbackResponse[]> {
    return this.http.get<FeedbackResponse[]>(`${API.BASE_URL}${API.FEEDBACK.BY_BOOK(bookId)}`);
  }

  submitFeedback(req: FeedbackRequest): Observable<number> {
    return this.http.post<number>(`${API.BASE_URL}${API.FEEDBACK.BASE}`, req);
  }
}

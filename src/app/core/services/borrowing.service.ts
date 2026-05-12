import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../constants/api.constants';
import { BorrowedBook, BorrowingStats } from '../models/borrowing.model';

@Injectable({ providedIn: 'root' })
export class BorrowingService {
  private borrowedBooks = signal<BorrowedBook[]>([]);
  private lentBooks = signal<BorrowedBook[]>([]);
  private loading = signal(false);
  private stats = signal<BorrowingStats | null>(null);

  readonly borrowedBooks$ = this.borrowedBooks.asReadonly();
  readonly lentBooks$ = this.lentBooks.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly stats$ = this.stats.asReadonly();

  constructor(private http: HttpClient) {}

  getBorrowedBooks(): Observable<BorrowedBook[]> {
    return this.http.get<BorrowedBook[]>(`${API.BASE_URL}${API.BORROWING.BORROWED}`);
  }

  getLentBooks(): Observable<BorrowedBook[]> {
    return this.http.get<BorrowedBook[]>(`${API.BASE_URL}${API.BORROWING.LENT}`);
  }

  getPendingRequests(): Observable<BorrowedBook[]> {
    return this.http.get<BorrowedBook[]>(`${API.BASE_URL}${API.BORROWING.REQUESTS}`);
  }

  requestBorrow(bookId: number): Observable<BorrowedBook> {
    return this.http.post<BorrowedBook>(`${API.BASE_URL}${API.BOOKS.BORROW(bookId)}`, {});
  }

  approveRequest(borrowingId: number): Observable<BorrowedBook> {
    return this.http.patch<BorrowedBook>(`${API.BASE_URL}${API.BORROWING.APPROVE(borrowingId)}`, {});
  }

  rejectRequest(borrowingId: number): Observable<BorrowedBook> {
    return this.http.patch<BorrowedBook>(`${API.BASE_URL}${API.BORROWING.REJECT(borrowingId)}`, {});
  }

  requestReturn(bookId: number): Observable<BorrowedBook> {
    return this.http.post<BorrowedBook>(`${API.BASE_URL}${API.BOOKS.RETURN(bookId)}`, {});
  }

  approveReturn(borrowingId: number): Observable<BorrowedBook> {
    return this.http.patch<BorrowedBook>(`${API.BASE_URL}${API.BORROWING.APPROVE_RETURN(borrowingId)}`, {});
  }

  getStats(): Observable<BorrowingStats> {
    return this.http.get<BorrowingStats>(`${API.BASE_URL}/borrowing/stats`);
  }
}

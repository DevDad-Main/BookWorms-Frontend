import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API } from '../constants/api.constants';
import { BorrowedBook, BorrowingStats } from '../models/borrowing.model';
import { PageResponse } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class BorrowingService {
  private borrowedBooks = signal<BorrowedBook[]>([]);
  private loading = signal(false);
  private stats = signal<BorrowingStats | null>(null);

  readonly borrowedBooks$ = this.borrowedBooks.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly stats$ = this.stats.asReadonly();

  constructor(private http: HttpClient) {}

  getBorrowedBooks(page = 0, size = 20): Observable<PageResponse<BorrowedBook>> {
    return this.http.get<PageResponse<BorrowedBook>>(`${API.BASE_URL}${API.BOOKS.BORROWED}`, {
      params: { page, size }
    });
  }

  getBorrowedBooksAsList(page = 0, size = 20): Observable<BorrowedBook[]> {
    return this.getBorrowedBooks(page, size).pipe(map(p => p.content));
  }

  getReturnedBooks(page = 0, size = 20): Observable<PageResponse<BorrowedBook>> {
    return this.http.get<PageResponse<BorrowedBook>>(`${API.BASE_URL}${API.BOOKS.RETURNED}`, {
      params: { page, size }
    });
  }

  getReturnedBooksAsList(page = 0, size = 20): Observable<BorrowedBook[]> {
    return this.getReturnedBooks(page, size).pipe(map(p => p.content));
  }

  requestBorrow(bookId: number): Observable<number> {
    return this.http.post<number>(`${API.BASE_URL}${API.BOOKS.BORROW(bookId)}`, {});
  }

  requestReturn(bookId: number): Observable<number> {
    return this.http.patch<number>(`${API.BASE_URL}${API.BOOKS.RETURN(bookId)}`, {});
  }

  approveReturn(bookId: number): Observable<number> {
    return this.http.patch<number>(`${API.BASE_URL}${API.BOOKS.APPROVE_RETURN(bookId)}`, {});
  }

  getStats(): Observable<BorrowingStats> {
    return this.http.get<BorrowingStats>(`${API.BASE_URL}/borrowing/stats`);
  }
}

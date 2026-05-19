import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { Book } from '../models/book.model';
import { PageResponse } from '../models/page.model';
import { API } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class UserService {
  private loading = signal(false);

  readonly loading$ = this.loading.asReadonly();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getUserBooks(page = 0, size = 50): Observable<Book[]> {
    return this.http.get<PageResponse<Book>>(`${API.BASE_URL}${API.BOOKS.OWNER}`, {
      params: { page, size }
    }).pipe(map(p => p.content));
  }
}

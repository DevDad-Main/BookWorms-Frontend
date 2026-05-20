import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { Book } from '../models/book.model';
import { PageResponse } from '../models/page.model';
import { API } from '../constants/api.constants';

function detectMime(base64: string): string {
  if (base64.startsWith('/9j/')) return 'image/jpeg';
  if (base64.startsWith('iVBOR')) return 'image/png';
  if (base64.startsWith('R0lG')) return 'image/gif';
  if (base64.startsWith('UklGR')) return 'image/webp';
  return 'image/jpeg';
}

function normalizeCover(book: Book): Book {
  if (!book.cover) return book;
  if (book.cover.startsWith('http://') || book.cover.startsWith('https://') || book.cover.startsWith('data:')) return book;
  const mime = detectMime(book.cover);
  return { ...book, cover: `data:${mime};base64,${book.cover}` };
}

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
    }).pipe(map(p => ({
      ...p,
      content: p.content.map(normalizeCover)
    })), map(p => p.content));
  }
}

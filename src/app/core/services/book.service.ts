import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API } from '../constants/api.constants';
import { Book, BookRequest, BookFilters } from '../models/book.model';
import { PageResponse } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private books = signal<Book[]>([]);
  private selectedBook = signal<Book | null>(null);
  private loading = signal(false);

  readonly books$ = this.books.asReadonly();
  readonly selectedBook$ = this.selectedBook.asReadonly();
  readonly loading$ = this.loading.asReadonly();

  constructor(private http: HttpClient) {}

  getAllBooks(filters?: BookFilters): Observable<PageResponse<Book>> {
    const page = filters?.page ?? 0;
    const size = filters?.size ?? 20;
    return this.http.get<PageResponse<Book>>(`${API.BASE_URL}${API.BOOKS.BASE}`, {
      params: { page, size }
    });
  }

  getAllBooksAsList(filters?: BookFilters): Observable<Book[]> {
    return this.getAllBooks(filters).pipe(map(p => p.content));
  }

  getOwnerBooks(filters?: BookFilters): Observable<PageResponse<Book>> {
    const page = filters?.page ?? 0;
    const size = filters?.size ?? 20;
    return this.http.get<PageResponse<Book>>(`${API.BASE_URL}${API.BOOKS.OWNER}`, {
      params: { page, size }
    });
  }

  getOwnerBooksAsList(filters?: BookFilters): Observable<Book[]> {
    return this.getOwnerBooks(filters).pipe(map(p => p.content));
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${API.BASE_URL}${API.BOOKS.BY_ID(id)}`);
  }

  createBook(request: BookRequest): Observable<number> {
    return this.http.post<number>(`${API.BASE_URL}${API.BOOKS.BASE}`, request);
  }

  shareBook(id: number): Observable<number> {
    return this.http.patch<number>(`${API.BASE_URL}${API.BOOKS.SHAREABLE(id)}`, {});
  }

  archiveBook(id: number): Observable<number> {
    return this.http.patch<number>(`${API.BASE_URL}${API.BOOKS.ARCHIVED(id)}`, {});
  }

  uploadCover(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${API.BASE_URL}${API.BOOKS.COVER(id)}`, formData);
  }
}

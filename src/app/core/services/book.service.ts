import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../constants/api.constants';
import { Book, BookRequest, BookFilters } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private books = signal<Book[]>([]);
  private selectedBook = signal<Book | null>(null);
  private loading = signal(false);

  readonly books$ = this.books.asReadonly();
  readonly selectedBook$ = this.selectedBook.asReadonly();
  readonly loading$ = this.loading.asReadonly();

  constructor(private http: HttpClient) {}

  getAllBooks(filters?: BookFilters): Observable<Book[]> {
    let params = new HttpParams();
    if (filters?.title) params = params.set('title', filters.title);
    if (filters?.author) params = params.set('author', filters.author);
    if (filters?.owner) params = params.set('owner', filters.owner);
    if (filters?.shareable !== undefined) params = params.set('shareable', filters.shareable);
    if (filters?.archived !== undefined) params = params.set('archived', filters.archived);

    return this.http.get<Book[]>(`${API.BASE_URL}${API.BOOKS.BASE}`, { params });
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${API.BASE_URL}${API.BOOKS.BY_ID(id)}`);
  }

  createBook(request: BookRequest): Observable<Book> {
    return this.http.post<Book>(`${API.BASE_URL}${API.BOOKS.BASE}`, request);
  }

  updateBook(id: number, request: BookRequest): Observable<Book> {
    return this.http.put<Book>(`${API.BASE_URL}${API.BOOKS.BY_ID(id)}`, request);
  }

  shareBook(id: number): Observable<Book> {
    return this.http.patch<Book>(`${API.BASE_URL}${API.BOOKS.SHARE(id)}`, {});
  }

  archiveBook(id: number): Observable<Book> {
    return this.http.patch<Book>(`${API.BASE_URL}${API.BOOKS.ARCHIVE(id)}`, {});
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${API.BASE_URL}${API.BOOKS.BY_ID(id)}`);
  }

  searchBooks(query: string): Observable<Book[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Book[]>(`${API.BASE_URL}${API.BOOKS.SEARCH}`, { params });
  }
}

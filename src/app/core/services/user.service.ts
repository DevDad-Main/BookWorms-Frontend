import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API } from '../constants/api.constants';
import { User, UserProfile } from '../models/user.model';
import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private profile = signal<UserProfile | null>(null);
  private loading = signal(false);

  readonly profile$ = this.profile.asReadonly();
  readonly loading$ = this.loading.asReadonly();

  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API.BASE_URL}${API.USERS.PROFILE}`)
      .pipe(tap(profile => this.profile.set(profile)));
  }

  getUserBooks(userId: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${API.BASE_URL}${API.USERS.BOOKS(userId)}`);
  }

  updateProfile(data: Partial<User>): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${API.BASE_URL}${API.USERS.PROFILE}`, data)
      .pipe(tap(profile => this.profile.set(profile)));
  }

  uploadAvatar(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${API.BASE_URL}/users/avatar`, formData);
  }
}

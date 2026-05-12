import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API } from '../constants/api.constants';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API.BASE_URL}${API.AUTH.LOGIN}`, request)
      .pipe(tap(response => this.handleAuthResponse(response)));
  }

  register(request: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${API.BASE_URL}${API.AUTH.REGISTER}`, request);
  }

  verifyEmail(token: string): Observable<void> {
    const params = new HttpParams().set('token', token);
    return this.http.get<void>(`${API.BASE_URL}${API.AUTH.VERIFY}`, { params });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }

  private loadStoredUser(): void {
    const token = this.getToken();
    if (token) {
      try {
        const stored = localStorage.getItem(this.USER_KEY);
        if (stored) {
          const user = JSON.parse(stored) as User;
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
        }
      } catch {
        this.logout();
      }
    }
  }
}

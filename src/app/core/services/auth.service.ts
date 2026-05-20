import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API } from '../constants/api.constants';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

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

  getEmailFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub || null;
    } catch {
      return null;
    }
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    const user = this.decodeToken(response.token);
    if (user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
    }
  }

  private decodeToken(token: string): User | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return {
        email: decoded.sub || '',
        role: decoded.authorities?.[0] || 'USER',
      };
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp as number | undefined;
      if (!exp) return false;
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }

  private loadStoredUser(): void {
    const token = this.getToken();
    if (token) {
      if (this.isTokenExpired(token)) {
        this.logout();
        return;
      }
      const user = this.decodeToken(token);
      if (user) {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } else {
        this.logout();
      }
    }
  }
}

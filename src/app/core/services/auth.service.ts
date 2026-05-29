import { Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_MIN_VALIDITY_SECONDS = 60;

  private keycloak = new Keycloak({
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId,
  });

  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);

  constructor(private router: Router) {}

  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        // onLoad: 'check-sso',
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      });
      if (authenticated) {
        this.setUserFromToken();
        console.log('User Authenticated');
      }
      return authenticated;
    } catch {
      return false;
    }
  }

  login(redirectUri?: string): void {
    this.keycloak.login({ redirectUri: redirectUri || window.location.origin + '/dashboard' });
  }

  register(): void {
    this.keycloak.register({ redirectUri: window.location.origin + '/dashboard' });
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.keycloak.logout({ redirectUri: window.location.origin + '/login' });
  }

  async getToken(): Promise<string | undefined> {
    try {
      await this.keycloak.updateToken(this.TOKEN_MIN_VALIDITY_SECONDS);
      return this.keycloak.token;
    } catch {
      this.logout();
      return undefined;
    }
  }

  getAccountManagementUrl(): string {
    return `${environment.keycloak.url}/realms/${environment.keycloak.realm}/account`;
  }

  getEmailFromToken(): string | null {
    const token = this.keycloak.token;
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.email || decoded.preferred_username || decoded.sub || null;
    } catch {
      return null;
    }
  }

  private setUserFromToken(): void {
    const tokenParsed = this.keycloak.tokenParsed;
    if (tokenParsed) {
      this.currentUser.set({
        email: (tokenParsed as any).email || (tokenParsed as any).preferred_username || '',
        role: (tokenParsed as any).realm_access?.roles?.[0] || 'USER',
      });
      this.isAuthenticated.set(true);
    }
  }
}

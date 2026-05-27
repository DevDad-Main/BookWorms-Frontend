import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ButtonComponent, IconComponent],
  template: `<div class="auth-form">
    <div class="auth-header">
      <h1>Welcome back</h1>
      <p>Sign in to your reading journey.</p>
    </div>

    <div class="form-body">
      <app-button
        label="Sign in with SSO"
        (onClick)="login()"
        size="lg"
      />

      @if (error()) {
        <div class="error-alert">
          <app-icon name="alert-circle" size="16" />
          <span>{{ error() }}</span>
        </div>
      }
    </div>

    <div class="auth-alt">
      <span class="auth-alt-text">Don't have an account?</span>
      <a routerLink="/register" class="auth-link">Create one</a>
    </div>
  </div>`,
  styles: `.auth-form { }
    .auth-header { margin-bottom: 28px; }
    .auth-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.75rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .auth-header p { font-size: 0.9rem; color: #5C5750; }
    .form-body { display: flex; flex-direction: column; gap: 20px; }
    .error-alert { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: rgba(184, 92, 92, 0.08); border: 1px solid rgba(184, 92, 92, 0.15); border-radius: 8px; color: #D47A7A; font-size: 0.85rem; }
    .auth-alt { margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.04); text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .auth-alt-text { font-size: 0.85rem; color: #5C5750; }
    .auth-link { font-size: 0.85rem; color: #C6A972; font-weight: 500; &:hover { color: #D4BC8A; } }`
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly error = signal('');

  ngOnInit(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl && this.authService.isAuthenticated()) {
      this.router.navigateByUrl(returnUrl);
    }
  }

  login(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.authService.login(window.location.origin + returnUrl);
  }
}

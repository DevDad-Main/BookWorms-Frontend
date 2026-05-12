import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, ButtonComponent, InputComponent, IconComponent],
  template: `<div class="auth-form">
    <div class="auth-header">
      <h1>Welcome back</h1>
      <p>Sign in to your reading journey.</p>
    </div>

    <form (ngSubmit)="onSubmit()" class="form-body">
      <app-input
        label="Email"
        type="email"
        placeholder="you@example.com"
        iconName="mail"
        [value]="email"
        (valueChange)="email = $event"
        [error]="getError('email')"
      />

      <app-input
        label="Password"
        type="password"
        placeholder="Enter your password"
        iconName="lock"
        [value]="password"
        (valueChange)="password = $event"
        [error]="getError('password')"
      />

      @if (getError('general')) {
        <div class="error-alert">
          <app-icon name="alert-circle" size="16" />
          <span>{{ getError('general') }}</span>
        </div>
      }

      <app-button
        type="submit"
        label="Sign In"
        [loading]="loading()"
        size="lg"
      />
    </form>

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
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  errors = signal<Record<string, string>>({});

  getError(key: string): string {
    return this.errors()[key] || '';
  }

  async onSubmit(): Promise<void> {
    this.errors.set({});
    const newErrors: Record<string, string> = {};

    if (!this.email) newErrors['email'] = 'Email is required';
    if (!this.password) newErrors['password'] = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      this.errors.set(newErrors);
      return;
    }

    this.loading.set(true);
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.loading.set(false);
        this.errors.set({ general: err.error?.error || err.error?.description || 'Invalid credentials. Please try again.' });
      }
    });
  }
}

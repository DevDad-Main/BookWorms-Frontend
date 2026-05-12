import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, ButtonComponent, InputComponent, IconComponent],
  template: `<div class="auth-form">
    <div class="auth-header">
      <h1>Join BookWorms</h1>
      <p>Create your account and start your reading journey.</p>
    </div>

    <form (ngSubmit)="onSubmit()" class="form-body">
      <div class="form-row">
        <app-input
          label="First Name"
          placeholder="John"
          [value]="firstName"
          (valueChange)="firstName = $event"
          [error]="getError('firstName')"
        />
        <app-input
          label="Last Name"
          placeholder="Doe"
          [value]="lastName"
          (valueChange)="lastName = $event"
          [error]="getError('lastName')"
        />
      </div>

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
        placeholder="Create a strong password"
        iconName="lock"
        [value]="password"
        (valueChange)="password = $event"
        [error]="getError('password')"
        [hint]="'At least 8 characters'"
      />

      <app-input
        label="Confirm Password"
        type="password"
        placeholder="Repeat your password"
        iconName="lock"
        [value]="confirmPassword"
        (valueChange)="confirmPassword = $event"
        [error]="getError('confirmPassword')"
      />

      @if (getError('general')) {
        <div class="error-alert">
          <app-icon name="alert-circle" size="16" />
          <span>{{ getError('general') }}</span>
        </div>
      }

      <app-button
        type="submit"
        label="Create Account"
        [loading]="loading()"
        size="lg"
      />
    </form>

    <div class="auth-alt">
      <span class="auth-alt-text">Already have an account?</span>
      <a routerLink="/login" class="auth-link">Sign in</a>
    </div>
  </div>`,
  styles: `.auth-form { }
    .auth-header { margin-bottom: 28px; }
    .auth-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.75rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .auth-header p { font-size: 0.9rem; color: #5C5750; }
    .form-body { display: flex; flex-direction: column; gap: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .error-alert { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: rgba(184, 92, 92, 0.08); border: 1px solid rgba(184, 92, 92, 0.15); border-radius: 8px; color: #D47A7A; font-size: 0.85rem; }
    .auth-alt { margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.04); text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .auth-alt-text { font-size: 0.85rem; color: #5C5750; }
    .auth-link { font-size: 0.85rem; color: #C6A972; font-weight: 500; &:hover { color: #D4BC8A; } }

    @media (max-width: 480px) {
      .form-row { grid-template-columns: 1fr; }
    }`
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  errors = signal<Record<string, string>>({});

  getError(key: string): string {
    return this.errors()[key] || '';
  }

  async onSubmit(): Promise<void> {
    this.errors.set({});
    const newErrors: Record<string, string> = {};

    if (!this.firstName) newErrors['firstName'] = 'Required';
    if (!this.lastName) newErrors['lastName'] = 'Required';
    if (!this.email) newErrors['email'] = 'Required';
    if (!this.password) newErrors['password'] = 'Required';
    if (this.password && this.password.length < 8) newErrors['password'] = 'Min 8 characters';
    if (this.password !== this.confirmPassword) newErrors['confirmPassword'] = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      this.errors.set(newErrors);
      return;
    }

    this.loading.set(true);
    this.authService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.router.navigate(['/verify-email'], {
          queryParams: { email: this.email }
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.errors.set({ general: err.error?.error || 'Registration failed. Please try again.' });
      }
    });
  }
}

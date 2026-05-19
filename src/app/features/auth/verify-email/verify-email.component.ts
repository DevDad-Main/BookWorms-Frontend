import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink, FormsModule, ButtonComponent, InputComponent, IconComponent],
  template: `<div class="verify-page">
    @if (status() === 'loading') {
      <div class="verify-state">
        <div class="verify-icon pending">
          <app-icon name="loader" size="32" />
        </div>
        <h2>Verifying your email...</h2>
        <p>Please wait while we confirm your account.</p>
      </div>
    }

    @if (status() === 'success') {
      <div class="verify-state">
        <div class="verify-icon success">
          <app-icon name="check-circle" size="32" />
        </div>
        <h2>Email verified!</h2>
        <p>Your account is now active. You can start exploring books.</p>
        <app-button label="Go to Login" routerLink="/login" />
      </div>
    }

    @if (status() === 'error') {
      <div class="verify-state">
        <div class="verify-icon error">
          <app-icon name="alert-circle" size="32" />
        </div>
        <h2>Verification failed</h2>
        <p>{{ errorMessage() }}</p>
        <app-button label="Try Again" variant="outline" (onClick)="retry()" />
        <app-button label="Back to Login" variant="ghost" routerLink="/login" />
      </div>
    }

    @if (status() === 'info') {
      <div class="verify-state">
        <div class="verify-icon info">
          <app-icon name="mail" size="32" />
        </div>
        <h2>Check your email</h2>
        <p>We've sent a verification code to <strong>{{ email() }}</strong></p>
        <p class="hint">Enter the code below to activate your account.</p>

        <div class="code-form">
          <app-input
            label="Verification Code"
            placeholder="Enter your 6-digit code"
            iconName="lock"
            [value]="codeInput()"
            (valueChange)="codeInput.set($event)"
            [error]="getError()"
          />
          <app-button label="Verify Account" (onClick)="submitCode()" [loading]="submitting()" size="lg" />
        </div>
      </div>
    }
  </div>`,
  styles: `.verify-page { }
    .verify-state { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 20px 0; }
    .verify-icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
    .verify-icon.pending { background: rgba(198, 169, 114, 0.1); color: #C6A972; }
    .verify-icon.success { background: rgba(91, 140, 90, 0.1); color: #7CBB7A; }
    .verify-icon.error { background: rgba(184, 92, 92, 0.1); color: #D47A7A; }
    .verify-icon.info { background: rgba(90, 140, 168, 0.1); color: #7AB8D4; }
    .verify-state h2 { font-size: 1.3rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .verify-state p { font-size: 0.9rem; color: #5C5750; margin-bottom: 24px; }
    .verify-state strong { color: #B8B2A8; }
    .hint { font-size: 0.85rem; margin-bottom: 0; }
    .code-form { width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 20px; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  readonly status = signal<'loading' | 'success' | 'error' | 'info'>('info');
  readonly errorMessage = signal('');
  readonly email = signal('');
  readonly codeInput = signal('');
  readonly submitting = signal(false);

  ngOnInit(): void {
    this.email.set(this.route.snapshot.queryParams['email'] || '');

    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      this.verify(token);
    }
  }

  getError(): string {
    return this.errorMessage();
  }

  submitCode(): void {
    const code = this.codeInput().trim();
    if (!code) {
      this.errorMessage.set('Please enter the verification code.');
      return;
    }
    this.errorMessage.set('');
    this.verify(code);
  }

  retry(): void {
    this.status.set('info');
    this.errorMessage.set('');
    this.codeInput.set('');
  }

  private verify(token: string): void {
    this.status.set('loading');
    this.authService.verifyEmail(token).subscribe({
      next: () => this.status.set('success'),
      error: (err) => {
        this.status.set('error');
        this.errorMessage.set(err.error?.error || 'The verification link is invalid or has expired.');
      }
    });
  }
}

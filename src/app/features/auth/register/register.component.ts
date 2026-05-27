import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `<div class="auth-form">
    <div class="auth-header">
      <h1>Join BookWorms</h1>
      <p>Create your account and start your reading journey.</p>
    </div>

    <div class="form-body">
      <app-button
        label="Create Account"
        (onClick)="register()"
        size="lg"
      />
    </div>

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
    .auth-alt { margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.04); text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .auth-alt-text { font-size: 0.85rem; color: #5C5750; }
    .auth-link { font-size: 0.85rem; color: #C6A972; font-weight: 500; &:hover { color: #D4BC8A; } }`
})
export class RegisterComponent {
  private authService = inject(AuthService);

  register(): void {
    this.authService.register();
  }
}

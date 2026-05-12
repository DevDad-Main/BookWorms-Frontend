import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `<div class="auth-layout">
    <div class="auth-backdrop"></div>
    <div class="auth-container">
      <div class="auth-brand">
        <div class="brand-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
          </svg>
        </div>
        <span class="brand-name">BookWorms</span>
      </div>
      <div class="auth-card">
        <router-outlet />
      </div>
      <p class="auth-footer">A social network for serious readers.</p>
    </div>
  </div>`,
  styles: `.auth-layout { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 24px; }
    .auth-backdrop { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(198, 169, 114, 0.03) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(74, 124, 140, 0.02) 0%, transparent 50%); pointer-events: none; }
    .auth-container { width: 100%; max-width: 420px; position: relative; z-index: 1; }
    .auth-brand { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 40px; }
    .brand-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(198, 169, 114, 0.1); display: flex; align-items: center; justify-content: center; color: #C6A972; }
    .brand-name { font-family: 'Playfair Display', Georgia, serif; font-size: 1.5rem; font-weight: 600; color: #F5F1E8; letter-spacing: -0.02em; }
    .auth-card { background: #181A1B; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); padding: 36px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
    .auth-footer { text-align: center; color: #5C5750; font-size: 0.85rem; margin-top: 24px; }`
})
export class AuthLayoutComponent {}

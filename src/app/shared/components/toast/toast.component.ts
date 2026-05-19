import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [IconComponent],
  template: `<div class="toast-container">
    @for (toast of toastService.toasts(); track toast.id) {
      <div class="toast" [class]="'toast-' + toast.type">
        <div class="toast-icon">
          @switch (toast.type) {
            @case ('success') { <app-icon name="check-circle" size="18" /> }
            @case ('error') { <app-icon name="alert-circle" size="18" /> }
            @case ('warning') { <app-icon name="warning" size="18" /> }
            @case ('info') { <app-icon name="info" size="18" /> }
          }
        </div>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" (click)="toastService.dismiss(toast.id)">
          <app-icon name="x" size="14" />
        </button>
      </div>
    }
  </div>`,
  styles: `.toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; max-width: 400px; pointer-events: none; }
    .toast { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-radius: 10px; background: #232527; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 8px 32px rgba(0,0,0,0.4); pointer-events: auto; animation: toastSlideIn 250ms cubic-bezier(0.4, 0, 0.2, 1); }
    .toast-success { border-color: rgba(91, 140, 90, 0.3); }
    .toast-success .toast-icon { color: #7CBB7A; }
    .toast-error { border-color: rgba(184, 92, 92, 0.3); }
    .toast-error .toast-icon { color: #D47A7A; }
    .toast-warning { border-color: rgba(198, 163, 74, 0.3); }
    .toast-warning .toast-icon { color: #D4BC6A; }
    .toast-info { border-color: rgba(90, 140, 168, 0.3); }
    .toast-info .toast-icon { color: #7AB8D4; }
    .toast-icon { flex-shrink: 0; display: flex; align-items: center; }
    .toast-message { flex: 1; font-size: 0.85rem; color: #B8B2A8; line-height: 1.4; }
    .toast-close { flex-shrink: 0; background: none; border: none; color: #5C5750; cursor: pointer; padding: 4px; border-radius: 4px; display: flex; align-items: center; transition: color 200ms; }
    .toast-close:hover { color: #8A847C; }
    @keyframes toastSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}

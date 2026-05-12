import { Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [IconComponent],
  template: `@if (isOpen()) {
    <div class="modal-backdrop" (click)="onClose.emit()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">{{ title() }}</h3>
          <button class="close-btn" (click)="onClose.emit()">
            <app-icon name="x" size="18" />
          </button>
        </div>
        <div class="modal-body">
          <ng-content />
        </div>
      </div>
    </div>
  }`,
  styles: `.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px; animation: fadeIn 200ms ease; backdrop-filter: blur(4px); }
    .modal-content { background: #232527; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); max-width: 520px; width: 100%; max-height: 85vh; overflow-y: auto; animation: scaleIn 250ms cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 24px 64px rgba(0,0,0,0.5); }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.04); }
    .modal-title { font-size: 1.1rem; font-weight: 600; color: #F5F1E8; margin: 0; }
    .close-btn { background: none; border: none; color: #5C5750; cursor: pointer; padding: 6px; border-radius: 6px; display: flex; transition: all 200ms ease; &:hover { background: rgba(255,255,255,0.06); color: #B8B2A8; } }
    .modal-body { padding: 24px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`
})
export class ModalComponent {
  readonly isOpen = input(false);
  readonly title = input<string>('');
  readonly onClose = output<void>();
}

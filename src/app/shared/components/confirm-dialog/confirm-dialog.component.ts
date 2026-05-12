import { Component, input, output } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ModalComponent, ButtonComponent],
  template: `<app-modal [isOpen]="isOpen()" [title]="title()" (onClose)="onCancel.emit()">
    <p class="confirm-message">{{ message() }}</p>
    <div class="confirm-actions">
      <app-button variant="ghost" label="Cancel" (onClick)="onCancel.emit()" />
      <app-button [variant]="confirmVariant()" [label]="confirmLabel()" (onClick)="onConfirm.emit()" />
    </div>
  </app-modal>`,
  styles: `.confirm-message { font-size: 0.9rem; color: #8A847C; line-height: 1.6; margin-bottom: 24px; }
    .confirm-actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; }`
})
export class ConfirmDialogComponent {
  readonly isOpen = input(false);
  readonly title = input<string>('Confirm');
  readonly message = input<string>('Are you sure?');
  readonly confirmLabel = input<string>('Confirm');
  readonly confirmVariant = input<'primary' | 'danger'>('primary');
  readonly onConfirm = output<void>();
  readonly onCancel = output<void>();
}

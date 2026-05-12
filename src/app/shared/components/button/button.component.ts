import { Component, input, output } from '@angular/core';
import { IconComponent, IconName } from '../icon/icon.component';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [IconComponent],
  template: `<button
    [type]="type()"
    [disabled]="disabled() || loading()"
    [class]="buttonClass"
    (click)="onClick.emit()"
  >
    @if (loading()) {
      <app-icon name="loader" size="16" class="spin" />
    }
    @if (icon() && !loading()) {
      <app-icon [name]="icon()!" [size]="iconSize" />
    }
    @if (label()) {
      <span>{{ label() }}</span>
    }
    <ng-content />
  </button>`,
  styles: `button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    line-height: 1;
    position: relative;
    overflow: hidden;
    text-decoration: none;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .btn-primary {
    background: #C6A972;
    color: #111315;
    &:hover:not(:disabled) { background: #D4BC8A; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(198, 169, 114, 0.3); }
    &:active:not(:disabled) { transform: translateY(0); }
  }

  .btn-secondary {
    background: #2A2C2E;
    color: #F5F1E8;
    border: 1px solid rgba(255,255,255,0.06);
    &:hover:not(:disabled) { background: #2F3133; border-color: rgba(255,255,255,0.1); }
  }

  .btn-ghost {
    background: transparent;
    color: #B8B2A8;
    &:hover:not(:disabled) { background: rgba(255,255,255,0.04); color: #F5F1E8; }
  }

  .btn-outline {
    background: transparent;
    color: #C6A972;
    border: 1px solid rgba(198, 169, 114, 0.3);
    &:hover:not(:disabled) { background: rgba(198, 169, 114, 0.08); border-color: #C6A972; }
  }

  .btn-danger {
    background: #B85C5C;
    color: #fff;
    &:hover:not(:disabled) { background: #C96C6C; transform: translateY(-1px); }
  }

  .btn-sm { padding: 6px 14px; font-size: 0.8rem; border-radius: 6px; }
  .btn-md { padding: 10px 20px; font-size: 0.9rem; border-radius: 8px; }
  .btn-lg { padding: 14px 28px; font-size: 1rem; border-radius: 10px; }`
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly label = input<string>('');
  readonly icon = input<IconName | null>(null);
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly onClick = output<void>();

  get iconSize(): number {
    const sizes = { sm: 14, md: 16, lg: 18 };
    return sizes[this.size()];
  }

  get buttonClass(): string {
    return `btn-${this.variant()} btn-${this.size()}`;
  }
}

import { Component, input, output, forwardRef, model } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [IconComponent, FormsModule],
  template: `<div class="input-wrapper" [class.has-error]="!!error()" [class.has-icon]="!!iconName()">
    @if (label()) {
      <label class="input-label">{{ label() }}@if (required()) { <span class="required">*</span> }</label>
    }
    <div class="input-container">
      @if (iconName()) {
        <app-icon [name]="iconName()!" size="16" class="input-icon" />
      }
      <input
        [type]="showPassword() ? 'text' : type()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [required]="required()"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onBlur.emit()"
        class="input-field"
        autocomplete="off"
      />
      @if (type() === 'password') {
        <button type="button" class="toggle-password" (click)="togglePassword()" tabindex="-1">
          <app-icon [name]="showPassword() ? 'eye-off' : 'eye'" size="16" />
        </button>
      }
    </div>
    @if (error()) {
      <span class="error-text">{{ error() }}</span>
    }
    @if (hint() && !error()) {
      <span class="hint-text">{{ hint() }}</span>
    }
  </div>`,
  styles: `.input-wrapper { margin-bottom: 0; }
    .input-label { display: block; font-size: 0.85rem; font-weight: 500; color: #B8B2A8; margin-bottom: 6px; }
    .required { color: #B85C5C; }
    .input-container { position: relative; display: flex; align-items: center; }
    .input-icon { position: absolute; left: 14px; color: #5C5750; pointer-events: none; transition: color 250ms ease; }
    .input-field {
      width: 100%; padding: 12px 16px; background: #232527; border: 1px solid rgba(255,255,255,0.06);
      border-radius: 8px; color: #F5F1E8; font-size: 0.9rem; transition: all 250ms ease; outline: none;
      &::placeholder { color: #5C5750; }
      &:focus { border-color: rgba(198, 169, 114, 0.4); box-shadow: 0 0 0 3px rgba(198, 169, 114, 0.08); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
    .has-icon .input-field { padding-left: 40px; }
    .has-icon .input-field:focus ~ .input-icon, .has-icon .input-field.filled ~ .input-icon { color: #C6A972; }
    .toggle-password { position: absolute; right: 12px; background: none; border: none; color: #5C5750; cursor: pointer; padding: 4px; display: flex; &:hover { color: #B8B2A8; } }
    .error-text { display: block; font-size: 0.78rem; color: #B85C5C; margin-top: 4px; }
    .hint-text { display: block; font-size: 0.78rem; color: #5C5750; margin-top: 4px; }
    .has-error .input-field { border-color: rgba(184, 92, 92, 0.4); &:focus { box-shadow: 0 0 0 3px rgba(184, 92, 92, 0.1); } }
  `
})
export class InputComponent {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<'text' | 'email' | 'password' | 'number'>('text');
  readonly iconName = input<IconName | null>(null);
  readonly error = input<string>('');
  readonly hint = input<string>('');
  readonly required = input(false);
  readonly disabled = input(false);
  readonly value = model<string>('');
  readonly showPassword = model(false);
  readonly onBlur = output<void>();

  onInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    this.value.set(el.value);
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }
}

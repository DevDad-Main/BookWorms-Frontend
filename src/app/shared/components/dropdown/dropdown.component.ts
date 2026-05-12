import { Component, input, output, signal, HostListener } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export interface DropdownItem {
  label: string;
  icon?: import('../icon/icon.component').IconName;
  value: string;
  danger?: boolean;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [IconComponent],
  template: `<div class="dropdown">
    <button class="trigger" (click)="toggle()">
      <ng-content select="[trigger]" />
    </button>
    @if (isOpen()) {
      <div class="menu">
        @for (item of items(); track item.value) {
          <button class="menu-item" [class.danger]="item.danger" (click)="select(item)">
            @if (item.icon) {
              <app-icon [name]="item.icon" size="16" />
            }
            <span>{{ item.label }}</span>
          </button>
        }
      </div>
    }
  </div>`,
  styles: `.dropdown { position: relative; display: inline-block; }
    .trigger { background: none; border: none; cursor: pointer; padding: 0; display: flex; color: inherit; }
    .menu { position: absolute; right: 0; top: calc(100% + 8px); min-width: 180px; background: #232527; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 6px; box-shadow: 0 12px 40px rgba(0,0,0,0.5); z-index: 100; animation: scaleIn 150ms ease; transform-origin: top right; }
    .menu-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; background: none; border: none; color: #B8B2A8; font-size: 0.85rem; cursor: pointer; border-radius: 6px; transition: all 150ms ease; text-align: left;
      &:hover { background: rgba(255,255,255,0.04); color: #F5F1E8; }
      &.danger { color: #B85C5C; &:hover { background: rgba(184, 92, 92, 0.08); } }
    }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(-4px); } to { opacity: 1; transform: scale(1) translateY(0); } }`
})
export class DropdownComponent {
  readonly items = input.required<DropdownItem[]>();
  readonly onSelect = output<DropdownItem>();
  readonly isOpen = signal(false);

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  select(item: DropdownItem): void {
    this.onSelect.emit(item);
    this.isOpen.set(false);
  }

  @HostListener('document:click')
  close(): void {
    this.isOpen.set(false);
  }
}

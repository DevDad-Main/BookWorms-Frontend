import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `<div class="avatar" [class]="size()" [style.width.px]="dimension" [style.height.px]="dimension">
    @if (src()) {
      <img [src]="src()" [alt]="alt()" class="avatar-img" />
    } @else {
      <span class="avatar-initials" [style.fontSize.px]="fontSize">{{ initials }}</span>
    }
  </div>`,
  styles: `.avatar { display: flex; align-items: center; justify-content: center; border-radius: 50%; overflow: hidden; background: rgba(198, 169, 114, 0.15); flex-shrink: 0; }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-initials { font-weight: 600; color: #C6A972; }
    .sm { width: 32px; height: 32px; }
    .md { width: 40px; height: 40px; }
    .lg { width: 56px; height: 56px; }
    .xl { width: 80px; height: 80px; }`
})
export class AvatarComponent {
  readonly src = input<string>('');
  readonly alt = input<string>('Avatar');
  readonly name = input<string>('');
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  get dimension(): number {
    const sizes = { sm: 32, md: 40, lg: 56, xl: 80 };
    return sizes[this.size()];
  }

  get fontSize(): number {
    const sizes = { sm: 12, md: 14, lg: 20, xl: 28 };
    return sizes[this.size()];
  }

  get initials(): string {
    if (!this.name()) return '?';
    const parts = this.name().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }
}

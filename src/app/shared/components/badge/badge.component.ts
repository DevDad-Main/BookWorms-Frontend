import { Component, input } from '@angular/core';

export type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span class="badge" [class]="'badge-' + variant()">
    <ng-content />
  </span>`,
  styles: `.badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 500; line-height: 1; white-space: nowrap; }
    .badge-default { background: rgba(255,255,255,0.04); color: #8A847C; }
    .badge-accent { background: rgba(198, 169, 114, 0.12); color: #C6A972; }
    .badge-success { background: rgba(91, 140, 90, 0.12); color: #7CBB7A; }
    .badge-warning { background: rgba(198, 163, 74, 0.12); color: #D4BC6A; }
    .badge-danger { background: rgba(184, 92, 92, 0.12); color: #D47A7A; }
    .badge-info { background: rgba(90, 140, 168, 0.12); color: #7AB8D4; }`
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('default');
}

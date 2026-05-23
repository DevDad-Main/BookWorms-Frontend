import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `<a
    [routerLink]="route()"
    routerLinkActive="active"
    [routerLinkActiveOptions]="{ exact: exact() }"
    class="nav-item"
  >
    <app-icon [name]="icon()" size="20" />
    <span class="nav-label">{{ label() }}</span>
    @if (badge()) {
      <span class="nav-badge">{{ badge() }}</span>
    }
  </a>`,
  styles: `.nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 8px; color: #8A847C; font-size: 0.9rem; font-weight: 500; transition: all 200ms ease; cursor: pointer; text-decoration: none; position: relative; }
    .nav-item:hover { background: rgba(255,255,255,0.04); color: #F5F1E8; }
    .nav-item.active { background: rgba(198, 169, 114, 0.1); color: #C6A972; }
    .nav-label { flex: 1; }
    .nav-badge { background: rgba(198, 169, 114, 0.15); color: #C6A972; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 600; }
    :host-context(.sidebar.collapsed) .nav-label { display: none; }
    :host-context(.sidebar.collapsed) .nav-badge { display: none; }
    :host-context(.sidebar.collapsed) .nav-item { justify-content: center; padding: 10px 0; }`
})
export class NavItemComponent {
  readonly route = input.required<string>();
  readonly icon = input.required<IconName>();
  readonly label = input.required<string>();
  readonly badge = input<string | number>('');
  readonly exact = input(false);
}

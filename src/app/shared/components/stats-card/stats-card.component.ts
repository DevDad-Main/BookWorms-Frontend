import { Component, input } from '@angular/core';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [IconComponent],
  template: `<div class="stats-card animate-fade-in-up">
    <div class="stats-icon">
      <app-icon [name]="icon()" size="20" />
    </div>
    <div class="stats-info">
      <span class="stats-value">{{ value() }}</span>
      <span class="stats-label">{{ label() }}</span>
    </div>
  </div>`,
  styles: `.stats-card { background: #232527; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04); padding: 20px; display: flex; align-items: center; gap: 16px; transition: all 250ms ease; }
    .stats-card:hover { background: #2A2C2E; border-color: rgba(255,255,255,0.08); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
    .stats-icon { width: 44px; height: 44px; border-radius: 10px; background: rgba(198, 169, 114, 0.1); display: flex; align-items: center; justify-content: center; color: #C6A972; flex-shrink: 0; }
    .stats-info { display: flex; flex-direction: column; }
    .stats-value { font-size: 1.5rem; font-weight: 700; color: #F5F1E8; line-height: 1.2; letter-spacing: -0.02em; }
    .stats-label { font-size: 0.8rem; color: #5C5750; }
  `
})
export class StatsCardComponent {
  readonly icon = input.required<IconName>();
  readonly value = input.required<string | number>();
  readonly label = input.required<string>();
}

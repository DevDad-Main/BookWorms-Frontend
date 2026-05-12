import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `<div class="app-card" [class.hoverable]="hoverable()" [class.padded]="padded()" [class.clickable]="clickable()">
    @if (title()) {
      <div class="card-header">
        <h3 class="card-title">{{ title() }}</h3>
        @if (subtitle()) {
          <span class="card-subtitle">{{ subtitle() }}</span>
        }
      </div>
    }
    <div class="card-body">
      <ng-content />
    </div>
  </div>`,
  styles: `.app-card { background: #232527; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04); transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1); }
    .card-header { padding: 20px 20px 0; }
    .card-title { font-size: 1rem; font-weight: 600; color: #F5F1E8; margin: 0 0 4px; }
    .card-subtitle { font-size: 0.85rem; color: #5C5750; }
    .padded .card-body { padding: 20px; }
    .hoverable:hover { background: #2A2C2E; border-color: rgba(255,255,255,0.08); box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
    .clickable { cursor: pointer; }
    .clickable:hover { background: #2A2C2E; border-color: rgba(255,255,255,0.08); box-shadow: 0 4px 16px rgba(0,0,0,0.3); transform: translateY(-2px); }`
})
export class CardComponent {
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly hoverable = input(false);
  readonly padded = input(true);
  readonly clickable = input(false);
}

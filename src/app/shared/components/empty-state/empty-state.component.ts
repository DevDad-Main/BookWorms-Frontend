import { Component, input, output } from '@angular/core';
import { IconComponent, IconName } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IconComponent, ButtonComponent],
  template: `<div class="empty-state">
    <div class="empty-icon">
      <app-icon [name]="icon()" size="32" />
    </div>
    <h3 class="empty-title">{{ title() }}</h3>
    <p class="empty-description">{{ description() }}</p>
    @if (actionLabel()) {
      <app-button [label]="actionLabel()!" [icon]="actionIcon()" (onClick)="action.emit()" variant="outline" size="md" />
    }
  </div>`,
  styles: `.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 24px; text-align: center; }
    .empty-icon { width: 72px; height: 72px; border-radius: 50%; background: rgba(198, 169, 114, 0.08); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #C6A972; }
    .empty-title { font-size: 1.2rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .empty-description { font-size: 0.9rem; color: #5C5750; max-width: 360px; margin-bottom: 20px; line-height: 1.6; }`
})
export class EmptyStateComponent {
  readonly icon = input<IconName>('books');
  readonly title = input<string>('Nothing here yet');
  readonly description = input<string>('');
  readonly actionLabel = input<string>('');
  readonly actionIcon = input<IconName>('plus');
  readonly action = output<void>();
}

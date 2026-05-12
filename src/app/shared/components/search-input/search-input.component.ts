import { Component, model, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [IconComponent, FormsModule],
  template: `<div class="search-wrapper">
    <app-icon name="search" size="16" class="search-icon" />
    <input
      type="text"
      [ngModel]="query()"
      (ngModelChange)="query.set($event); onSearch.emit($event)"
      placeholder="Search books, authors..."
      class="search-field"
    />
    @if (query()) {
      <button class="clear-btn" (click)="query.set(''); onSearch.emit('')">
        <app-icon name="x" size="14" />
      </button>
    }
  </div>`,
  styles: `.search-wrapper { position: relative; width: 100%; max-width: 400px; }
    .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #5C5750; pointer-events: none; }
    .search-field { width: 100%; padding: 10px 14px 10px 40px; background: #232527; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; color: #F5F1E8; font-size: 0.9rem; outline: none; transition: all 250ms ease;
      &::placeholder { color: #5C5750; }
      &:focus { border-color: rgba(198, 169, 114, 0.3); box-shadow: 0 0 0 3px rgba(198, 169, 114, 0.06); }
    }
    .clear-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #5C5750; cursor: pointer; padding: 4px; display: flex; border-radius: 4px;
      &:hover { background: rgba(255,255,255,0.06); color: #B8B2A8; }
    }`
})
export class SearchInputComponent {
  readonly query = model<string>('');
  readonly onSearch = output<string>();
}

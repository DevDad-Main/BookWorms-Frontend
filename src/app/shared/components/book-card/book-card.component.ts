import { Component, input, output } from '@angular/core';
import { Book } from '../../../core/models/book.model';
import { IconComponent } from '../icon/icon.component';
import { BadgeComponent } from '../badge/badge.component';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [IconComponent, BadgeComponent, AvatarComponent],
  template: `<div class="book-card" (click)="onClick.emit()">
    <div class="book-cover">
      @if (book().cover) {
        <img [src]="book().cover" [alt]="book().title" class="cover-img" />
      } @else {
        <div class="cover-placeholder">
          <app-icon name="book" size="32" />
        </div>
      }
      <div class="cover-overlay">
        <div class="overlay-content">
          <app-icon name="eye" size="18" />
          <span>View Details</span>
        </div>
      </div>
    </div>
    <div class="book-info">
      <h4 class="book-title">{{ book().title }}</h4>
      <p class="book-author">{{ book().authorName }}</p>
      <div class="book-meta">
        <div class="book-owner">
          <app-avatar size="sm" [name]="book().owner" />
          <span class="owner-name">{{ book().owner }}</span>
        </div>
        <app-badge [variant]="book().shareable ? 'success' : 'default'">
          {{ book().shareable ? 'Available' : 'Personal' }}
        </app-badge>
      </div>
    </div>
  </div>`,
  styles: `.book-card { background: #232527; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04); overflow: hidden; cursor: pointer; transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1); }
    .book-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.08); }
    .book-card:hover .cover-overlay { opacity: 1; }
    .book-cover { position: relative; aspect-ratio: 3/4; background: #181A1B; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .cover-img { width: 100%; height: 100%; object-fit: cover; }
    .cover-placeholder { color: #3A3C3E; display: flex; align-items: center; justify-content: center; }
    .cover-overlay { position: absolute; inset: 0; background: rgba(17, 19, 21, 0.7); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 300ms ease; backdrop-filter: blur(2px); }
    .overlay-content { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #F5F1E8; font-size: 0.85rem; font-weight: 500; }
    .book-info { padding: 16px; }
    .book-title { font-size: 0.95rem; font-weight: 600; color: #F5F1E8; margin: 0 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .book-author { font-size: 0.85rem; color: #5C5750; margin: 0 0 12px; }
    .book-meta { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .book-owner { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .owner-name { font-size: 0.78rem; color: #8A847C; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`
})
export class BookCardComponent {
  readonly book = input.required<Book>();
  readonly onClick = output<void>();
}

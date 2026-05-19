import { Component, inject, OnInit, signal } from '@angular/core';
import { BorrowingService } from '../../../core/services/borrowing.service';
import { BorrowedBook } from '../../../core/models/borrowing.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-borrowed-books',
  standalone: true,
  imports: [ButtonComponent, BadgeComponent, SkeletonComponent, EmptyStateComponent],
  template: `<div class="page-enter">
    <div class="page-header">
      <h1>Books I've Borrowed</h1>
      <p>Books you've borrowed from other readers.</p>
    </div>

    @if (loading()) {
      <div style="display: flex; flex-direction: column; gap: 12px;">
        @for (i of [1,2,3]; track i) {
          <div class="content-card" style="display: flex; align-items: center; gap: 16px; padding: 20px;">
            <app-skeleton width="48px" height="64px" radius="6px" />
            <div style="flex: 1;">
              <app-skeleton width="60%" height="16px" />
              <app-skeleton width="40%" height="12px" />
            </div>
          </div>
        }
      </div>
    } @else if (borrowedBooks().length === 0) {
      <app-empty-state
        icon="book-open"
        title="No borrowed books"
        description="When you borrow books from other readers, they'll appear here."
        actionLabel="Browse Books"
        actionIcon="books"
        (action)="navigateBrowse()"
      />
    } @else {
      <div class="borrowed-list">
        @for (item of borrowedBooks(); track item.id) {
          <div class="borrowed-card">
            <div class="borrowed-info">
              <h4>{{ item.title }}</h4>
              <p>{{ item.authorName }}</p>
            </div>
            <div class="borrowed-status">
              <app-badge [variant]="item.returned ? 'warning' : 'success'">
                {{ item.returned ? 'Return Requested' : 'Currently Borrowed' }}
              </app-badge>
            </div>
            <div class="borrowed-action">
              @if (!item.returned) {
                <app-button label="Request Return" size="sm" variant="outline" (onClick)="requestReturn(item.id)" [loading]="returningId() === item.id" />
              }
            </div>
          </div>
        }
      </div>
    }
  </div>`,
  styles: `.page-header { margin-bottom: 32px; }
    .page-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .page-header p { font-size: 1rem; color: #5C5750; }
    .borrowed-list { display: flex; flex-direction: column; gap: 12px; }
    .borrowed-card { display: flex; align-items: center; gap: 16px; padding: 20px; background: #232527; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04); transition: all 200ms ease; flex-wrap: wrap; }
    .borrowed-card:hover { background: #2A2C2E; }
    .borrowed-info { flex: 1; min-width: 200px; }
    .borrowed-info h4 { font-size: 0.9rem; font-weight: 600; color: #F5F1E8; margin: 0 0 2px; }
    .borrowed-info p { font-size: 0.8rem; color: #5C5750; margin: 0; }
    .borrowed-status { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .borrowed-action { flex-shrink: 0; }`
})
export class BorrowedBooksComponent implements OnInit {
  private borrowingService = inject(BorrowingService);
  readonly borrowedBooks = signal<BorrowedBook[]>([]);
  readonly loading = signal(true);
  readonly returningId = signal<number | null>(null);

  ngOnInit(): void {
    this.borrowingService.getBorrowedBooksAsList().subscribe(b => {
      this.borrowedBooks.set(b);
      this.loading.set(false);
    });
  }

  requestReturn(bookId: number): void {
    this.returningId.set(bookId);
    this.borrowingService.requestReturn(bookId).subscribe(() => {
      this.borrowedBooks.update(list =>
        list.map(b => b.id === bookId ? { ...b, returned: true } : b)
      );
      this.returningId.set(null);
    });
  }

  navigateBrowse(): void {
  }
}

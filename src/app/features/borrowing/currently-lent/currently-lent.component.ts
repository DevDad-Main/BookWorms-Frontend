import { Component, inject, OnInit, signal } from '@angular/core';
import { BorrowingService } from '../../../core/services/borrowing.service';
import { BorrowedBook } from '../../../core/models/borrowing.model';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-currently-lent',
  standalone: true,
  imports: [BadgeComponent, SkeletonComponent, EmptyStateComponent],
  template: `<div class="page-enter">
    <div class="page-header">
      <h1>Currently Lent</h1>
      <p>Books you own that are currently being borrowed by other readers.</p>
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
    } @else if (lentBooks().length === 0) {
      <app-empty-state
        icon="book-open"
        title="No books currently lent out"
        description="When another reader borrows one of your books, it will appear here."
      />
    } @else {
      <div class="lent-list">
        @for (item of lentBooks(); track item.id) {
          <div class="lent-card">
            <div class="lent-info">
              <h4>{{ item.title }}</h4>
              <p>{{ item.authorName }}</p>
            </div>
            <div class="lent-status">
              <app-badge variant="warning">Currently Lent</app-badge>
            </div>
          </div>
        }
      </div>
    }
  </div>`,
  styles: `.page-header { margin-bottom: 32px; }
    .page-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .page-header p { font-size: 1rem; color: #5C5750; }
    .lent-list { display: flex; flex-direction: column; gap: 12px; }
    .lent-card { display: flex; align-items: center; gap: 16px; padding: 20px; background: #232527; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04); transition: all 200ms ease; flex-wrap: wrap; }
    .lent-card:hover { background: #2A2C2E; }
    .lent-info { flex: 1; min-width: 200px; }
    .lent-info h4 { font-size: 0.9rem; font-weight: 600; color: #F5F1E8; margin: 0 0 2px; }
    .lent-info p { font-size: 0.8rem; color: #5C5750; margin: 0; }
    .lent-status { flex-shrink: 0; }`
})
export class CurrentlyLentComponent implements OnInit {
  private borrowingService = inject(BorrowingService);
  readonly lentBooks = signal<BorrowedBook[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loading.set(true);
    this.borrowingService.getReturnedBooksAsList().subscribe({
      next: (b) => {
        this.lentBooks.set(b.filter(item => !item.returned && !item.returnApproved));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}

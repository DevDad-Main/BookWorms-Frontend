import { Component, inject, OnInit, signal } from '@angular/core';
import { BorrowingService } from '../../../core/services/borrowing.service';
import { BorrowedBook } from '../../../core/models/borrowing.model';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-borrow-requests',
  standalone: true,
  imports: [SkeletonComponent, EmptyStateComponent],
  template: `<div class="page-enter">
    <div class="page-header">
      <h1>Borrow Requests</h1>
      <p>Books awaiting return confirmation.</p>
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
    } @else if (requests().length === 0) {
      <app-empty-state
        icon="swap"
        title="No pending requests"
        description="When someone requests to borrow one of your books or returns a book, it will appear here."
      />
    } @else {
      <div class="requests-list">
        @for (req of requests(); track req.id) {
          <div class="request-card">
            <div class="request-info">
              <h4>{{ req.title }}</h4>
              <p>by {{ req.authorName }}</p>
            </div>
          </div>
        }
      </div>
    }
  </div>`,
  styles: `.page-header { margin-bottom: 32px; }
    .page-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .page-header p { font-size: 1rem; color: #5C5750; }
    .requests-list { display: flex; flex-direction: column; gap: 12px; }
    .request-card { display: flex; align-items: center; gap: 16px; padding: 20px; background: #232527; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04); transition: all 200ms ease; flex-wrap: wrap; }
    .request-card:hover { background: #2A2C2E; }
    .request-info { flex: 1; min-width: 200px; }
    .request-info h4 { font-size: 0.9rem; font-weight: 600; color: #F5F1E8; margin: 0 0 2px; }
    .request-info p { font-size: 0.8rem; color: #5C5750; margin: 0; }`
})
export class BorrowRequestsComponent implements OnInit {
  private borrowingService = inject(BorrowingService);
  readonly requests = signal<BorrowedBook[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loading.set(true);
    this.borrowingService.getReturnedBooksAsList().subscribe({
      next: (r) => {
        this.requests.set(r.filter(b => b.returned && !b.returnApproved));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BorrowingService } from '../../../core/services/borrowing.service';
import { BorrowedBook, BorrowStatus } from '../../../core/models/borrowing.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-borrowed-books',
  standalone: true,
  imports: [DatePipe, ButtonComponent, StatusBadgeComponent, IconComponent, SkeletonComponent, EmptyStateComponent, AvatarComponent],
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
            <app-skeleton width="100px" height="28px" radius="8px" />
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
            <div class="borrowed-cover">
              @if (item.bookCover) {
                <img [src]="item.bookCover" [alt]="item.bookTitle" />
              } @else {
                <app-icon name="book" size="20" />
              }
            </div>
            <div class="borrowed-info">
              <h4>{{ item.bookTitle }}</h4>
              <p>{{ item.bookAuthor }}</p>
              <div class="borrowed-owner">
                <app-avatar [name]="item.ownerName" size="sm" />
                <span>{{ item.ownerName }}</span>
              </div>
            </div>
            <div class="borrowed-status">
              <app-status-badge [status]="item.status" />
              <span class="borrowed-date">Since {{ item.approvedAt || item.requestedAt | date: 'mediumDate' }}</span>
            </div>
            <div class="borrowed-action">
              @if (item.status === BorrowStatus.APPROVED) {
                <app-button label="Request Return" size="sm" variant="outline" (onClick)="requestReturn(item.bookId)" />
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
    .borrowed-cover { width: 48px; height: 64px; border-radius: 6px; background: #181A1B; display: flex; align-items: center; justify-content: center; color: #3A3C3E; flex-shrink: 0; overflow: hidden; }
    .borrowed-cover img { width: 100%; height: 100%; object-fit: cover; }
    .borrowed-info { flex: 1; min-width: 200px; }
    .borrowed-info h4 { font-size: 0.9rem; font-weight: 600; color: #F5F1E8; margin: 0 0 2px; }
    .borrowed-info p { font-size: 0.8rem; color: #5C5750; margin: 0 0 6px; }
    .borrowed-owner { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #8A847C; }
    .borrowed-status { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .borrowed-date { font-size: 0.75rem; color: #5C5750; }
    .borrowed-action { flex-shrink: 0; }`
})
export class BorrowedBooksComponent implements OnInit {
  private borrowingService = inject(BorrowingService);
  readonly BorrowStatus = BorrowStatus;
  readonly borrowedBooks = signal<BorrowedBook[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.borrowingService.getBorrowedBooks().subscribe(b => {
      this.borrowedBooks.set(b);
      this.loading.set(false);
    });
  }

  requestReturn(bookId: number): void {
    this.borrowingService.requestReturn(bookId).subscribe(updated => {
      this.borrowedBooks.update(list =>
        list.map(b => b.bookId === bookId ? { ...b, status: BorrowStatus.RETURN_REQUESTED } : b)
      );
    });
  }

  navigateBrowse(): void {
    // Router navigation handled in the component
  }
}

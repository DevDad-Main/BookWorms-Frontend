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
  selector: 'app-borrow-requests',
  standalone: true,
  imports: [DatePipe, ButtonComponent, StatusBadgeComponent, IconComponent, SkeletonComponent, EmptyStateComponent, AvatarComponent],
  template: `<div class="page-enter">
    <div class="page-header">
      <h1>Borrow Requests</h1>
      <p>Manage requests from readers who want to borrow your books.</p>
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
            <app-skeleton width="100px" height="32px" radius="8px" />
          </div>
        }
      </div>
    } @else if (requests().length === 0) {
      <app-empty-state
        icon="swap"
        title="No pending requests"
        description="When someone requests to borrow one of your books, it will appear here."
      />
    } @else {
      <div class="requests-list">
        @for (req of requests(); track req.id) {
          <div class="request-card" [class.status-return-requested]="req.status === BorrowStatus.RETURN_REQUESTED">
            <div class="request-cover">
              @if (req.bookCover) {
                <img [src]="req.bookCover" [alt]="req.bookTitle" />
              } @else {
                <app-icon name="book" size="20" />
              }
            </div>
            <div class="request-info">
              <h4>{{ req.bookTitle }}</h4>
              <p>by {{ req.bookAuthor }}</p>
              <div class="requestor">
                <app-avatar [name]="req.borrowerName" size="sm" />
                <span>{{ req.borrowerName }}</span>
              </div>
            </div>
            <div class="request-status">
              <app-status-badge [status]="req.status" />
              <span class="request-date">{{ req.requestedAt | date: 'mediumDate' }}</span>
            </div>
            <div class="request-actions">
              @if (req.status === BorrowStatus.PENDING) {
                <app-button label="Approve" size="sm" (onClick)="approve(req.id)" [loading]="processingId() === req.id" />
                <app-button label="Reject" size="sm" variant="ghost" (onClick)="reject(req.id)" />
              }
              @if (req.status === BorrowStatus.RETURN_REQUESTED) {
                <app-button label="Approve Return" size="sm" variant="outline" (onClick)="approveReturn(req.id)" [loading]="processingId() === req.id" />
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
    .requests-list { display: flex; flex-direction: column; gap: 12px; }
    .request-card { display: flex; align-items: center; gap: 16px; padding: 20px; background: #232527; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04); transition: all 200ms ease; flex-wrap: wrap; }
    .request-card:hover { background: #2A2C2E; }
    .request-card.status-return-requested { border-color: rgba(198, 169, 114, 0.15); }
    .request-cover { width: 48px; height: 64px; border-radius: 6px; background: #181A1B; display: flex; align-items: center; justify-content: center; color: #3A3C3E; flex-shrink: 0; overflow: hidden; }
    .request-cover img { width: 100%; height: 100%; object-fit: cover; }
    .request-info { flex: 1; min-width: 200px; }
    .request-info h4 { font-size: 0.9rem; font-weight: 600; color: #F5F1E8; margin: 0 0 2px; }
    .request-info p { font-size: 0.8rem; color: #5C5750; margin: 0 0 6px; }
    .requestor { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #8A847C; }
    .request-status { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .request-date { font-size: 0.75rem; color: #5C5750; }
    .request-actions { display: flex; gap: 8px; flex-shrink: 0; }`
})
export class BorrowRequestsComponent implements OnInit {
  private borrowingService = inject(BorrowingService);
  readonly BorrowStatus = BorrowStatus;
  readonly requests = signal<BorrowedBook[]>([]);
  readonly loading = signal(true);
  readonly processingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loading.set(true);
    this.borrowingService.getPendingRequests().subscribe(r => {
      this.requests.set(r);
      this.loading.set(false);
    });
  }

  approve(id: number): void {
    this.processingId.set(id);
    this.borrowingService.approveRequest(id).subscribe(() => {
      this.requests.update(r => r.filter(x => x.id !== id));
      this.processingId.set(null);
    });
  }

  reject(id: number): void {
    this.processingId.set(id);
    this.borrowingService.rejectRequest(id).subscribe(() => {
      this.requests.update(r => r.filter(x => x.id !== id));
      this.processingId.set(null);
    });
  }

  approveReturn(id: number): void {
    this.processingId.set(id);
    this.borrowingService.approveReturn(id).subscribe(() => {
      this.requests.update(r => r.filter(x => x.id !== id));
      this.processingId.set(null);
    });
  }
}

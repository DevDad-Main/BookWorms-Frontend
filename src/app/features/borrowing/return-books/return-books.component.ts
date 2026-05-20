import { Component, inject, OnInit, signal } from '@angular/core';
import { BorrowingService } from '../../../core/services/borrowing.service';
import { BorrowedBook } from '../../../core/models/borrowing.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-return-books',
  standalone: true,
  imports: [ButtonComponent, BadgeComponent, IconComponent, SkeletonComponent, EmptyStateComponent],
  template: `<div class="page-enter">
    <div class="page-header">
      <h1>Returns</h1>
      <p>Track books that are being returned or need confirmation.</p>
    </div>

    @if (loading()) {
      <div style="display: flex; flex-direction: column; gap: 12px;">
        @for (i of [1,2,3]; track i) {
          <div class="content-card" style="padding: 24px;">
            <app-skeleton width="80%" height="16px" />
            <app-skeleton width="50%" height="12px" />
          </div>
        }
      </div>
    } @else {
      @if (items().length === 0) {
        <app-empty-state
          icon="refresh"
          title="No return activity"
          description="Books that need to be returned or confirmed will show up here."
        />
      } @else {
        <div class="return-tabs">
          <button class="tab-btn" [class.active]="activeTab() === 'pending'" (click)="activeTab.set('pending')">Pending Returns</button>
          <button class="tab-btn" [class.active]="activeTab() === 'returned'" (click)="activeTab.set('returned')">Completed</button>
        </div>

        <div class="return-list">
          @for (item of filteredItems(); track item.id) {
            <div class="return-card">
              <div class="return-icon">
                <app-icon [name]="item.returned && !item.returnApproved ? 'refresh' : 'check'" size="20" />
              </div>
              <div class="return-info">
                <h4>{{ item.title }}</h4>
                <p>{{ item.authorName }}</p>
              </div>
              <div class="return-status">
                <app-badge [variant]="item.returnApproved ? 'info' : 'warning'">
                  {{ item.returnApproved ? 'Returned' : 'Return Requested' }}
                </app-badge>
              </div>
              <div class="return-actions">
                @if (item.returned && !item.returnApproved) {
                  <app-button label="Confirm Return" size="sm" variant="outline" (onClick)="confirmReturn(item.id)" [loading]="confirmingId() === item.id" />
                }
              </div>
            </div>
          }
        </div>
      }
    }
  </div>`,
  styles: `.page-header { margin-bottom: 32px; }
    .page-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .page-header p { font-size: 1rem; color: #5C5750; }
    .return-tabs { display: flex; gap: 4px; margin-bottom: 24px; padding: 4px; background: #232527; border-radius: 10px; width: fit-content; }
    .tab-btn { padding: 8px 20px; background: none; border: none; color: #8A847C; font-size: 0.85rem; font-weight: 500; cursor: pointer; border-radius: 6px; transition: all 200ms ease; }
    .tab-btn.active { background: #2A2C2E; color: #F5F1E8; }
    .tab-btn:hover:not(.active) { color: #B8B2A8; }
    .return-list { display: flex; flex-direction: column; gap: 12px; }
    .return-card { display: flex; align-items: center; gap: 16px; padding: 20px; background: #232527; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04); transition: all 200ms ease; flex-wrap: wrap; }
    .return-card:hover { background: #2A2C2E; }
    .return-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(198, 169, 114, 0.1); display: flex; align-items: center; justify-content: center; color: #C6A972; flex-shrink: 0; }
    .return-info { flex: 1; min-width: 200px; }
    .return-info h4 { font-size: 0.9rem; font-weight: 600; color: #F5F1E8; margin: 0 0 2px; }
    .return-info p { font-size: 0.8rem; color: #5C5750; margin: 0; }
    .return-status { flex-shrink: 0; }
    .return-actions { flex-shrink: 0; }`
})
export class ReturnBooksComponent implements OnInit {
  private borrowingService = inject(BorrowingService);
  readonly items = signal<BorrowedBook[]>([]);
  readonly loading = signal(true);
  readonly activeTab = signal<'pending' | 'returned'>('pending');
  readonly confirmingId = signal<number | null>(null);
  readonly filteredItems = signal<BorrowedBook[]>([]);

  ngOnInit(): void {
    this.borrowingService.getReturnedBooksAsList().subscribe({
      next: (b) => {
        this.items.set(b);
        this.filterItems();
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  filterItems(): void {
    if (this.activeTab() === 'pending') {
      this.filteredItems.set(this.items().filter(b => b.returned && !b.returnApproved));
    } else {
      this.filteredItems.set(this.items().filter(b => b.returnApproved));
    }
  }

  confirmReturn(bookId: number): void {
    this.confirmingId.set(bookId);
    this.borrowingService.approveReturn(bookId).subscribe({
      next: () => {
        this.items.update(list =>
          list.map(b => b.id === bookId ? { ...b, returnApproved: true } : b)
        );
        this.filterItems();
        this.confirmingId.set(null);
      },
      error: () => this.confirmingId.set(null)
    });
  }
}

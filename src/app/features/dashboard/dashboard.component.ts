import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BookService } from '../../core/services/book.service';
import { BorrowingService } from '../../core/services/borrowing.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Book } from '../../core/models/book.model';
import { BorrowedBook, BorrowingStats } from '../../core/models/borrowing.model';
import { UserProfile } from '../../core/models/user.model';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, StatsCardComponent, BookCardComponent, IconComponent, SkeletonComponent, StatusBadgeComponent],
  template: `<div class="page-enter">
    <div class="page-header">
      <div>
        <h1>Welcome back, {{ userName() }}</h1>
        <p>Here's what's happening in your library.</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      @if (loading()) {
        @for (i of [1,2,3,4]; track i) {
          <div class="content-card" style="padding: 20px; display: flex; align-items: center; gap: 16px;">
            <app-skeleton width="44px" height="44px" radius="10px" />
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <app-skeleton width="60px" height="24px" />
              <app-skeleton width="100px" height="14px" />
            </div>
          </div>
        }
      } @else {
        <app-stats-card icon="books" [value]="userProfile()?.totalBooks ?? 0" label="Total Books" />
        <app-stats-card icon="bookmark" [value]="userProfile()?.sharedBooks ?? 0" label="Shared Books" />
        <app-stats-card icon="book-open" [value]="borrowingStats()?.totalBorrowed ?? 0" label="Borrowed" />
        <app-stats-card icon="swap" [value]="borrowingStats()?.activeBorrows ?? 0" label="Active Borrows" />
      }
    </div>

    <!-- Recent Books & Activity -->
    <div class="dashboard-grid">
      <!-- Recently Added -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2>Recently Added</h2>
          <a routerLink="/books" class="section-link">View all</a>
        </div>
        @if (loading()) {
          <div class="grid-3" style="margin-top: 12px;">
            @for (i of [1,2,3]; track i) {
              <div class="content-card" style="padding: 0; overflow: hidden;">
                <app-skeleton height="200px" radius="0" />
                <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
                  <app-skeleton width="80%" height="16px" />
                  <app-skeleton width="60%" height="12px" />
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid-3" style="margin-top: 12px;">
            @for (book of recentBooks(); track book.id) {
              <app-book-card [book]="book" (onClick)="navigateToBook(book.id)" />
            } @empty {
              <div class="empty-mini">
                <app-icon name="book" size="24" />
                <p>No books added yet</p>
              </div>
            }
          </div>
        }
      </section>

      <!-- Recent Activity -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2>Recent Activity</h2>
        </div>
        @if (loading()) {
          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px;">
            @for (i of [1,2,3,4]; track i) {
              <div class="content-card" style="display: flex; align-items: center; gap: 12px; padding: 16px;">
                <app-skeleton width="36px" height="36px" radius="50%" />
                <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
                  <app-skeleton width="70%" height="14px" />
                  <app-skeleton width="40%" height="12px" />
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="activity-list">
            @for (item of recentActivity(); track item.id) {
              <div class="activity-item">
                <div class="activity-icon">
                  <app-icon [name]="item.status === 'PENDING' ? 'clock' : item.status === 'RETURNED' ? 'check' : 'swap'" size="16" />
                </div>
                <div class="activity-info">
                  <p class="activity-text">
                    <strong>{{ item.borrowerName }}</strong>
                    {{ item.status === 'PENDING' ? 'requested' : item.status === 'RETURNED' ? 'returned' : 'borrowed' }}
                    <strong>{{ item.bookTitle }}</strong>
                  </p>
                  <span class="activity-time">{{ item.requestedAt | date: 'mediumDate' }}</span>
                </div>
                <app-status-badge [status]="item.status" />
              </div>
            } @empty {
              <div class="empty-mini">
                <app-icon name="activity" size="24" />
                <p>No activity yet</p>
              </div>
            }
          </div>
        }
      </section>
    </div>

    <!-- Trending Books -->
    <section class="dashboard-section" style="margin-top: 32px;">
      <div class="section-header">
        <h2>Trending in the Community</h2>
        <a routerLink="/books" class="section-link">Explore all</a>
      </div>
      @if (loading()) {
        <div class="grid-4" style="margin-top: 12px;">
          @for (i of [1,2,3,4]; track i) {
            <div class="content-card" style="padding: 0; overflow: hidden;">
              <app-skeleton height="180px" radius="0" />
              <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
                <app-skeleton width="80%" height="14px" />
                <app-skeleton width="50%" height="12px" />
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="grid-4" style="margin-top: 12px;">
          @for (book of trendingBooks(); track book.id) {
            <app-book-card [book]="book" (onClick)="navigateToBook(book.id)" />
          } @empty {
            <div class="empty-mini">
              <app-icon name="trending" size="24" />
              <p>No trending books yet</p>
            </div>
          }
        </div>
      }
    </section>
  </div>`,
  styles: `.page-header { margin-bottom: 32px; }
    .page-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .page-header p { font-size: 1rem; color: #5C5750; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .dashboard-section { }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
    .section-header h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; font-weight: 600; color: #F5F1E8; }
    .section-link { font-size: 0.85rem; color: #C6A972; font-weight: 500; &:hover { color: #D4BC8A; } }
    .activity-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
    .activity-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: #232527; border-radius: 10px; border: 1px solid rgba(255,255,255,0.04); transition: all 200ms ease; }
    .activity-item:hover { background: #2A2C2E; }
    .activity-icon { width: 36px; height: 36px; border-radius: 50%; background: rgba(198, 169, 114, 0.1); display: flex; align-items: center; justify-content: center; color: #C6A972; flex-shrink: 0; }
    .activity-info { flex: 1; min-width: 0; }
    .activity-text { font-size: 0.85rem; color: #8A847C; margin: 0; }
    .activity-text strong { color: #B8B2A8; font-weight: 500; }
    .activity-time { font-size: 0.75rem; color: #5C5750; }
    .empty-mini { grid-column: 1 / -1; padding: 40px; display: flex; flex-direction: column; align-items: center; gap: 8px; color: #5C5750; font-size: 0.9rem; text-align: center; }

    @media (max-width: 992px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .dashboard-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 576px) {
      .stats-grid { grid-template-columns: 1fr; }
    }`
})
export class DashboardComponent implements OnInit {
  private bookService = inject(BookService);
  private borrowingService = inject(BorrowingService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  readonly loading = signal(true);
  readonly recentBooks = signal<Book[]>([]);
  readonly trendingBooks = signal<Book[]>([]);
  readonly recentActivity = signal<BorrowedBook[]>([]);
  readonly userProfile = signal<UserProfile | null>(null);
  readonly borrowingStats = signal<BorrowingStats | null>(null);

  userName = signal('Reader');

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userName.set(user.firstName);
    }

    this.userService.getProfile().subscribe(profile => {
      this.userProfile.set(profile);
      this.checkLoading();
    });

    this.bookService.getAllBooks({ shareable: true }).subscribe(books => {
      this.recentBooks.set(books.slice(0, 6));
      this.trendingBooks.set(books.slice(0, 4));
    });

    this.borrowingService.getBorrowedBooks().subscribe(borrowed => {
      this.recentActivity.set(borrowed.slice(0, 5));
    });

    this.borrowingService.getStats().subscribe(stats => {
      this.borrowingStats.set(stats);
      this.checkLoading();
    });
  }

  private checkLoading(): void {
    if (this.userProfile() && this.borrowingStats()) {
      this.loading.set(false);
    }
  }

  navigateToBook(id: number): void {
    // Navigation handled by router
  }
}

import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookService } from '../../core/services/book.service';
import { BorrowingService } from '../../core/services/borrowing.service';
import { AuthService } from '../../core/services/auth.service';
import { SeedService, SeedProgress } from '../../core/services/seed.service';
import { Book } from '../../core/models/book.model';
import { BorrowedBook } from '../../core/models/borrowing.model';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, StatsCardComponent, BookCardComponent, ButtonComponent, IconComponent, SkeletonComponent],
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
        <app-stats-card icon="books" [value]="totalBooks()" label="Total Books" />
        <app-stats-card icon="bookmark" [value]="sharedBooks()" label="Shared Books" />
        <app-stats-card icon="book-open" [value]="borrowedCount()" label="Borrowed" />
        <app-stats-card icon="swap" [value]="activeBorrows()" label="Active Borrows" />
      }
    </div>

    <!-- Seed Data -->
    <div class="seed-card">
      <div class="seed-header">
        <div>
          <h3>Developer Tools</h3>
          <p>Seed 24 classic books to your library.</p>
        </div>
        @if (!seedProgress()?.done) {
          <app-button label="Seed Books" icon="plus" variant="outline" size="sm" [loading]="seeding()" (onClick)="startSeed()" />
        }
      </div>
      @if (seedProgress(); as p) {
        <div class="seed-progress">
          <div class="seed-bar-bg">
            <div class="seed-bar-fill" [style.width.%]="(p.current / p.total) * 100"></div>
          </div>
          <span class="seed-label">{{ p.current }}/{{ p.total }} @if (!p.done && p.title) { &mdash; {{ p.title }} } @if (p.done) { &mdash; Done }</span>
        </div>
        @if (p.error) {
          <div class="seed-error">{{ p.error }}</div>
        }
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
                  <app-icon name="swap" size="16" />
                </div>
                <div class="activity-info">
                  <p class="activity-text">
                    <strong>{{ item.title }}</strong>
                    <span>by {{ item.authorName }}</span>
                  </p>
                  <span class="activity-time">{{ item.returnApproved ? 'Returned' : item.returned ? 'Return requested' : 'Currently borrowed' }}</span>
                </div>
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
    .activity-text span { color: #5C5750; }
    .activity-time { font-size: 0.75rem; color: #5C5750; }
    .empty-mini { grid-column: 1 / -1; padding: 40px; display: flex; flex-direction: column; align-items: center; gap: 8px; color: #5C5750; font-size: 0.9rem; text-align: center; }

    .seed-card { padding: 20px; background: #1E2022; border: 1px solid rgba(198, 169, 114, 0.12); border-radius: 12px; margin-bottom: 32px; }
    .seed-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .seed-header h3 { font-size: 0.9rem; font-weight: 600; color: #C6A972; margin: 0 0 2px; }
    .seed-header p { font-size: 0.8rem; color: #5C5750; margin: 0; }
    .seed-progress { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
    .seed-bar-bg { flex: 1; height: 6px; background: #2A2C2E; border-radius: 3px; overflow: hidden; }
    .seed-bar-fill { height: 100%; background: #C6A972; border-radius: 3px; transition: width 300ms ease; }
    .seed-label { font-size: 0.8rem; color: #8A847C; white-space: nowrap; }
    .seed-error { margin-top: 8px; font-size: 0.8rem; color: #B85C5C; }

    @media (max-width: 992px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .dashboard-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 576px) {
      .stats-grid { grid-template-columns: 1fr; }
    }`
})
export class DashboardComponent implements OnInit, OnDestroy {
  private bookService = inject(BookService);
  private borrowingService = inject(BorrowingService);
  private authService = inject(AuthService);
  private seedService = inject(SeedService);

  readonly loading = signal(true);
  readonly seeding = signal(false);
  readonly seedProgress = signal<SeedProgress | null>(null);
  private seedSub?: Subscription;
  readonly recentBooks = signal<Book[]>([]);
  readonly trendingBooks = signal<Book[]>([]);
  readonly recentActivity = signal<BorrowedBook[]>([]);
  readonly totalBooks = signal(0);
  readonly sharedBooks = signal(0);
  readonly borrowedCount = signal(0);
  readonly activeBorrows = signal(0);

  userName = signal('Reader');

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userName.set(user.email.split('@')[0] || 'Reader');
    }

    this.bookService.getAllBooksAsList({ size: 20 }).subscribe(books => {
      this.recentBooks.set(books.slice(0, 6));
      this.trendingBooks.set(books.slice(0, 4));
      this.checkLoading();
    });

    this.bookService.getOwnerBooksAsList({ size: 50 }).subscribe(books => {
      this.totalBooks.set(books.length);
      this.sharedBooks.set(books.filter(b => b.shareable).length);
    });

    this.borrowingService.getBorrowedBooksAsList().subscribe(borrowed => {
      this.borrowedCount.set(borrowed.length);
      this.activeBorrows.set(borrowed.filter(b => !b.returned).length);
      this.recentActivity.set(borrowed.slice(0, 5));
      this.checkLoading();
    });
  }

  private checkLoading(): void {
    if (this.recentBooks().length > 0 || this.recentActivity().length > 0) {
      this.loading.set(false);
    }
  }

  startSeed(): void {
    this.seeding.set(true);
    this.seedProgress.set({ current: 0, total: 24, title: '', done: false });
    this.seedSub = this.seedService.seedBooks().subscribe({
      next: (p) => this.seedProgress.set(p),
      error: () => this.seeding.set(false),
      complete: () => {
        this.seeding.set(false);
        this.loadBooks();
      }
    });
  }

  private loadBooks(): void {
    this.bookService.getAllBooksAsList({ size: 20 }).subscribe(books => {
      this.recentBooks.set(books.slice(0, 6));
      this.trendingBooks.set(books.slice(0, 4));
    });
    this.bookService.getOwnerBooksAsList({ size: 50 }).subscribe(books => {
      this.totalBooks.set(books.length);
      this.sharedBooks.set(books.filter(b => b.shareable).length);
    });
  }

  ngOnDestroy(): void {
    this.seedSub?.unsubscribe();
  }

  navigateToBook(id: number): void {
  }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { Book } from '../../core/models/book.model';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AvatarComponent, StatsCardComponent, BookCardComponent, IconComponent, SkeletonComponent],
  template: `<div class="page-enter">
    @if (loading()) {
      <div class="profile-skeleton">
        <div class="profile-header-skeleton">
          <app-skeleton width="96px" height="96px" radius="50%" />
          <div style="flex: 1;">
            <app-skeleton width="200px" height="28px" />
            <app-skeleton width="150px" height="16px" />
          </div>
        </div>
        <div class="stats-grid">
          @for (i of [1,2,3,4]; track i) {
            <app-skeleton height="80px" radius="12px" />
          }
        </div>
      </div>
    } @else {
      <div class="profile-header">
        <div class="profile-main">
          <app-avatar [name]="userName()" size="xl" />
          <div class="profile-info">
            <h1>{{ userName() }}</h1>
            <span class="profile-email">{{ userEmail() }}</span>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <app-stats-card icon="books" [value]="totalBooks()" label="Total Books" />
        <app-stats-card icon="bookmark" [value]="sharedBooks()" label="Shared" />
        <app-stats-card icon="book-open" [value]="borrowedBooks()" label="Borrowed" />
        <app-stats-card icon="swap" [value]="lentBooks()" label="Lent Out" />
      </div>

      <div class="profile-section">
        <div class="section-header">
          <h2>My Books</h2>
        </div>
        @if (userBooks().length === 0) {
          <div class="empty-mini">
            <app-icon name="book" size="24" />
            <p>No books in your library yet</p>
          </div>
        } @else {
          <div class="grid-4">
            @for (book of userBooks(); track book.id) {
              <app-book-card [book]="book" />
            }
          </div>
        }
      </div>
    }
  </div>`,
  styles: `.profile-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; gap: 24px; flex-wrap: wrap; }
    .profile-main { display: flex; align-items: flex-start; gap: 24px; }
    .profile-info h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 600; color: #F5F1E8; margin-bottom: 4px; }
    .profile-email { display: block; font-size: 0.9rem; color: #5C5750; margin-bottom: 8px; }
    .profile-actions { flex-shrink: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .profile-section { }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
    .section-header h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; font-weight: 600; color: #F5F1E8; }
    .empty-mini { padding: 48px; display: flex; flex-direction: column; align-items: center; gap: 8px; color: #5C5750; font-size: 0.9rem; text-align: center; }
    .profile-header-skeleton { display: flex; gap: 24px; margin-bottom: 32px; }
    .profile-skeleton .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

    @media (max-width: 992px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 576px) {
      .profile-main { flex-direction: column; align-items: center; text-align: center; }
      .stats-grid { grid-template-columns: 1fr; }
    }`
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  readonly userBooks = signal<Book[]>([]);
  readonly loading = signal(true);
  readonly totalBooks = signal(0);
  readonly sharedBooks = signal(0);
  readonly borrowedBooks = signal(0);
  readonly lentBooks = signal(0);

  userName = signal('');
  userEmail = signal('');

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userName.set(user.email.split('@')[0] || 'User');
      this.userEmail.set(user.email);
    }

    this.userService.getUserBooks().subscribe(books => {
      this.userBooks.set(books);
      this.totalBooks.set(books.length);
      this.sharedBooks.set(books.filter(b => b.shareable).length);
      this.loading.set(false);
    });
  }
}

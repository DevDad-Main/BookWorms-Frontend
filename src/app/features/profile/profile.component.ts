import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../core/models/user.model';
import { Book } from '../../core/models/book.model';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe, AvatarComponent, StatsCardComponent, BookCardComponent, IconComponent, ButtonComponent, SkeletonComponent],
  template: `<div class="page-enter">
    @if (loading()) {
      <div class="profile-skeleton">
        <div class="profile-header-skeleton">
          <app-skeleton width="96px" height="96px" radius="50%" />
          <div style="flex: 1;">
            <app-skeleton width="200px" height="28px" />
            <app-skeleton width="150px" height="16px" />
            <app-skeleton width="300px" height="14px" />
          </div>
        </div>
        <div class="stats-grid">
          @for (i of [1,2,3,4]; track i) {
            <app-skeleton height="80px" radius="12px" />
          }
        </div>
      </div>
    } @else if (profile(); as p) {
      <div class="profile-header">
        <div class="profile-main">
          <app-avatar [name]="p.firstName + ' ' + p.lastName" size="xl" />
          <div class="profile-info">
            <h1>{{ p.firstName }} {{ p.lastName }}</h1>
            <span class="profile-email">{{ p.email }}</span>
            @if (p.bio) {
              <p class="profile-bio">{{ p.bio }}</p>
            }
            <span class="profile-member">Member since {{ p.memberSince | date: 'yyyy' }}</span>
          </div>
        </div>
        <div class="profile-actions">
          <app-button label="Edit Profile" icon="edit" variant="secondary" size="sm" />
        </div>
      </div>

      <div class="stats-grid">
        <app-stats-card icon="books" [value]="p.totalBooks" label="Total Books" />
        <app-stats-card icon="bookmark" [value]="p.sharedBooks" label="Shared" />
        <app-stats-card icon="book-open" [value]="p.borrowedBooks" label="Borrowed" />
        <app-stats-card icon="swap" [value]="p.lentBooks" label="Lent Out" />
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
    .profile-bio { font-size: 0.9rem; color: #8A847C; line-height: 1.6; margin-bottom: 8px; max-width: 480px; }
    .profile-member { font-size: 0.8rem; color: #5C5750; }
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

  readonly profile = signal<UserProfile | null>(null);
  readonly userBooks = signal<Book[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.userService.getProfile().subscribe(p => {
      this.profile.set(p);
      this.loading.set(false);
    });

    this.userService.getUserBooks(user.id).subscribe(books => {
      this.userBooks.set(books);
    });
  }
}

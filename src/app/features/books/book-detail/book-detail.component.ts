import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BookService } from '../../../core/services/book.service';
import { BorrowingService } from '../../../core/services/borrowing.service';
import { AuthService } from '../../../core/services/auth.service';
import { Book } from '../../../core/models/book.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, ButtonComponent, BadgeComponent, IconComponent, SkeletonComponent, AvatarComponent],
  template: `<div class="page-enter">
    @if (loading()) {
      <div class="detail-skeleton">
        <div style="display: flex; gap: 32px;">
          <app-skeleton width="320px" height="440px" radius="12px" />
          <div style="flex: 1; display: flex; flex-direction: column; gap: 16px;">
            <app-skeleton width="60%" height="32px" />
            <app-skeleton width="40%" height="18px" />
            <app-skeleton width="100%" height="120px" />
          </div>
        </div>
      </div>
    } @else if (book(); as b) {
      <a routerLink="/books" class="back-link">
        <app-icon name="arrow-left" size="16" />
        <span>Back to books</span>
      </a>

      <div class="book-detail">
        <div class="book-cover-section">
          <div class="detail-cover">
            @if (b.cover) {
              <img [src]="b.cover" [alt]="b.title" />
            } @else {
              <div class="cover-placeholder-lg">
                <app-icon name="book" size="48" />
              </div>
            }
          </div>

          <div class="cover-actions">
            @if (b.shareable && !isOwner) {
              <app-button label="Request to Borrow" icon="swap" size="lg" (onClick)="requestBorrow(b.id)" [loading]="borrowing()" />
            }
            @if (isOwner) {
              <app-button label="Edit Book" icon="edit" variant="secondary" size="md" (onClick)="editBook(b.id)" />
              <app-button
                [label]="b.shareable ? 'Unshare' : 'Share'"
                [icon]="b.shareable ? 'x' : 'share'"
                variant="outline"
                size="sm"
                (onClick)="toggleShare(b.id)"
              />
              <app-button
                [label]="b.archived ? 'Unarchive' : 'Archive'"
                [icon]="'archive'"
                variant="ghost"
                size="sm"
                (onClick)="toggleArchive(b.id)"
              />
            }
          </div>
        </div>

        <div class="book-info-section">
          <div class="book-header">
            <h1>{{ b.title }}</h1>
            <div class="book-meta-detail">
              <span class="meta-item">by <strong>{{ b.authorName }}</strong></span>
              @if (b.isbn) {
                <span class="meta-divider">|</span>
                <span class="meta-item">ISBN {{ b.isbn }}</span>
              }
            </div>
            <div class="book-badges">
              <app-badge [variant]="b.shareable ? 'success' : 'default'">
                {{ b.shareable ? 'Available for borrowing' : 'Personal copy' }}
              </app-badge>
              @if (b.archived) {
                <app-badge variant="warning">Archived</app-badge>
              }
            </div>
          </div>

          @if (b.synopsis) {
            <div class="book-synopsis">
              <h3>Synopsis</h3>
              <p>{{ b.synopsis }}</p>
            </div>
          }

          <div class="book-owner-section">
            <h3>Owner</h3>
            <div class="owner-profile">
              <app-avatar [name]="b.ownerName" size="lg" />
              <div>
                <span class="owner-name-lg">{{ b.ownerName }}</span>
                <span class="owner-label">Book owner</span>
              </div>
            </div>
          </div>

          <div class="book-meta-footer">
            <div class="meta-stat">
              <app-icon name="calendar" size="16" />
              <span>Added {{ b.createdAt | date: 'mediumDate' }}</span>
            </div>
          </div>
        </div>
      </div>
    }
  </div>`,
  styles: `.back-link { display: inline-flex; align-items: center; gap: 6px; color: #8A847C; font-size: 0.85rem; margin-bottom: 24px; transition: color 200ms ease; &:hover { color: #C6A972; } }
    .book-detail { display: grid; grid-template-columns: 320px 1fr; gap: 40px; }
    .detail-cover { aspect-ratio: 3/4; background: #181A1B; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.04); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
    .detail-cover img { width: 100%; height: 100%; object-fit: cover; }
    .cover-placeholder-lg { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #3A3C3E; }
    .cover-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
    .book-header { margin-bottom: 24px; }
    .book-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; line-height: 1.15; }
    .book-meta-detail { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
    .meta-item { font-size: 0.9rem; color: #8A847C; }
    .meta-item strong { color: #B8B2A8; font-weight: 500; }
    .meta-divider { color: #3A3C3E; }
    .book-badges { display: flex; gap: 8px; flex-wrap: wrap; }
    .book-synopsis { margin-bottom: 24px; }
    .book-synopsis h3 { font-size: 1rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .book-synopsis p { font-size: 0.9rem; color: #8A847C; line-height: 1.7; }
    .book-owner-section { margin-bottom: 24px; }
    .book-owner-section h3 { font-size: 1rem; font-weight: 600; color: #F5F1E8; margin-bottom: 12px; }
    .owner-profile { display: flex; align-items: center; gap: 12px; }
    .owner-name-lg { display: block; font-size: 0.95rem; font-weight: 500; color: #F5F1E8; }
    .owner-label { font-size: 0.8rem; color: #5C5750; }
    .book-meta-footer { display: flex; gap: 16px; flex-wrap: wrap; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.04); }
    .meta-stat { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #5C5750; }

    @media (max-width: 768px) {
      .book-detail { grid-template-columns: 1fr; gap: 24px; }
      .detail-cover { max-width: 240px; }
      .book-header h1 { font-size: 1.5rem; }
    }`
})
export class BookDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(BookService);
  private borrowingService = inject(BorrowingService);
  private authService = inject(AuthService);

  readonly book = signal<Book | null>(null);
  readonly loading = signal(true);
  readonly borrowing = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.bookService.getBookById(id).subscribe(b => {
        this.book.set(b);
        this.loading.set(false);
      });
    }
  }

  get isOwner(): boolean {
    const user = this.authService.currentUser();
    return user !== null && this.book()?.ownerId === user.id;
  }

  requestBorrow(bookId: number): void {
    this.borrowing.set(true);
    this.borrowingService.requestBorrow(bookId).subscribe({
      next: () => {
        this.borrowing.set(false);
        this.router.navigate(['/borrowing/borrowed']);
      },
      error: () => this.borrowing.set(false)
    });
  }

  editBook(id: number): void {
    this.router.navigate(['/books', id, 'edit']);
  }

  toggleShare(id: number): void {
    this.bookService.shareBook(id).subscribe(b => this.book.set(b));
  }

  toggleArchive(id: number): void {
    this.bookService.archiveBook(id).subscribe(b => this.book.set(b));
  }
}

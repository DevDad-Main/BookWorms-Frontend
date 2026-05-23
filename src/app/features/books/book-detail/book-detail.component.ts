import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { BorrowingService } from '../../../core/services/borrowing.service';
import { FeedbackService } from '../../../core/services/feedback.service';
import { Book } from '../../../core/models/book.model';
import { FeedbackResponse } from '../../../core/models/borrowing.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [RouterLink, ButtonComponent, BadgeComponent, IconComponent, SkeletonComponent, AvatarComponent, EmptyStateComponent],
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
              <img [src]="safeCover(b)" [alt]="b.title" />
            } @else {
              <div class="cover-placeholder-lg">
                <app-icon name="book" size="48" />
              </div>
            }
          </div>

          <div class="cover-actions">
            @if (b.shareable && !isOwner()) {
              <app-button [label]="borrowed() ? 'Currently Being Borrowed' : 'Request to Borrow'" [icon]="borrowed() ? 'book' : 'swap'" size="lg" (onClick)="requestBorrow(b.id)" [loading]="borrowing()" [disabled]="borrowed()" [variant]="borrowed() ? 'secondary' : 'primary'" />
            }
            @if (isOwner()) {
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
              <app-avatar [name]="b.owner" size="lg" />
              <div>
                <span class="owner-name-lg">{{ b.owner }}</span>
                <span class="owner-label">Book owner</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="reviews-section">
        <div class="reviews-header">
          <h2>Reviews</h2>
          @if (feedbacks().length > 0) {
            <div class="avg-rating">
              @for (s of [1,2,3,4,5]; track s) {
                <app-icon name="star" size="16" [class.filled]="s <= Math.round(averageRating())" />
              }
              <span class="avg-text">{{ averageRating().toFixed(1) }} ({{ feedbacks().length }})</span>
            </div>
          }
        </div>

        @if (loadingFeedbacks()) {
          <div class="reviews-skeleton">
            @for (i of [1,2]; track i) {
              <app-skeleton width="60%" height="14px" />
              <app-skeleton width="80%" height="12px" />
            }
          </div>
        } @else if (feedbacks().length === 0) {
          <app-empty-state icon="star" title="No reviews yet" description="Be the first to share your thoughts about this book." />
        } @else {
          <div class="reviews-list">
            @for (fb of feedbacks(); track fb) {
              <div class="review-card" [class.own-review]="fb.ownFeedback">
                <div class="review-stars">
                  @for (s of [1,2,3,4,5]; track s) {
                    <app-icon name="star" size="14" [class.filled]="s <= fb.note" />
                  }
                  @if (fb.ownFeedback) {
                    <app-badge variant="info">Your review</app-badge>
                  }
                </div>
                @if (fb.comment) {
                  <p class="review-comment">{{ fb.comment }}</p>
                }
              </div>
            }
          </div>
        }
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

    .reviews-section { margin-top: 48px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.04); }
    .reviews-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .reviews-header h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; font-weight: 600; color: #F5F1E8; margin: 0; }
    .avg-rating { display: flex; align-items: center; gap: 4px; }
    .avg-rating .filled { color: #D4BC6A; fill: #D4BC6A; }
    .avg-text { font-size: 0.85rem; color: #8A847C; margin-left: 6px; }
    .reviews-skeleton { display: flex; flex-direction: column; gap: 12px; }
    .reviews-list { display: flex; flex-direction: column; gap: 12px; }
    .review-card { padding: 16px; background: #232527; border-radius: 10px; border: 1px solid rgba(255,255,255,0.04); }
    .review-card.own-review { border-color: rgba(198, 169, 114, 0.15); background: rgba(198, 169, 114, 0.04); }
    .review-stars { display: flex; align-items: center; gap: 2px; margin-bottom: 8px; }
    .review-stars .filled { color: #D4BC6A; fill: #D4BC6A; }
    .review-comment { font-size: 0.85rem; color: #8A847C; line-height: 1.5; margin: 0; }

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
  private feedbackService = inject(FeedbackService);
  private sanitizer = inject(DomSanitizer);
  readonly Math = Math;

  readonly book = signal<Book | null>(null);
  readonly ownerBookIds = signal<Set<number>>(new Set());
  readonly loading = signal(true);
  readonly borrowing = signal(false);
  readonly borrowed = signal(false);
  readonly isOwner = computed(() => {
    const b = this.book();
    return b !== null && this.ownerBookIds().has(b.id);
  });
  readonly feedbacks = signal<FeedbackResponse[]>([]);
  readonly loadingFeedbacks = signal(true);
  readonly averageRating = computed(() => {
    const fbs = this.feedbacks();
    if (fbs.length === 0) return 0;
    return fbs.reduce((sum, fb) => sum + fb.note, 0) / fbs.length;
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.bookService.getBookById(id).subscribe({
        next: (b) => {
          this.book.set(b);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
      this.bookService.getOwnerBooksAsList({ size: 100 }).subscribe({
        next: (books) => this.ownerBookIds.set(new Set(books.map(b => b.id))),
        error: () => {}
      });
      this.borrowingService.getBorrowedBooksAsList().subscribe({
        next: (borrowed) => this.borrowed.set(borrowed.some(b => b.id === id && !b.returned)),
        error: () => {}
      });
      this.loadFeedbacks(id);
    }
  }

  private loadFeedbacks(bookId: number): void {
    this.loadingFeedbacks.set(true);
    this.feedbackService.getFeedbacks(bookId).subscribe({
      next: (fbs) => {
        this.feedbacks.set(fbs);
        this.loadingFeedbacks.set(false);
      },
      error: () => this.loadingFeedbacks.set(false)
    });
  }

  requestBorrow(bookId: number): void {
    this.borrowing.set(true);
    this.borrowingService.requestBorrow(bookId).subscribe({
      next: () => {
        this.borrowing.set(false);
        this.router.navigate(['/borrowing/borrowed']);
      },
      error: () => {
        this.borrowing.set(false);
        this.borrowed.set(true);
      }
    });
  }

  toggleShare(id: number): void {
    this.bookService.shareBook(id).subscribe({
      next: () => this.bookService.getBookById(id).subscribe({
        next: (b) => this.book.set(b),
        error: () => {}
      }),
      error: () => {}
    });
  }

  toggleArchive(id: number): void {
    this.bookService.archiveBook(id).subscribe({
      next: () => this.bookService.getBookById(id).subscribe({
        next: (b) => this.book.set(b),
        error: () => {}
      }),
      error: () => {}
    });
  }

  safeCover(b: Book): import('@angular/platform-browser').SafeResourceUrl | null {
    if (!b.cover) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(b.cover);
  }
}

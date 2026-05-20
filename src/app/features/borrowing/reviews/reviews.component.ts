import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BorrowingService } from '../../../core/services/borrowing.service';
import { FeedbackService } from '../../../core/services/feedback.service';
import { BorrowedBook, FeedbackResponse } from '../../../core/models/borrowing.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

interface ReviewState {
  book: BorrowedBook;
  existing?: FeedbackResponse;
  rating: number;
  comment: string;
  submitting: boolean;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [FormsModule, ButtonComponent, BadgeComponent, IconComponent, SkeletonComponent, EmptyStateComponent],
  template: `<div class="page-enter">
    <div class="page-header">
      <h1>Reviews</h1>
      <p>Leave a review for books you've borrowed and returned.</p>
    </div>

    @if (loading()) {
      <div style="display: flex; flex-direction: column; gap: 12px;">
        @for (i of [1,2,3]; track i) {
          <div class="content-card" style="padding: 20px;">
            <app-skeleton width="60%" height="16px" />
            <app-skeleton width="40%" height="12px" />
            <div style="display: flex; gap: 4px; margin: 8px 0;">
              @for (s of [1,2,3,4,5]; track s) {
                <app-skeleton width="24px" height="24px" radius="50%" />
              }
            </div>
            <app-skeleton width="80%" height="80px" />
          </div>
        }
      </div>
    } @else if (reviews().length === 0) {
      <app-empty-state
        icon="star"
        title="No books to review"
        description="Books you've borrowed and returned will appear here so you can leave a review."
      />
    } @else {
      <div class="reviews-list">
        @for (r of reviews(); track r.book.id) {
          <div class="review-card">
            <div class="review-header">
              <h4>{{ r.book.title }}</h4>
              <p>{{ r.book.authorName }}</p>
            </div>

            @if (r.existing) {
              <div class="existing-review">
                <div class="stars-display">
                  @for (s of [1,2,3,4,5]; track s) {
                    <app-icon name="star" size="16" [class.filled]="s <= r.existing.note" />
                  }
                  <app-badge variant="info">Review submitted</app-badge>
                </div>
                @if (r.existing.comment) {
                  <p class="review-comment">{{ r.existing.comment }}</p>
                }
              </div>
            } @else {
              <div class="review-form">
                <div class="star-selector">
                  @for (s of [1,2,3,4,5]; track s) {
                    <button class="star-btn" (click)="setRating(r.book.id, s)" type="button">
                      <app-icon name="star" size="22" [class.filled]="s <= r.rating" />
                    </button>
                  }
                  @if (r.rating > 0) {
                    <span class="rating-label">{{ ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][r.rating] }}</span>
                  }
                </div>
                <textarea
                  class="review-textarea"
                  placeholder="Share your thoughts about this book..."
                  [ngModel]="r.comment"
                  (ngModelChange)="setComment(r.book.id, $event)"
                  rows="3"
                ></textarea>
                <div class="review-actions">
                  <app-button label="Submit Review" [disabled]="r.rating === 0" [loading]="r.submitting" (onClick)="submitReview(r)" />
                </div>
              </div>
            }
          </div>
        }
      </div>
    }
  </div>`,
  styles: `.page-header { margin-bottom: 32px; }
    .page-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .page-header p { font-size: 1rem; color: #5C5750; }
    .reviews-list { display: flex; flex-direction: column; gap: 16px; max-width: 600px; }
    .review-card { background: #232527; border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.04); }
    .review-header { margin-bottom: 16px; }
    .review-header h4 { font-size: 1rem; font-weight: 600; color: #F5F1E8; margin: 0 0 2px; }
    .review-header p { font-size: 0.85rem; color: #5C5750; margin: 0; }
    .existing-review { }
    .stars-display { display: flex; align-items: center; gap: 2px; margin-bottom: 8px; }
    .stars-display .filled { color: #D4BC6A; fill: #D4BC6A; }
    .review-comment { font-size: 0.85rem; color: #8A847C; line-height: 1.5; margin: 0; }
    .star-selector { display: flex; align-items: center; gap: 2px; margin-bottom: 12px; }
    .star-btn { background: none; border: none; color: #5C5750; cursor: pointer; padding: 2px; transition: color 200ms ease; &:hover { color: #D4BC6A; } }
    .star-btn .filled { color: #D4BC6A; fill: #D4BC6A; }
    .rating-label { font-size: 0.85rem; color: #8A847C; margin-left: 8px; }
    .review-textarea { width: 100%; padding: 12px 16px; background: #1E2022; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; color: #F5F1E8; font-size: 0.9rem; outline: none; resize: vertical; min-height: 80px; font-family: inherit; line-height: 1.6; margin-bottom: 12px; &::placeholder { color: #5C5750; } &:focus { border-color: rgba(198, 169, 114, 0.4); box-shadow: 0 0 0 3px rgba(198, 169, 114, 0.08); } }
    .review-actions { display: flex; justify-content: flex-end; }`
})
export class ReviewsComponent implements OnInit {
  private borrowingService = inject(BorrowingService);
  private feedbackService = inject(FeedbackService);

  readonly reviews = signal<ReviewState[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loading.set(true);
    this.borrowingService.getBorrowedBooksAsList().subscribe({
      next: (borrowed) => {
        const completed = borrowed.filter(b => b.returned && b.returnApproved);
        if (completed.length === 0) {
          this.reviews.set([]);
          this.loading.set(false);
          return;
        }
        const reviewsMap = new Map<number, ReviewState>();
        completed.forEach(b => reviewsMap.set(b.id, { book: b, rating: 0, comment: '', submitting: false }));
        let loaded = 0;
        completed.forEach(b => {
          this.feedbackService.getFeedbacks(b.id).subscribe({
            next: (fbs) => {
              const own = fbs.find(fb => fb.ownFeedback);
              const entry = reviewsMap.get(b.id);
              if (entry) entry.existing = own;
            },
            error: () => {},
            complete: () => {
              if (++loaded === completed.length) {
                this.reviews.set(Array.from(reviewsMap.values()));
                this.loading.set(false);
              }
            }
          });
        });
      },
      error: () => this.loading.set(false)
    });
  }

  setRating(bookId: number, rating: number): void {
    this.reviews.update(list => list.map(r =>
      r.book.id === bookId ? { ...r, rating } : r
    ));
  }

  setComment(bookId: number, comment: string): void {
    this.reviews.update(list => list.map(r =>
      r.book.id === bookId ? { ...r, comment } : r
    ));
  }

  submitReview(r: ReviewState): void {
    if (r.rating === 0) return;
    r.submitting = true;
    this.feedbackService.submitFeedback({
      bookId: r.book.id,
      note: r.rating,
      comment: r.comment.trim()
    }).subscribe({
      next: (feedbackId) => {
        this.reviews.update(list => list.map(entry =>
          entry.book.id === r.book.id
            ? { ...entry, existing: { note: entry.rating, comment: entry.comment.trim(), ownFeedback: true }, submitting: false }
            : entry
        ));
      },
      error: () => {
        this.reviews.update(list => list.map(entry =>
          entry.book.id === r.book.id ? { ...entry, submitting: false } : entry
        ));
      }
    });
  }
}

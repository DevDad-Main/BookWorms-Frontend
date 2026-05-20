import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { UserService } from '../../../core/services/user.service';
import { Book } from '../../../core/models/book.model';
import { BookCardComponent } from '../../../shared/components/book-card/book-card.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [RouterLink, BookCardComponent, ButtonComponent, SkeletonComponent, EmptyStateComponent],
  template: `<div class="page-enter">
    <div class="page-header">
      <div>
        <h1>My Books</h1>
        <p>Books you've added to your library.</p>
      </div>
      <a routerLink="/books/create">
        <app-button icon="plus" label="Add Book" />
      </a>
    </div>

    @if (loading()) {
      <div class="grid-4">
        @for (i of [1,2,3,4,5,6,7,8]; track i) {
          <div class="content-card" style="padding: 0; overflow: hidden;">
            <app-skeleton height="220px" radius="0" />
            <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
              <app-skeleton width="80%" height="16px" />
              <app-skeleton width="50%" height="12px" />
            </div>
          </div>
        }
      </div>
    } @else if (books().length === 0) {
      <app-empty-state
        icon="books"
        title="No books yet"
        description="Add your first book to share with the community."
        actionLabel="Add a Book"
        (action)="navigateCreate()"
      />
    } @else {
      <div class="grid-4">
        @for (book of books(); track book.id) {
          <app-book-card [book]="book" (onClick)="navigateDetail(book.id)" />
        }
      </div>
    }
  </div>`,
  styles: `.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; }
    .page-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .page-header p { font-size: 1rem; color: #5C5750; }`
})
export class MyBooksComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  readonly books = signal<Book[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.loading.set(true);
    this.userService.getUserBooks().subscribe({
      next: (books) => {
        this.books.set(books);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  navigateDetail(id: number): void {
    this.router.navigate(['/books', id]);
  }

  navigateCreate(): void {
    this.router.navigate(['/books/create']);
  }
}

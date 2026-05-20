import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { BorrowingService } from '../../../core/services/borrowing.service';
import { Book } from '../../../core/models/book.model';
import { BookCardComponent } from '../../../shared/components/book-card/book-card.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [RouterLink, BookCardComponent, SearchInputComponent, ButtonComponent, IconComponent, SkeletonComponent, EmptyStateComponent],
  template: `<div class="page-enter">
    <div class="page-header">
      <div>
        <h1>Browse Books</h1>
        <p>Discover books shared by the community.</p>
      </div>
      <a routerLink="/books/create">
        <app-button icon="plus" label="Add Book" />
      </a>
    </div>

    <div class="browse-toolbar">
      <app-search-input [query]="searchQuery()" (onSearch)="onSearch($event)" />
      <div class="toolbar-actions">
        <button class="view-toggle" [class.active]="viewMode() === 'grid'" (click)="viewMode.set('grid')">
          <app-icon name="grid" size="16" />
        </button>
        <button class="view-toggle" [class.active]="viewMode() === 'list'" (click)="viewMode.set('list')">
          <app-icon name="list" size="16" />
        </button>
      </div>
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
        title="No books found"
        description="Try adjusting your search or add a new book to the community."
        actionLabel="Add a Book"
        (action)="navigateCreate()"
      />
    } @else {
      <div [class]="viewMode() === 'grid' ? 'grid-4' : 'list-view'">
        @for (book of books(); track book.id) {
          @if (viewMode() === 'grid') {
            <app-book-card [book]="book" (onClick)="navigateDetail(book.id)" />
          } @else {
            <div class="list-item" (click)="navigateDetail(book.id)">
              <div class="list-cover">
                @if (book.cover) {
                  <img [src]="book.cover" [alt]="book.title" />
                } @else {
                  <app-icon name="book" size="20" />
                }
              </div>
              <div class="list-info">
                <h4>{{ book.title }}</h4>
                <span>{{ book.authorName }}</span>
              </div>
              <div class="list-owner">
                <span>{{ book.owner }}</span>
              </div>
              <div class="list-status">
                <span class="status-dot" [class.available]="book.shareable && !book.borrowed" [class.borrowed]="book.borrowed"></span>
                {{ book.borrowed ? 'Borrowed' : book.shareable ? 'Available' : 'Personal' }}
              </div>
            </div>
          }
        }
      </div>
    }
  </div>`,
  styles: `.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; }
    .page-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .page-header p { font-size: 1rem; color: #5C5750; }
    .browse-toolbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
    .toolbar-actions { display: flex; gap: 6px; }
    .view-toggle { width: 36px; height: 36px; border-radius: 8px; background: none; border: 1px solid rgba(255,255,255,0.06); color: #5C5750; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 200ms ease; }
    .view-toggle:hover { border-color: rgba(255,255,255,0.1); color: #B8B2A8; }
    .view-toggle.active { background: rgba(198, 169, 114, 0.1); border-color: rgba(198, 169, 114, 0.3); color: #C6A972; }
    .list-view { display: flex; flex-direction: column; gap: 8px; }
    .list-item { display: flex; align-items: center; gap: 16px; padding: 14px 18px; background: #232527; border-radius: 10px; border: 1px solid rgba(255,255,255,0.04); cursor: pointer; transition: all 200ms ease; }
    .list-item:hover { background: #2A2C2E; border-color: rgba(255,255,255,0.08); }
    .list-cover { width: 40px; height: 56px; border-radius: 4px; background: #181A1B; display: flex; align-items: center; justify-content: center; color: #3A3C3E; flex-shrink: 0; overflow: hidden; }
    .list-cover img { width: 100%; height: 100%; object-fit: cover; }
    .list-info { flex: 1; min-width: 0; }
    .list-info h4 { font-size: 0.9rem; font-weight: 600; color: #F5F1E8; margin: 0 0 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .list-info span { font-size: 0.8rem; color: #5C5750; }
    .list-owner { font-size: 0.85rem; color: #8A847C; min-width: 120px; }
    .list-status { font-size: 0.85rem; color: #5C5750; display: flex; align-items: center; gap: 6px; min-width: 100px; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #5C5750; }
    .status-dot.available { background: #7CBB7A; }
    .status-dot.borrowed { background: #D4A84B; }

    @media (max-width: 768px) {
      .page-header { flex-direction: column; }
      .list-owner { display: none; }
    }`
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  private borrowingService = inject(BorrowingService);
  private router = inject(Router);

  readonly books = signal<Book[]>([]);
  readonly loading = signal(true);
  readonly searchQuery = signal('');
  readonly viewMode = signal<'grid' | 'list'>('grid');

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading.set(true);
    this.bookService.getAllBooksAsList({ size: 50 }).subscribe({
      next: (books) => {
        this.borrowingService.getBorrowedBooksAsList().subscribe({
          next: (borrowed) => {
            const borrowedIds = new Set(borrowed.map(b => b.id));
            this.books.set(books.map(b => ({ ...b, borrowed: borrowedIds.has(b.id) })));
            this.loading.set(false);
          },
          error: () => {
            this.books.set(books);
            this.loading.set(false);
          }
        });
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.loadBooks();
  }

  navigateDetail(id: number): void {
    this.router.navigate(['/books', id]);
  }

  navigateCreate(): void {
    this.router.navigate(['/books/create']);
  }
}

import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../core/services/book.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { ToggleComponent } from '../../../shared/components/toggle/toggle.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-book-create',
  standalone: true,
  imports: [RouterLink, FormsModule, ButtonComponent, InputComponent, ToggleComponent, IconComponent],
  template: `<div class="page-enter">
    <a routerLink="/books" class="back-link">
      <app-icon name="arrow-left" size="16" />
      <span>Back to books</span>
    </a>

    <div class="page-header">
      <h1>Add a New Book</h1>
      <p>Share a book with the community.</p>
    </div>

    <form (ngSubmit)="onSubmit()" class="book-form">
      <div class="form-section">
        <div class="form-grid">
          <app-input label="Title" placeholder="Book title" [value]="title" (valueChange)="title = $event" [error]="getError('title')" />
          <app-input label="Author" placeholder="Author name" [value]="author" (valueChange)="author = $event" [error]="getError('author')" />
        </div>
        <app-input label="ISBN (optional)" placeholder="978-3-16-148410-0" [value]="isbn" (valueChange)="isbn = $event" />
      </div>

      <div class="form-section">
        <label class="textarea-label">Synopsis</label>
        <textarea
          class="text-area"
          placeholder="Write a brief description of the book..."
          [ngModel]="synopsis"
          (ngModelChange)="synopsis = $event"
          rows="5"
        ></textarea>
      </div>

      <div class="form-section">
        <div class="toggle-row">
          <div class="toggle-info">
            <span class="toggle-label">Make available for borrowing</span>
            <span class="toggle-desc">Allow other readers to request this book</span>
          </div>
          <app-toggle [checked]="shareable" (checkedChange)="shareable = $event" />
        </div>
      </div>

      @if (getError('general')) {
        <div class="error-alert">
          <app-icon name="alert-circle" size="16" />
          <span>{{ getError('general') }}</span>
        </div>
      }

      <div class="form-actions">
        <a routerLink="/books">
          <app-button label="Cancel" variant="ghost" />
        </a>
        <app-button type="submit" label="Add Book" [loading]="loading()" />
      </div>
    </form>
  </div>`,
  styles: `.back-link { display: inline-flex; align-items: center; gap: 6px; color: #8A847C; font-size: 0.85rem; margin-bottom: 16px; &:hover { color: #C6A972; } }
    .page-header { margin-bottom: 32px; }
    .page-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2rem; font-weight: 600; color: #F5F1E8; margin-bottom: 8px; }
    .page-header p { font-size: 1rem; color: #5C5750; }
    .book-form { max-width: 600px; }
    .form-section { margin-bottom: 24px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .textarea-label { display: block; font-size: 0.85rem; font-weight: 500; color: #B8B2A8; margin-bottom: 6px; }
    .text-area { width: 100%; padding: 12px 16px; background: #232527; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; color: #F5F1E8; font-size: 0.9rem; outline: none; resize: vertical; min-height: 120px; transition: border-color 250ms ease; font-family: inherit; line-height: 1.6; }
    .text-area::placeholder { color: #5C5750; }
    .text-area:focus { border-color: rgba(198, 169, 114, 0.4); box-shadow: 0 0 0 3px rgba(198, 169, 114, 0.08); }
    .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: #232527; border-radius: 10px; border: 1px solid rgba(255,255,255,0.04); }
    .toggle-label { display: block; font-size: 0.9rem; font-weight: 500; color: #F5F1E8; margin-bottom: 2px; }
    .toggle-desc { font-size: 0.8rem; color: #5C5750; }
    .error-alert { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: rgba(184, 92, 92, 0.08); border: 1px solid rgba(184, 92, 92, 0.15); border-radius: 8px; color: #D47A7A; font-size: 0.85rem; margin-bottom: 24px; }
    .form-actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.04); }

    @media (max-width: 576px) {
      .form-grid { grid-template-columns: 1fr; }
    }`
})
export class BookCreateComponent {
  private bookService = inject(BookService);
  private router = inject(Router);

  title = '';
  author = '';
  isbn = '';
  synopsis = '';
  shareable = false;
  loading = signal(false);
  errors = signal<Record<string, string>>({});

  getError(key: string): string {
    return this.errors()[key] || '';
  }

  onSubmit(): void {
    this.errors.set({});
    const newErrors: Record<string, string> = {};

    if (!this.title.trim()) newErrors['title'] = 'Title is required';
    if (!this.author.trim()) newErrors['author'] = 'Author is required';

    if (Object.keys(newErrors).length > 0) {
      this.errors.set(newErrors);
      return;
    }

    this.loading.set(true);
    this.bookService.createBook({
      title: this.title.trim(),
      authorName: this.author.trim(),
      isbn: this.isbn.trim() || 'N/A',
      synopsis: this.synopsis.trim() || 'No synopsis provided.',
      shareable: this.shareable
    }).subscribe({
      next: (bookId) => this.router.navigate(['/books', bookId]),
      error: (err) => {
        this.loading.set(false);
        this.errors.set({ general: err.error?.error || 'Failed to create book.' });
      }
    });
  }
}

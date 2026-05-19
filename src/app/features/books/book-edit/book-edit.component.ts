import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [RouterLink, ButtonComponent, IconComponent],
  template: `<div class="page-enter" style="text-align: center; padding: 64px 24px;">
    <app-icon name="edit" size="48" style="color: #5C5750; margin-bottom: 16px; display: block;" />
    <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.5rem; color: #F5F1E8; margin-bottom: 8px;">Edit Book</h2>
    <p style="color: #8A847C; margin-bottom: 24px;">Book editing is handled directly in the backend. Redirecting...</p>
    <a routerLink="/books">
      <app-button label="Back to Books" variant="outline" />
    </a>
  </div>`,
  styles: ``
})
export class BookEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(BookService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.bookService.getBookById(id).subscribe({
        next: () => this.router.navigate(['/books', id]),
        error: () => this.router.navigate(['/books'])
      });
    } else {
      this.router.navigate(['/books']);
    }
  }
}

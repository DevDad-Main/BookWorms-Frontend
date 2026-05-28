import { Component, inject, OnInit, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { BookService } from '../../core/services/book.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-debug-jwt',
  standalone: true,
  imports: [JsonPipe, ButtonComponent, IconComponent],
  template: `<div class="page-enter">
    <div class="page-header">
      <div>
        <h1>Debug JWT</h1>
        <p>View the decoded JWT claims from the backend.</p>
      </div>
      <app-button label="Refresh" icon="refresh" variant="outline" size="sm" [loading]="loading()" (onClick)="fetchJwt()" />
    </div>

    @if (error()) {
      <div class="error-box">
        <app-icon name="alert-circle" size="18" />
        <span>{{ error() }}</span>
      </div>
    }

    <div class="jwt-card">
      @if (loading()) {
        <div class="loading-text">Loading claims...</div>
      } @else if (claims(); as claims) {
        <pre class="json-block">{{ claims | json }}</pre>
      } @else {
        <div class="empty-state">
          <app-icon name="info" size="24" />
          <p>Click "Refresh" to fetch JWT claims.</p>
        </div>
      }
    </div>
  </div>`,
  styles: `.page-enter { animation: fadeIn 300ms ease; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 32px; }
    .page-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.75rem; font-weight: 700; color: #F5F1E8; margin: 0 0 4px; }
    .page-header p { margin: 0; color: #8A847C; font-size: 0.9rem; }
    .error-box { background: rgba(255, 77, 77, 0.1); border: 1px solid rgba(255, 77, 77, 0.2); border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; color: #FF6B6B; font-size: 0.9rem; }
    .jwt-card { background: #181A1B; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 24px; }
    .json-block { background: #111315; border-radius: 8px; padding: 20px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.8rem; line-height: 1.6; color: #C6A972; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin: 0; }
    .loading-text { color: #8A847C; text-align: center; padding: 40px; font-size: 0.9rem; }
    .empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px; color: #5C5750; text-align: center; }
    .empty-state p { margin: 0; font-size: 0.9rem; }`
})
export class DebugJwtComponent implements OnInit {
  private bookService = inject(BookService);

  readonly loading = signal(false);
  readonly claims = signal<Record<string, unknown> | null>(null);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchJwt();
  }

  fetchJwt(): void {
    this.loading.set(true);
    this.error.set(null);
    this.bookService.debugJwt().subscribe({
      next: (data) => {
        this.claims.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.description || err?.message || 'Failed to fetch JWT claims');
        this.loading.set(false);
      },
    });
  }
}

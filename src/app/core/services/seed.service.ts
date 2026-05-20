import { Injectable, signal } from '@angular/core';
import { BookService } from './book.service';
import { SEED_BOOKS } from '../data/seed.data';
import { Observable, Subject, concatMap, from } from 'rxjs';

export interface SeedProgress {
  current: number;
  total: number;
  title: string;
  done: boolean;
  error?: string;
}

const COVER_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#6a0572', '#7b2d8b', '#a53860', '#da2d2d',
  '#e3655b', '#e8a838', '#3a7ca5', '#2f5d7a',
  '#1b6ca8', '#054a91', '#2d6a4f', '#40916c',
  '#5c4d7d', '#3d2c4a', '#8d6b94', '#6b4f7c',
  '#2c3e50', '#34495e', '#4a6741', '#5d4e37',
];

function generateFallbackCover(title: string, index: number): File {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 600;
  const ctx = canvas.getContext('2d')!;

  const color = COVER_COLORS[index % COVER_COLORS.length];
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 400, 600);

  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, 'rgba(255,255,255,0.08)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 600);

  ctx.fillStyle = '#F5F1E8';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const words = title.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    if (ctx.measureText(test).width > 280) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  const lineHeight = 40;
  const totalHeight = lines.length * lineHeight;
  const startY = (600 - totalHeight) / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, 200, startY + i * lineHeight + lineHeight / 2);
  });

  const dataUrl = canvas.toDataURL('image/png');
  const byteString = atob(dataUrl.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([ab], `cover-${index}.png`, { type: 'image/png' });
}

function fetchCoverByIsbn(isbn: string): Promise<File | null> {
  return fetch(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`)
    .then(resp => {
      if (!resp.ok) return null;
      return resp.blob().then(blob => new File([blob], `cover-${isbn}.jpg`, { type: blob.type || 'image/jpeg' }));
    })
    .catch(() => null);
}

@Injectable({ providedIn: 'root' })
export class SeedService {
  private progress = signal<SeedProgress | null>(null);
  readonly progress$ = this.progress.asReadonly();

  constructor(private bookService: BookService) {}

  seedBooks(): Observable<SeedProgress> {
    const subject = new Subject<SeedProgress>();
    const total = SEED_BOOKS.length;

    this.progress.set({ current: 0, total, title: '', done: false });

    from(SEED_BOOKS).pipe(
      concatMap((book, index) =>
        new Observable<SeedProgress>(obs => {
          this.bookService.createBook(book).subscribe({
            next: (bookId) => {
              fetchCoverByIsbn(book.isbn).then(cover => {
                const file = cover || generateFallbackCover(book.title, index);
                this.bookService.uploadCover(bookId, file).subscribe({
                  next: () => {
                    const current = index + 1;
                    const progress: SeedProgress = {
                      current, total, title: book.title,
                      done: current === total,
                    };
                    this.progress.set(progress);
                    subject.next(progress);
                    obs.next(progress);
                    obs.complete();
                  },
                  error: (err) => {
                    const current = index + 1;
                    const progress: SeedProgress = {
                      current, total, title: book.title, done: current === total,
                      error: `Cover upload failed: ${err.message}`,
                    };
                    this.progress.set(progress);
                    subject.next(progress);
                    obs.next(progress);
                    obs.complete();
                  },
                });
              });
            },
            error: (err) => {
              const current = index + 1;
              const progress: SeedProgress = {
                current, total, title: book.title, done: false,
                error: err.message,
              };
              this.progress.set(progress);
              subject.next(progress);
              subject.error(err);
              obs.error(err);
            },
          });
        })
      )
    ).subscribe({
      error: (err) => subject.error(err),
      complete: () => {
        this.progress.set({ current: total, total, title: '', done: true });
        subject.complete();
      },
    });

    return subject.asObservable();
  }
}

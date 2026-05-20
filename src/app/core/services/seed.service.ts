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
      concatMap(book =>
        new Observable<SeedProgress>(obs => {
          this.bookService.createBook(book).subscribe({
            next: () => {
              const current = SEED_BOOKS.indexOf(book) + 1;
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
              const current = SEED_BOOKS.indexOf(book) + 1;
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

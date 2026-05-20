import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: 'register',
    canActivate: [publicGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'verify-email',
    canActivate: [publicGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
      }
    ]
  },
  {
    path: 'activate-account',
    canActivate: [publicGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
      }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'books',
        loadComponent: () => import('./features/books/book-list/book-list.component').then(m => m.BookListComponent)
      },
      {
        path: 'books/my',
        loadComponent: () => import('./features/books/my-books/my-books.component').then(m => m.MyBooksComponent)
      },
      {
        path: 'books/create',
        loadComponent: () => import('./features/books/book-create/book-create.component').then(m => m.BookCreateComponent)
      },
      {
        path: 'books/:id',
        loadComponent: () => import('./features/books/book-detail/book-detail.component').then(m => m.BookDetailComponent)
      },
      {
        path: 'books/:id/edit',
        loadComponent: () => import('./features/books/book-edit/book-edit.component').then(m => m.BookEditComponent)
      },
      {
        path: 'borrowing/lent',
        loadComponent: () => import('./features/borrowing/currently-lent/currently-lent.component').then(m => m.CurrentlyLentComponent)
      },
      {
        path: 'borrowing/requests',
        loadComponent: () => import('./features/borrowing/borrow-requests/borrow-requests.component').then(m => m.BorrowRequestsComponent)
      },
      {
        path: 'borrowing/borrowed',
        loadComponent: () => import('./features/borrowing/borrowed-books/borrowed-books.component').then(m => m.BorrowedBooksComponent)
      },
      {
        path: 'borrowing/return',
        loadComponent: () => import('./features/borrowing/return-books/return-books.component').then(m => m.ReturnBooksComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

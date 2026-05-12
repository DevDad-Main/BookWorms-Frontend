import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

const NOW = new Date();
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86400000).toISOString();

const MOCK_USER = {
  id: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@bookworms.com',
  bio: 'Avid reader and occasional writer. Love discovering hidden gems and sharing them with friends.',
  role: 'USER',
  accountLocked: false,
  enabled: true,
  createdDate: daysAgo(120),
  lastModifiedDate: daysAgo(1)
};

const MOCK_PROFILE = {
  id: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@bookworms.com',
  bio: 'Avid reader and occasional writer. Love discovering hidden gems and sharing them with friends.',
  totalBooks: 5,
  sharedBooks: 3,
  borrowedBooks: 2,
  lentBooks: 2,
  memberSince: daysAgo(120)
};

const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.mock-token-for-testing-only';

const BOOKS = [
  { id: 1, title: 'The Great Gatsby', authorName: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', synopsis: 'A story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, set in the Jazz Age on Long Island.', ownerName: 'Test User', ownerId: 1, shareable: true, archived: false, rating: 4, cover: 'https://picsum.photos/seed/gatsby/400/560', createdAt: daysAgo(45) },
  { id: 2, title: 'To Kill a Mockingbird', authorName: 'Harper Lee', isbn: '978-0-06-112008-4', synopsis: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.', ownerName: 'Test User', ownerId: 1, shareable: true, archived: false, rating: 5, cover: 'https://picsum.photos/seed/mockingbird/400/560', createdAt: daysAgo(30) },
  { id: 3, title: '1984', authorName: 'George Orwell', isbn: '978-0-452-28423-4', synopsis: 'A dystopian social science novel that examines the consequences of totalitarianism, mass surveillance, and repressive regimentation.', ownerName: 'Alice Reader', ownerId: 2, shareable: true, archived: false, rating: 5, cover: 'https://picsum.photos/seed/nineteen84/400/560', createdAt: daysAgo(60) },
  { id: 4, title: 'Pride and Prejudice', authorName: 'Jane Austen', isbn: '978-0-14-143951-8', synopsis: 'A romantic novel of manners that follows the character development of Elizabeth Bennet as she navigates issues of morality, education, and marriage.', ownerName: 'Test User', ownerId: 1, shareable: true, archived: false, rating: 4, cover: 'https://picsum.photos/seed/pride/400/560', createdAt: daysAgo(20) },
  { id: 5, title: 'The Catcher in the Rye', authorName: 'J.D. Salinger', isbn: '978-0-316-76948-0', synopsis: 'The story of Holden Caulfield\'s experiences in New York City after being expelled from prep school.', ownerName: 'Bob Bookworm', ownerId: 3, shareable: true, archived: false, rating: 3, createdAt: daysAgo(90) },
  { id: 6, title: 'Brave New World', authorName: 'Aldous Huxley', isbn: '978-0-06-085052-4', synopsis: 'A futuristic society where humans are genetically modified and socially conditioned to serve a stable, happy totalitarian regime.', ownerName: 'Test User', ownerId: 1, shareable: false, archived: false, rating: 4, cover: 'https://picsum.photos/seed/brave/400/560', createdAt: daysAgo(15) },
  { id: 7, title: 'The Hobbit', authorName: 'J.R.R. Tolkien', isbn: '978-0-547-92822-7', synopsis: 'Bilbo Baggins, a hobbit, embarks on an unexpected journey with a company of dwarves to reclaim their treasure from the dragon Smaug.', ownerName: 'Alice Reader', ownerId: 2, shareable: true, archived: false, rating: 5, cover: 'https://picsum.photos/seed/hobbit/400/560', createdAt: daysAgo(75) },
  { id: 8, title: 'Dune', authorName: 'Frank Herbert', isbn: '978-0-441-17271-9', synopsis: 'Set on the desert planet Arrakis, it tells the story of young Paul Atreides as he navigates politics, religion, and ecology.', ownerName: 'Test User', ownerId: 1, shareable: true, archived: false, rating: 5, cover: 'https://picsum.photos/seed/dune/400/560', createdAt: daysAgo(10) }
];

const MY_BOOKS = BOOKS.filter(b => b.ownerId === 1);
const OTHER_BOOKS = BOOKS.filter(b => b.ownerId !== 1);

const BORROWED_BOOKS = [
  { id: 1, bookId: 3, bookTitle: '1984', bookAuthor: 'George Orwell', borrowerName: 'Test User', borrowerId: 1, ownerName: 'Alice Reader', ownerId: 2, status: 'PENDING', requestedAt: daysAgo(5) },
  { id: 2, bookId: 5, bookTitle: 'The Catcher in the Rye', bookAuthor: 'J.D. Salinger', borrowerName: 'Test User', borrowerId: 1, ownerName: 'Bob Bookworm', ownerId: 3, status: 'APPROVED', requestedAt: daysAgo(14), approvedAt: daysAgo(12), dueDate: daysAgo(16) },
  { id: 3, bookId: 7, bookTitle: 'The Hobbit', bookAuthor: 'J.R.R. Tolkien', borrowerName: 'Test User', borrowerId: 1, ownerName: 'Alice Reader', ownerId: 2, status: 'RETURNED', requestedAt: daysAgo(60), approvedAt: daysAgo(58), returnedAt: daysAgo(20) },
  { id: 4, bookId: 1, bookTitle: 'The Great Gatsby', bookAuthor: 'F. Scott Fitzgerald', borrowerName: 'Alice Reader', borrowerId: 2, ownerName: 'Test User', ownerId: 1, status: 'PENDING', requestedAt: daysAgo(3) },
  { id: 5, bookId: 4, bookTitle: 'Pride and Prejudice', bookAuthor: 'Jane Austen', borrowerName: 'Bob Bookworm', borrowerId: 3, ownerName: 'Test User', ownerId: 1, status: 'APPROVED', requestedAt: daysAgo(10), approvedAt: daysAgo(8), dueDate: daysAgo(22) }
];

const BORROWING_STATS = {
  totalBorrowed: 3,
  totalLent: 2,
  activeBorrows: 1,
  pendingRequests: 1,
  completedReturns: 1
};

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const { method, url } = req;

  if (url.includes('/api/v1/auth/login')) {
    return of(new HttpResponse({ status: 200, body: { token: MOCK_TOKEN, user: MOCK_USER } }));
  }

  if (url.includes('/api/v1/auth/register') || url.includes('/api/v1/auth/activate-account')) {
    return of(new HttpResponse({ status: 200 }));
  }

  if (url.includes('/api/v1/users/profile')) {
    if (method === 'GET') return of(new HttpResponse({ status: 200, body: MOCK_PROFILE }));
    if (method === 'PATCH') return of(new HttpResponse({ status: 200, body: { ...MOCK_PROFILE, ...(req.body as object) } }));
  }

  if (method === 'POST' && url.includes('/api/v1/users/avatar')) {
    return of(new HttpResponse({ status: 200, body: 'https://picsum.photos/seed/avatar/200/200' }));
  }

  if (method === 'GET' && url.match(/\/api\/v1\/users\/\d+\/books/)) {
    return of(new HttpResponse({ status: 200, body: MY_BOOKS }));
  }

  if (url.includes('/api/v1/borrowing/stats')) {
    return of(new HttpResponse({ status: 200, body: BORROWING_STATS }));
  }

  if (url.includes('/api/v1/borrowing/')) {
    if (method === 'GET') {
      if (url.includes('/borrowed')) return of(new HttpResponse({ status: 200, body: BORROWED_BOOKS.filter(b => b.borrowerId === 1) }));
      if (url.includes('/lent')) return of(new HttpResponse({ status: 200, body: BORROWED_BOOKS.filter(b => b.ownerId === 1) }));
      if (url.includes('/requests')) return of(new HttpResponse({ status: 200, body: BORROWED_BOOKS.filter(b => b.ownerId === 1 && b.status === 'PENDING') }));
    }
    if (method === 'PATCH') return of(new HttpResponse({ status: 200, body: {} }));
  }

  if (url.includes('/api/v1/books')) {
    if (method === 'GET') {
      const match = url.match(/\/api\/v1\/books\/(\d+)(?:\/|\?|$)/);
      if (match) {
        const id = parseInt(match[1], 10);
        const book = BOOKS.find(b => b.id === id);
        return of(new HttpResponse({ status: 200, body: book || BOOKS[0] }));
      }
      return of(new HttpResponse({ status: 200, body: BOOKS }));
    }
    if (method === 'POST') {
      const body = req.body as Record<string, unknown>;
      return of(new HttpResponse({
        status: 200,
        body: {
          id: Math.floor(Math.random() * 10000) + 100,
          title: body['title'] || 'Untitled',
          authorName: body['authorName'] || 'Unknown',
          ownerName: 'Test User', ownerId: 1,
          shareable: body['shareable'] ?? false, archived: false,
          rating: 0, createdAt: new Date().toISOString()
        }
      }));
    }
    if (method === 'PUT') return of(new HttpResponse({ status: 200, body: req.body }));
    if (method === 'PATCH') return of(new HttpResponse({ status: 200, body: {} }));
    if (method === 'DELETE') return of(new HttpResponse({ status: 204 }));
  }

  return next(req);
};

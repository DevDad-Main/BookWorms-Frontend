export const API = {
  BASE_URL: 'http://localhost:8088/api/v1',
  AUTH: {
    LOGIN: '/auth/authenticate',
    REGISTER: '/auth/register',
    VERIFY: '/auth/activate-account',
  },
  BOOKS: {
    BASE: '/books',
    BY_ID: (id: number) => `/books/${id}`,
    OWNER: '/books/owner',
    BORROWED: '/books/borrowed',
    RETURNED: '/books/returned',
    SHAREABLE: (id: number) => `/books/shareable/${id}`,
    ARCHIVED: (id: number) => `/books/archived/${id}`,
    BORROW: (id: number) => `/books/borrowed/${id}`,
    RETURN: (id: number) => `/books/borrow/return/${id}`,
    APPROVE_RETURN: (id: number) => `/books/borrow/return/approve/${id}`,
    COVER: (id: number) => `/books/cover/${id}`,
  },
  FEEDBACK: {
    BASE: '/feedbacks',
    BY_BOOK: (bookId: number) => `/feedbacks/book/${bookId}`,
  },
} as const;

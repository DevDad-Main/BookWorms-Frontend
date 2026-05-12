export const API = {
  BASE_URL: 'http://localhost:8088/api/v1',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/activate-account',
    REFRESH: '/auth/refresh-token'
  },
  BOOKS: {
    BASE: '/books',
    BY_ID: (id: number) => `/books/${id}`,
    SHARE: (id: number) => `/books/${id}/share`,
    ARCHIVE: (id: number) => `/books/${id}/archive`,
    BORROW: (id: number) => `/books/${id}/borrow`,
    RETURN: (id: number) => `/books/${id}/return`,
    APPROVE_RETURN: (id: number) => `/books/${id}/return/approve`,
    SEARCH: '/books/search'
  },
  BORROWING: {
    BORROWED: '/borrowing/borrowed',
    LENT: '/borrowing/lent',
    REQUESTS: '/borrowing/requests',
    APPROVE: (id: number) => `/borrowing/${id}/approve`,
    REJECT: (id: number) => `/borrowing/${id}/reject`,
    RETURN: (id: number) => `/borrowing/${id}/return`,
    APPROVE_RETURN: (id: number) => `/borrowing/${id}/return/approve`
  },
  USERS: {
    PROFILE: '/users/profile',
    BY_ID: (id: number) => `/users/${id}`,
    BOOKS: (id: number) => `/users/${id}/books`
  }
} as const;

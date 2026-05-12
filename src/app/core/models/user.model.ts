export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  accountLocked: boolean;
  enabled: boolean;
  createdDate: string;
  lastModifiedDate?: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  bio?: string;
  totalBooks: number;
  sharedBooks: number;
  borrowedBooks: number;
  lentBooks: number;
  memberSince: string;
}

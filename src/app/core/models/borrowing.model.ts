export enum BorrowStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RETURNED = 'RETURNED',
  RETURN_REQUESTED = 'RETURN_REQUESTED'
}

export interface BorrowedBook {
  id: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookCover?: string;
  borrowerName: string;
  borrowerId: number;
  ownerName: string;
  ownerId: number;
  status: BorrowStatus;
  requestedAt: string;
  approvedAt?: string;
  returnedAt?: string;
  dueDate?: string;
}

export interface BorrowRequest {
  bookId: number;
}

export interface BorrowingStats {
  totalBorrowed: number;
  totalLent: number;
  activeBorrows: number;
  pendingRequests: number;
  completedReturns: number;
}

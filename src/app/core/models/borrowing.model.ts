export interface BorrowedBook {
  id: number;
  title: string;
  authorName: string;
  isbn: string;
  rate: number;
  returned: boolean;
  returnApproved: boolean;
}

export enum BorrowStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RETURNED = 'RETURNED',
  RETURN_REQUESTED = 'RETURN_REQUESTED'
}

export interface BorrowingStats {
  totalBorrowed: number;
  totalLent: number;
  activeBorrows: number;
  pendingRequests: number;
  completedReturns: number;
}

export interface FeedbackRequest {
  note: number;
  comment: string;
  bookId: number;
}

export interface FeedbackResponse {
  note: number;
  comment: string;
  ownFeedback: boolean;
}

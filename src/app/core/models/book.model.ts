export interface Book {
  id: number;
  title: string;
  authorName: string;
  isbn?: string;
  synopsis?: string;
  ownerName: string;
  ownerId: number;
  cover?: string;
  shareable: boolean;
  archived: boolean;
  rating?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface BookRequest {
  title: string;
  authorName: string;
  isbn?: string;
  synopsis?: string;
  shareable: boolean;
}

export interface BookFilters {
  title?: string;
  author?: string;
  owner?: string;
  shareable?: boolean;
  archived?: boolean;
}

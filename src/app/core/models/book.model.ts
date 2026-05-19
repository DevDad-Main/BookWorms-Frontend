export interface Book {
  id: number;
  title: string;
  authorName: string;
  isbn: string;
  synopsis: string;
  owner: string;
  cover?: string;
  rate: number;
  archived: boolean;
  shareable: boolean;
}

export interface BookRequest {
  id?: number;
  title: string;
  authorName: string;
  isbn: string;
  synopsis: string;
  shareable: boolean;
}

export interface BookFilters {
  page?: number;
  size?: number;
}

/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Book Model
 * ---------------------------------------------------------
 */

export interface Book {
  id: number;
  title: string;
  isbn: string;
  publicationYear: number;
  stockQuantity: number;
  authorId: number;
  authorName?: string;
}

export interface CreateBookInput {
  title: string;
  isbn: string;
  publicationYear: number;
  stockQuantity: number;
  authorId: number;
}

export interface UpdateBookInput {
  title: string;
  isbn: string;
  publicationYear: number;
  stockQuantity: number;
  authorId: number;
}
/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Report Models
 * ---------------------------------------------------------
 */

export interface AvailableBookReport {
  bookId: number;
  title: string;
  isbn: string;
  authorName: string;
  availableQuantity: number;
}

export interface BorrowedBookReport {
  loanId: number;
  bookId: number;
  bookTitle: string;
  customerName: string;
  loanDate: Date;
  dueDate: Date;
}

export interface BooksByAuthorReport {
  authorId: number;
  authorName: string;
  bookCount: number;
}

export interface LoansByBookReport {
  bookId: number;
  bookTitle: string;
  loanCount: number;
}

export interface CustomerWithActiveLoanReport {
  customerId: number;
  customerName: string;
  email: string;
  activeLoanCount: number;
}
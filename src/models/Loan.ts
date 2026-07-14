/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Loan Model
 * ---------------------------------------------------------
 */

export type LoanStatus = "ACTIVE" | "RETURNED";

export interface Loan {
  id: number;
  customerId: number;
  customerName: string;
  bookId: number;
  bookTitle: string;
  loanDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  status: LoanStatus;
}

export interface CreateLoanInput {
  customerId: number;
  bookId: number;
  dueDate: string;
}
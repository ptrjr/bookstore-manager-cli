/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Report Service
 * Coordinates report generation.
 * ---------------------------------------------------------
 */

import {
  AvailableBookReport,
  BooksByAuthorReport,
  BorrowedBookReport,
  CustomerWithActiveLoanReport,
  LoansByBookReport,
} from "../models/Report";
import { ReportRepository } from "../repositories/ReportRepository";

export class ReportService {
  private readonly reportRepository: ReportRepository;

  constructor(
    reportRepository = new ReportRepository(),
  ) {
    this.reportRepository = reportRepository;
  }

  async getAvailableBooks(): Promise<
    AvailableBookReport[]
  > {
    return this.reportRepository.findAvailableBooks();
  }

  async getBorrowedBooks(): Promise<
    BorrowedBookReport[]
  > {
    return this.reportRepository.findBorrowedBooks();
  }

  async getBooksByAuthor(): Promise<
    BooksByAuthorReport[]
  > {
    return this.reportRepository.countBooksByAuthor();
  }

  async getLoansByBook(): Promise<
    LoansByBookReport[]
  > {
    return this.reportRepository.countLoansByBook();
  }

  async getCustomersWithActiveLoans(): Promise<
    CustomerWithActiveLoanReport[]
  > {
    return this.reportRepository.findCustomersWithActiveLoans();
  }
}
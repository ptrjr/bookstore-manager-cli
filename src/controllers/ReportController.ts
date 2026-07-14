/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Report Controller
 * Displays managerial reports in the terminal.
 * ---------------------------------------------------------
 */

import { ReportService } from "../services/ReportService";

export class ReportController {
  private readonly reportService: ReportService;

  constructor(
    reportService = new ReportService(),
  ) {
    this.reportService = reportService;
  }

  async showAvailableBooks(): Promise<void> {
    await this.executeAction(async () => {
      const books =
        await this.reportService.getAvailableBooks();

      if (books.length === 0) {
        console.log(
          "\nThere are no books currently available.",
        );
        return;
      }

      console.log("\nAvailable books:");

      console.table(
        books.map((book) => ({
          "Book ID": book.bookId,
          Title: book.title,
          ISBN: book.isbn,
          Author: book.authorName,
          Available: book.availableQuantity,
        })),
      );
    });
  }

  async showBorrowedBooks(): Promise<void> {
    await this.executeAction(async () => {
      const books =
        await this.reportService.getBorrowedBooks();

      if (books.length === 0) {
        console.log(
          "\nThere are no books currently borrowed.",
        );
        return;
      }

      console.log("\nBorrowed books:");

      console.table(
        books.map((book) => ({
          "Loan ID": book.loanId,
          "Book ID": book.bookId,
          Book: book.bookTitle,
          Customer: book.customerName,
          "Loan date": this.formatDate(book.loanDate),
          "Due date": this.formatDate(book.dueDate),
        })),
      );
    });
  }

  async showBooksByAuthor(): Promise<void> {
    await this.executeAction(async () => {
      const authors =
        await this.reportService.getBooksByAuthor();

      if (authors.length === 0) {
        console.log("\nNo authors registered.");
        return;
      }

      console.log("\nBooks registered by author:");

      console.table(
        authors.map((author) => ({
          "Author ID": author.authorId,
          Author: author.authorName,
          "Registered books": author.bookCount,
        })),
      );
    });
  }

  async showLoansByBook(): Promise<void> {
    await this.executeAction(async () => {
      const books =
        await this.reportService.getLoansByBook();

      if (books.length === 0) {
        console.log("\nNo books registered.");
        return;
      }

      console.log(
        "\nTop 10 books by number of loans:",
      );

      console.table(
        books.map((book) => ({
          "Book ID": book.bookId,
          Book: book.bookTitle,
          "Total loans": book.loanCount,
        })),
      );
    });
  }

  async showCustomersWithActiveLoans(): Promise<void> {
    await this.executeAction(async () => {
      const customers =
        await this.reportService.getCustomersWithActiveLoans();

      if (customers.length === 0) {
        console.log(
          "\nThere are no customers with active loans.",
        );
        return;
      }

      console.log("\nCustomers with active loans:");

      console.table(
        customers.map((customer) => ({
          "Customer ID": customer.customerId,
          Customer: customer.customerName,
          Email: customer.email,
          "Active loans": customer.activeLoanCount,
        })),
      );
    });
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }

  private async executeAction(
    action: () => Promise<void>,
  ): Promise<void> {
    try {
      await action();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      console.error(
        `\nError while generating report: ${message}`,
      );
    }
  }
}
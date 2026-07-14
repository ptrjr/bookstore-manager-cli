/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Report Repository
 * Handles report queries in PostgreSQL.
 * ---------------------------------------------------------
 */

import databasePool from "../database/connection";
import {
  AvailableBookReport,
  BooksByAuthorReport,
  BorrowedBookReport,
  CustomerWithActiveLoanReport,
  LoansByBookReport,
} from "../models/Report";

interface AvailableBookDatabaseRow {
  book_id: number;
  title: string;
  isbn: string;
  author_name: string;
  available_quantity: number;
}

interface BorrowedBookDatabaseRow {
  loan_id: number;
  book_id: number;
  book_title: string;
  customer_name: string;
  loan_date: Date | string;
  due_date: Date | string;
}

interface BooksByAuthorDatabaseRow {
  author_id: number;
  author_name: string;
  book_count: string | number;
}

interface LoansByBookDatabaseRow {
  book_id: number;
  book_title: string;
  loan_count: string | number;
}

interface CustomerWithActiveLoanDatabaseRow {
  customer_id: number;
  customer_name: string;
  email: string;
  active_loan_count: string | number;
}

export class ReportRepository {
  async findAvailableBooks(): Promise<
    AvailableBookReport[]
  > {
    const query = `
      SELECT
        books.id AS book_id,
        books.title,
        books.isbn,
        authors.name AS author_name,
        books.stock_quantity AS available_quantity
      FROM books
      INNER JOIN authors
        ON authors.id = books.author_id
      WHERE books.stock_quantity > 0
      ORDER BY books.title;
    `;

    const result =
      await databasePool.query<AvailableBookDatabaseRow>(
        query,
      );

    return result.rows.map((row) => ({
      bookId: row.book_id,
      title: row.title,
      isbn: row.isbn,
      authorName: row.author_name,
      availableQuantity: row.available_quantity,
    }));
  }

  async findBorrowedBooks(): Promise<
    BorrowedBookReport[]
  > {
    const query = `
      SELECT
        loans.id AS loan_id,
        books.id AS book_id,
        books.title AS book_title,
        customers.name AS customer_name,
        loans.loan_date,
        loans.due_date
      FROM loans
      INNER JOIN books
        ON books.id = loans.book_id
      INNER JOIN customers
        ON customers.id = loans.customer_id
      WHERE loans.status = 'ACTIVE'
      ORDER BY loans.due_date, books.title;
    `;

    const result =
      await databasePool.query<BorrowedBookDatabaseRow>(
        query,
      );

    return result.rows.map((row) => ({
      loanId: row.loan_id,
      bookId: row.book_id,
      bookTitle: row.book_title,
      customerName: row.customer_name,
      loanDate: new Date(row.loan_date),
      dueDate: this.convertDate(row.due_date),
    }));
  }

  async countBooksByAuthor(): Promise<
    BooksByAuthorReport[]
  > {
    const query = `
      SELECT
        authors.id AS author_id,
        authors.name AS author_name,
        COUNT(books.id) AS book_count
      FROM authors
      LEFT JOIN books
        ON books.author_id = authors.id
      GROUP BY
        authors.id,
        authors.name
      ORDER BY
        book_count DESC,
        authors.name;
    `;

    const result =
      await databasePool.query<BooksByAuthorDatabaseRow>(
        query,
      );

    return result.rows.map((row) => ({
      authorId: row.author_id,
      authorName: row.author_name,
      bookCount: Number(row.book_count),
    }));
  }

  async countLoansByBook(): Promise<
    LoansByBookReport[]
  > {
    const query = `
      SELECT
        books.id AS book_id,
        books.title AS book_title,
        COUNT(loans.id) AS loan_count
      FROM books
      LEFT JOIN loans
        ON loans.book_id = books.id
      GROUP BY
        books.id,
        books.title
      ORDER BY
        loan_count DESC,
        books.title
      LIMIT 10;
    `;

    const result =
      await databasePool.query<LoansByBookDatabaseRow>(
        query,
      );

    return result.rows.map((row) => ({
      bookId: row.book_id,
      bookTitle: row.book_title,
      loanCount: Number(row.loan_count),
    }));
  }

  async findCustomersWithActiveLoans(): Promise<
    CustomerWithActiveLoanReport[]
  > {
    const query = `
      SELECT
        customers.id AS customer_id,
        customers.name AS customer_name,
        customers.email,
        COUNT(loans.id) AS active_loan_count
      FROM customers
      INNER JOIN loans
        ON loans.customer_id = customers.id
        AND loans.status = 'ACTIVE'
      GROUP BY
        customers.id,
        customers.name,
        customers.email
      ORDER BY
        active_loan_count DESC,
        customers.name;
    `;

    const result =
      await databasePool.query<CustomerWithActiveLoanDatabaseRow>(
        query,
      );

    return result.rows.map((row) => ({
      customerId: row.customer_id,
      customerName: row.customer_name,
      email: row.email,
      activeLoanCount: Number(row.active_loan_count),
    }));
  }

  private convertDate(value: Date | string): Date {
    if (value instanceof Date) {
      return value;
    }

    return new Date(`${value}T00:00:00`);
  }
}
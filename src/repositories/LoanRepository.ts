/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Loan Repository
 * Handles database operations related to loans.
 * ---------------------------------------------------------
 */

import { PoolClient } from "pg";
import databasePool from "../database/connection";
import {
  CreateLoanInput,
  Loan,
  LoanStatus,
} from "../models/Loan";

interface LoanDatabaseRow {
  id: number;
  customer_id: number;
  customer_name: string;
  book_id: number;
  book_title: string;
  loan_date: Date | string;
  due_date: Date | string;
  return_date: Date | string | null;
  status: LoanStatus;
}

export class LoanRepository {
  async create(input: CreateLoanInput): Promise<Loan> {
    const client = await databasePool.connect();

    try {
      await client.query("BEGIN");

      const stockWasUpdated = await client.query(
        `
          UPDATE books
          SET stock_quantity = stock_quantity - 1
          WHERE id = $1
            AND stock_quantity > 0;
        `,
        [input.bookId],
      );

      if (stockWasUpdated.rowCount !== 1) {
        throw new Error(
          "The selected book has no available copies.",
        );
      }

      const createdLoan = await client.query<{ id: number }>(
        `
          INSERT INTO loans (
            customer_id,
            book_id,
            due_date,
            status
          )
          VALUES ($1, $2, $3, 'ACTIVE')
          RETURNING id;
        `,
        [input.customerId, input.bookId, input.dueDate],
      );

      const loanId = createdLoan.rows[0]?.id;

      if (!loanId) {
        throw new Error("Could not create the loan.");
      }

      const loan = await this.findByIdUsingClient(
        client,
        loanId,
      );

      if (!loan) {
        throw new Error(
          "Could not retrieve the created loan.",
        );
      }

      await client.query("COMMIT");

      return loan;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll(): Promise<Loan[]> {
    const query = `
      SELECT
        loans.id,
        loans.customer_id,
        customers.name AS customer_name,
        loans.book_id,
        books.title AS book_title,
        loans.loan_date,
        loans.due_date,
        loans.return_date,
        loans.status
      FROM loans
      INNER JOIN customers
        ON customers.id = loans.customer_id
      INNER JOIN books
        ON books.id = loans.book_id
      ORDER BY loans.loan_date DESC;
    `;

    const result =
      await databasePool.query<LoanDatabaseRow>(query);

    return result.rows.map((row) =>
      this.mapRowToLoan(row),
    );
  }

  async findById(id: number): Promise<Loan | null> {
    const query = `
      SELECT
        loans.id,
        loans.customer_id,
        customers.name AS customer_name,
        loans.book_id,
        books.title AS book_title,
        loans.loan_date,
        loans.due_date,
        loans.return_date,
        loans.status
      FROM loans
      INNER JOIN customers
        ON customers.id = loans.customer_id
      INNER JOIN books
        ON books.id = loans.book_id
      WHERE loans.id = $1;
    `;

    const result =
      await databasePool.query<LoanDatabaseRow>(
        query,
        [id],
      );

    const row = result.rows[0];

    return row ? this.mapRowToLoan(row) : null;
  }

  async registerReturn(id: number): Promise<Loan | null> {
    const client = await databasePool.connect();

    try {
      await client.query("BEGIN");

      const returnedLoan = await client.query<{
        book_id: number;
      }>(
        `
          UPDATE loans
          SET
            return_date = CURRENT_TIMESTAMP,
            status = 'RETURNED'
          WHERE id = $1
            AND status = 'ACTIVE'
          RETURNING book_id;
        `,
        [id],
      );

      const bookId = returnedLoan.rows[0]?.book_id;

      if (!bookId) {
        await client.query("ROLLBACK");
        return null;
      }

      await client.query(
        `
          UPDATE books
          SET stock_quantity = stock_quantity + 1
          WHERE id = $1;
        `,
        [bookId],
      );

      const loan = await this.findByIdUsingClient(
        client,
        id,
      );

      if (!loan) {
        throw new Error(
          "Could not retrieve the returned loan.",
        );
      }

      await client.query("COMMIT");

      return loan;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  private async findByIdUsingClient(
    client: PoolClient,
    id: number,
  ): Promise<Loan | null> {
    const query = `
      SELECT
        loans.id,
        loans.customer_id,
        customers.name AS customer_name,
        loans.book_id,
        books.title AS book_title,
        loans.loan_date,
        loans.due_date,
        loans.return_date,
        loans.status
      FROM loans
      INNER JOIN customers
        ON customers.id = loans.customer_id
      INNER JOIN books
        ON books.id = loans.book_id
      WHERE loans.id = $1;
    `;

    const result = await client.query<LoanDatabaseRow>(
      query,
      [id],
    );

    const row = result.rows[0];

    return row ? this.mapRowToLoan(row) : null;
  }

  private mapRowToLoan(row: LoanDatabaseRow): Loan {
    return {
      id: row.id,
      customerId: row.customer_id,
      customerName: row.customer_name,
      bookId: row.book_id,
      bookTitle: row.book_title,
      loanDate: new Date(row.loan_date),
      dueDate: this.convertDate(row.due_date),
      returnDate: row.return_date
        ? new Date(row.return_date)
        : null,
      status: row.status,
    };
  }

  private convertDate(value: Date | string): Date {
    if (value instanceof Date) {
      return value;
    }

    return new Date(`${value}T00:00:00`);
  }
}
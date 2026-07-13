/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Book Repository
 * Handles database operations related to books.
 * ---------------------------------------------------------
 */

import databasePool from "../database/connection";
import {
  Book,
  CreateBookInput,
  UpdateBookInput,
} from "../models/Book";

interface BookDatabaseRow {
  id: number;
  title: string;
  isbn: string;
  publication_year: number;
  stock_quantity: number;
  author_id: number;
  author_name?: string;
}

export class BookRepository {
  async create(input: CreateBookInput): Promise<Book> {
    const query = `
      INSERT INTO books (
        title,
        isbn,
        publication_year,
        stock_quantity,
        author_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        title,
        isbn,
        publication_year,
        stock_quantity,
        author_id;
    `;

    const values = [
      input.title,
      input.isbn,
      input.publicationYear,
      input.stockQuantity,
      input.authorId,
    ];

    const result =
      await databasePool.query<BookDatabaseRow>(
        query,
        values,
      );

    return this.mapRowToBook(result.rows[0]);
  }

  async findAll(): Promise<Book[]> {
    const query = `
      SELECT
        books.id,
        books.title,
        books.isbn,
        books.publication_year,
        books.stock_quantity,
        books.author_id,
        authors.name AS author_name
      FROM books
      INNER JOIN authors
        ON authors.id = books.author_id
      ORDER BY books.title;
    `;

    const result =
      await databasePool.query<BookDatabaseRow>(query);

    return result.rows.map((row) =>
      this.mapRowToBook(row),
    );
  }

  async findById(id: number): Promise<Book | null> {
    const query = `
      SELECT
        books.id,
        books.title,
        books.isbn,
        books.publication_year,
        books.stock_quantity,
        books.author_id,
        authors.name AS author_name
      FROM books
      INNER JOIN authors
        ON authors.id = books.author_id
      WHERE books.id = $1;
    `;

    const result =
      await databasePool.query<BookDatabaseRow>(
        query,
        [id],
      );

    const row = result.rows[0];

    return row ? this.mapRowToBook(row) : null;
  }

  async update(
    id: number,
    input: UpdateBookInput,
  ): Promise<Book | null> {
    const query = `
      UPDATE books
      SET
        title = $1,
        isbn = $2,
        publication_year = $3,
        stock_quantity = $4,
        author_id = $5
      WHERE id = $6
      RETURNING
        id,
        title,
        isbn,
        publication_year,
        stock_quantity,
        author_id;
    `;

    const values = [
      input.title,
      input.isbn,
      input.publicationYear,
      input.stockQuantity,
      input.authorId,
      id,
    ];

    const result =
      await databasePool.query<BookDatabaseRow>(
        query,
        values,
      );

    const row = result.rows[0];

    return row ? this.mapRowToBook(row) : null;
  }

  async delete(id: number): Promise<boolean> {
    const query = `
      DELETE FROM books
      WHERE id = $1;
    `;

    const result = await databasePool.query(query, [id]);

    return result.rowCount === 1;
  }

  private mapRowToBook(row: BookDatabaseRow): Book {
    return {
      id: row.id,
      title: row.title,
      isbn: row.isbn,
      publicationYear: row.publication_year,
      stockQuantity: row.stock_quantity,
      authorId: row.author_id,
      authorName: row.author_name,
    };
  }
}
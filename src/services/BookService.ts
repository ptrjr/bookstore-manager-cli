/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Book Service
 * Handles business rules related to books.
 * ---------------------------------------------------------
 */

import { DatabaseError } from "pg";
import {
  Book,
  CreateBookInput,
  UpdateBookInput,
} from "../models/Book";
import { AuthorRepository } from "../repositories/AuthorRepository";
import { BookRepository } from "../repositories/BookRepository";

export class BookService {
  private readonly bookRepository: BookRepository;
  private readonly authorRepository: AuthorRepository;

  constructor(
    bookRepository = new BookRepository(),
    authorRepository = new AuthorRepository(),
  ) {
    this.bookRepository = bookRepository;
    this.authorRepository = authorRepository;
  }

  async create(input: CreateBookInput): Promise<Book> {
    const validatedInput =
      await this.validateBookInput(input);

    try {
      return await this.bookRepository.create(
        validatedInput,
      );
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }

  async findById(id: number): Promise<Book> {
    this.validateId(id);

    const book = await this.bookRepository.findById(id);

    if (!book) {
      throw new Error("Book not found.");
    }

    return book;
  }

  async update(
    id: number,
    input: UpdateBookInput,
  ): Promise<Book> {
    this.validateId(id);

    const validatedInput =
      await this.validateBookInput(input);

    try {
      const updatedBook =
        await this.bookRepository.update(
          id,
          validatedInput,
        );

      if (!updatedBook) {
        throw new Error("Book not found.");
      }

      return updatedBook;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async delete(id: number): Promise<void> {
    this.validateId(id);

    try {
      const bookWasDeleted =
        await this.bookRepository.delete(id);

      if (!bookWasDeleted) {
        throw new Error("Book not found.");
      }
    } catch (error) {
      if (
        error instanceof DatabaseError &&
        error.code === "23503"
      ) {
        throw new Error(
          "Cannot delete this book because there are loans associated with it.",
        );
      }

      throw error;
    }
  }

  private async validateBookInput(
    input: CreateBookInput | UpdateBookInput,
  ): Promise<CreateBookInput> {
    const authorId = this.validateId(
      input.authorId,
      "Author ID",
    );

    const author =
      await this.authorRepository.findById(authorId);

    if (!author) {
      throw new Error("Author not found.");
    }

    return {
      title: this.validateTitle(input.title),
      isbn: this.validateIsbn(input.isbn),
      publicationYear: this.validatePublicationYear(
        input.publicationYear,
      ),
      stockQuantity: this.validateStockQuantity(
        input.stockQuantity,
      ),
      authorId,
    };
  }

  private validateId(
    id: number,
    fieldName = "Book ID",
  ): number {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        `${fieldName} must be a positive integer.`,
      );
    }

    return id;
  }

  private validateTitle(title: string): string {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      throw new Error("Book title is required.");
    }

    if (normalizedTitle.length > 150) {
      throw new Error(
        "Book title must contain at most 150 characters.",
      );
    }

    return normalizedTitle;
  }

  private validateIsbn(isbn: string): string {
    const normalizedIsbn = isbn
      .trim()
      .replace(/[-\s]/g, "");

    if (!normalizedIsbn) {
      throw new Error("ISBN is required.");
    }

    if (!/^\d{10}(\d{3})?$/.test(normalizedIsbn)) {
      throw new Error(
        "ISBN must contain exactly 10 or 13 digits.",
      );
    }

    return normalizedIsbn;
  }

  private validatePublicationYear(year: number): number {
    const currentYear = new Date().getFullYear();

    if (!Number.isInteger(year)) {
      throw new Error(
        "Publication year must be an integer.",
      );
    }

    if (year < 1000 || year > currentYear) {
      throw new Error(
        `Publication year must be between 1000 and ${currentYear}.`,
      );
    }

    return year;
  }

  private validateStockQuantity(
    quantity: number,
  ): number {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error(
        "Stock quantity must be a non-negative integer.",
      );
    }

    return quantity;
  }

  private handleDatabaseError(error: unknown): never {
    if (
      error instanceof DatabaseError &&
      error.code === "23505"
    ) {
      throw new Error(
        "A book with this ISBN is already registered.",
      );
    }

    if (
      error instanceof DatabaseError &&
      error.code === "23503"
    ) {
      throw new Error("Author not found.");
    }

    throw error;
  }
}
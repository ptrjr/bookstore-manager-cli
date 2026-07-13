/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Book Controller
 * Handles terminal interaction related to books.
 * ---------------------------------------------------------
 */

import { Interface } from "node:readline/promises";
import { Book } from "../models/Book";
import { BookService } from "../services/BookService";

export class BookController {
  private readonly terminal: Interface;
  private readonly bookService: BookService;

  constructor(
    terminal: Interface,
    bookService = new BookService(),
  ) {
    this.terminal = terminal;
    this.bookService = bookService;
  }

  async create(): Promise<void> {
    await this.executeAction(async () => {
      const title =
        await this.terminal.question("Book title: ");

      const isbn =
        await this.terminal.question("ISBN: ");

      const publicationYear =
        await this.readNumber("Publication year: ");

      const stockQuantity =
        await this.readNumber("Stock quantity: ");

      const authorId =
        await this.readNumber("Author ID: ");

      const book = await this.bookService.create({
        title,
        isbn,
        publicationYear,
        stockQuantity,
        authorId,
      });

      console.log("\nBook successfully registered.");
      this.displayBook(book);
    });
  }

  async listAll(): Promise<void> {
    await this.executeAction(async () => {
      const books = await this.bookService.findAll();

      if (books.length === 0) {
        console.log("\nNo books registered.");
        return;
      }

      console.log("\nRegistered books:");

      console.table(
        books.map((book) => ({
          ID: book.id,
          Title: book.title,
          ISBN: book.isbn,
          "Publication year": book.publicationYear,
          Stock: book.stockQuantity,
          Author: book.authorName ?? book.authorId,
        })),
      );
    });
  }

  async findById(): Promise<void> {
    await this.executeAction(async () => {
      const id = await this.readNumber("Book ID: ");

      const book = await this.bookService.findById(id);

      console.log("\nBook found:");
      this.displayBook(book);
    });
  }

  async update(): Promise<void> {
    await this.executeAction(async () => {
      const id = await this.readNumber("Book ID: ");

      const currentBook =
        await this.bookService.findById(id);

      console.log("\nCurrent book information:");
      this.displayBook(currentBook);

      const title = await this.terminal.question(
        `New title [${currentBook.title}]: `,
      );

      const isbn = await this.terminal.question(
        `New ISBN [${currentBook.isbn}]: `,
      );

      const publicationYear =
        await this.terminal.question(
          `New publication year [${currentBook.publicationYear}]: `,
        );

      const stockQuantity =
        await this.terminal.question(
          `New stock quantity [${currentBook.stockQuantity}]: `,
        );

      const authorId =
        await this.terminal.question(
          `New author ID [${currentBook.authorId}]: `,
        );

      const updatedBook =
        await this.bookService.update(id, {
          title: title.trim() || currentBook.title,
          isbn: isbn.trim() || currentBook.isbn,
          publicationYear: this.useCurrentNumberWhenEmpty(
            publicationYear,
            currentBook.publicationYear,
          ),
          stockQuantity: this.useCurrentNumberWhenEmpty(
            stockQuantity,
            currentBook.stockQuantity,
          ),
          authorId: this.useCurrentNumberWhenEmpty(
            authorId,
            currentBook.authorId,
          ),
        });

      console.log("\nBook successfully updated.");
      this.displayBook(updatedBook);
    });
  }

  async delete(): Promise<void> {
    await this.executeAction(async () => {
      const id = await this.readNumber("Book ID: ");

      const book = await this.bookService.findById(id);

      console.log("\nBook selected for deletion:");
      this.displayBook(book);

      const confirmation =
        await this.terminal.question(
          "\nConfirm deletion? (y/n): ",
        );

      if (
        confirmation.trim().toLowerCase() !== "y"
      ) {
        console.log("\nDeletion cancelled.");
        return;
      }

      await this.bookService.delete(id);

      console.log("\nBook successfully deleted.");
    });
  }

  private async readNumber(
    message: string,
  ): Promise<number> {
    const answer =
      await this.terminal.question(message);

    return Number(answer);
  }

  private useCurrentNumberWhenEmpty(
    answer: string,
    currentValue: number,
  ): number {
    const normalizedAnswer = answer.trim();

    if (!normalizedAnswer) {
      return currentValue;
    }

    return Number(normalizedAnswer);
  }

  private displayBook(book: Book): void {
    console.table([
      {
        ID: book.id,
        Title: book.title,
        ISBN: book.isbn,
        "Publication year": book.publicationYear,
        Stock: book.stockQuantity,
        "Author ID": book.authorId,
        Author: book.authorName ?? "Not loaded",
      },
    ]);
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

      console.error(`\nError: ${message}`);
    }
  }
}
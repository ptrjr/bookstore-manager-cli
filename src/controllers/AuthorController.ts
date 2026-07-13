/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Author Controller
 * Handles terminal interaction related to authors.
 * ---------------------------------------------------------
 */

import { Interface } from "node:readline/promises";
import { Author } from "../models/Author";
import { AuthorService } from "../services/AuthorService";

export class AuthorController {
  private readonly authorService: AuthorService;
  private readonly terminal: Interface;

  constructor(
    terminal: Interface,
    authorService = new AuthorService(),
  ) {
    this.terminal = terminal;
    this.authorService = authorService;
  }

  async create(): Promise<void> {
    await this.executeAction(async () => {
      const name = await this.terminal.question(
        "Author name: ",
      );

      const nationality = await this.terminal.question(
        "Nationality (optional): ",
      );

      const author = await this.authorService.create({
        name,
        nationality,
      });

      console.log("\nAuthor successfully registered.");
      this.displayAuthor(author);
    });
  }

  async listAll(): Promise<void> {
    await this.executeAction(async () => {
      const authors = await this.authorService.findAll();

      if (authors.length === 0) {
        console.log("\nNo authors registered.");
        return;
      }

      console.log("\nRegistered authors:");

      console.table(
        authors.map((author) => ({
          ID: author.id,
          Name: author.name,
          Nationality: author.nationality ?? "Not provided",
        })),
      );
    });
  }

  async findById(): Promise<void> {
    await this.executeAction(async () => {
      const id = await this.readAuthorId();

      const author = await this.authorService.findById(id);

      console.log("\nAuthor found:");
      this.displayAuthor(author);
    });
  }

  async update(): Promise<void> {
    await this.executeAction(async () => {
      const id = await this.readAuthorId();

      const currentAuthor =
        await this.authorService.findById(id);

      console.log("\nCurrent author information:");
      this.displayAuthor(currentAuthor);

      const name = await this.terminal.question(
        `New name [${currentAuthor.name}]: `,
      );

      const nationality = await this.terminal.question(
        `New nationality [${currentAuthor.nationality ?? "not provided"}]: `,
      );

      const updatedAuthor = await this.authorService.update(
        id,
        {
          name: name.trim() || currentAuthor.name,
          nationality: this.resolveNationality(
            nationality,
            currentAuthor.nationality,
          ),
        },
      );

      console.log("\nAuthor successfully updated.");
      this.displayAuthor(updatedAuthor);
    });
  }

  async delete(): Promise<void> {
    await this.executeAction(async () => {
      const id = await this.readAuthorId();

      const author = await this.authorService.findById(id);

      console.log("\nAuthor selected for deletion:");
      this.displayAuthor(author);

      const confirmation = await this.terminal.question(
        "\nConfirm deletion? (y/n): ",
      );

      if (confirmation.trim().toLowerCase() !== "y") {
        console.log("\nDeletion cancelled.");
        return;
      }

      await this.authorService.delete(id);

      console.log("\nAuthor successfully deleted.");
    });
  }

  private async readAuthorId(): Promise<number> {
    const answer = await this.terminal.question(
      "Author ID: ",
    );

    return Number(answer);
  }

  private resolveNationality(
    answer: string,
    currentNationality: string | null,
  ): string | null {
    const normalizedAnswer = answer.trim();

    if (!normalizedAnswer) {
      return currentNationality;
    }

    if (normalizedAnswer.toLowerCase() === "null") {
      return null;
    }

    return normalizedAnswer;
  }

  private displayAuthor(author: Author): void {
    console.table([
      {
        ID: author.id,
        Name: author.name,
        Nationality:
          author.nationality ?? "Not provided",
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
/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Author Service
 * Handles business rules related to authors.
 * ---------------------------------------------------------
 */

import { DatabaseError } from "pg";
import {
  Author,
  CreateAuthorInput,
  UpdateAuthorInput,
} from "../models/Author";
import { AuthorRepository } from "../repositories/AuthorRepository";

export class AuthorService {
  private readonly authorRepository: AuthorRepository;

  constructor(authorRepository = new AuthorRepository()) {
    this.authorRepository = authorRepository;
  }

  async create(input: CreateAuthorInput): Promise<Author> {
    const name = this.validateName(input.name);
    const nationality = this.normalizeNationality(
      input.nationality,
    );

    try {
      return await this.authorRepository.create({
        name,
        nationality,
      });
    } catch (error) {
      if (
        error instanceof DatabaseError &&
        error.code === "23505"
      ) {
        throw new Error(
          "An author with this name is already registered.",
        );
      }

      throw error;
    }
  }

  async findAll(): Promise<Author[]> {
    return this.authorRepository.findAll();
  }

  async findById(id: number): Promise<Author> {
    this.validateId(id);

    const author = await this.authorRepository.findById(id);

    if (!author) {
      throw new Error("Author not found.");
    }

    return author;
  }

  async update(
    id: number,
    input: UpdateAuthorInput,
  ): Promise<Author> {
    this.validateId(id);

    const name = this.validateName(input.name);
    const nationality = this.normalizeNationality(
      input.nationality,
    );

    try {
      const updatedAuthor =
        await this.authorRepository.update(id, {
          name,
          nationality,
        });

      if (!updatedAuthor) {
        throw new Error("Author not found.");
      }

      return updatedAuthor;
    } catch (error) {
      if (
        error instanceof DatabaseError &&
        error.code === "23505"
      ) {
        throw new Error(
          "An author with this name is already registered.",
        );
      }

      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    this.validateId(id);

    try {
      const authorWasDeleted =
        await this.authorRepository.delete(id);

      if (!authorWasDeleted) {
        throw new Error("Author not found.");
      }
    } catch (error) {
      if (
        error instanceof DatabaseError &&
        error.code === "23503"
      ) {
        throw new Error(
          "Cannot delete this author because there are books associated with them.",
        );
      }

      throw error;
    }
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        "Author ID must be a positive integer.",
      );
    }
  }

  private validateName(name: string): string {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new Error("Author name is required.");
    }

    if (normalizedName.length > 100) {
      throw new Error(
        "Author name must contain at most 100 characters.",
      );
    }

    return normalizedName;
  }

  private normalizeNationality(
    nationality?: string | null,
  ): string | null {
    if (
      nationality === undefined ||
      nationality === null
    ) {
      return null;
    }

    const normalizedNationality = nationality.trim();

    if (!normalizedNationality) {
      return null;
    }

    if (normalizedNationality.length > 50) {
      throw new Error(
        "Author nationality must contain at most 50 characters.",
      );
    }

    return normalizedNationality;
  }
}
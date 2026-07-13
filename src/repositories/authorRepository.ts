/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Author Repository
 * Handles database operations related to authors.
 * ---------------------------------------------------------
 */

import databasePool from "../database/connection";
import {
  Author,
  CreateAuthorInput,
  UpdateAuthorInput,
} from "../models/authors";

export class AuthorRepository {
  async create(input: CreateAuthorInput): Promise<Author> {
    const query = `
      INSERT INTO authors (name, nationality)
      VALUES ($1, $2)
      RETURNING id, name, nationality;
    `;

    const values = [
      input.name,
      input.nationality ?? null,
    ];

    const result = await databasePool.query<Author>(query, values);

    return result.rows[0];
  }

  async findAll(): Promise<Author[]> {
    const query = `
      SELECT id, name, nationality
      FROM authors
      ORDER BY name;
    `;

    const result = await databasePool.query<Author>(query);

    return result.rows;
  }

  async findById(id: number): Promise<Author | null> {
    const query = `
      SELECT id, name, nationality
      FROM authors
      WHERE id = $1;
    `;

    const result = await databasePool.query<Author>(query, [id]);

    return result.rows[0] ?? null;
  }

  async update(
    id: number,
    input: UpdateAuthorInput,
  ): Promise<Author | null> {
    const query = `
      UPDATE authors
      SET name = $1,
          nationality = $2
      WHERE id = $3
      RETURNING id, name, nationality;
    `;

    const values = [
      input.name,
      input.nationality ?? null,
      id,
    ];

    const result = await databasePool.query<Author>(query, values);

    return result.rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const query = `
      DELETE FROM authors
      WHERE id = $1;
    `;

    const result = await databasePool.query(query, [id]);

    return result.rowCount === 1;
  }
}
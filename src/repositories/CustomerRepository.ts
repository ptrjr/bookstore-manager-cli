/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Customer Repository
 * Handles database operations related to customers.
 * ---------------------------------------------------------
 */

import databasePool from "../database/connection";
import {
  CreateCustomerInput,
  Customer,
  UpdateCustomerInput,
} from "../models/Customer";

export class CustomerRepository {
  async create(
    input: CreateCustomerInput,
  ): Promise<Customer> {
    const query = `
      INSERT INTO customers (
        name,
        email,
        phone
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        name,
        email,
        phone;
    `;

    const values = [
      input.name,
      input.email,
      input.phone ?? null,
    ];

    const result = await databasePool.query<Customer>(
      query,
      values,
    );

    return result.rows[0];
  }

  async findAll(): Promise<Customer[]> {
    const query = `
      SELECT
        id,
        name,
        email,
        phone
      FROM customers
      ORDER BY name;
    `;

    const result =
      await databasePool.query<Customer>(query);

    return result.rows;
  }

  async findById(id: number): Promise<Customer | null> {
    const query = `
      SELECT
        id,
        name,
        email,
        phone
      FROM customers
      WHERE id = $1;
    `;

    const result = await databasePool.query<Customer>(
      query,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async update(
    id: number,
    input: UpdateCustomerInput,
  ): Promise<Customer | null> {
    const query = `
      UPDATE customers
      SET
        name = $1,
        email = $2,
        phone = $3
      WHERE id = $4
      RETURNING
        id,
        name,
        email,
        phone;
    `;

    const values = [
      input.name,
      input.email,
      input.phone ?? null,
      id,
    ];

    const result = await databasePool.query<Customer>(
      query,
      values,
    );

    return result.rows[0] ?? null;
  }

  async delete(id: number): Promise<boolean> {
    const query = `
      DELETE FROM customers
      WHERE id = $1;
    `;

    const result = await databasePool.query(query, [id]);

    return result.rowCount === 1;
  }
}
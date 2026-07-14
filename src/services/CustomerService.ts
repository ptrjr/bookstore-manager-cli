/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Customer Service
 * Handles business rules related to customers.
 * ---------------------------------------------------------
 */

import { DatabaseError } from "pg";
import {
  CreateCustomerInput,
  Customer,
  UpdateCustomerInput,
} from "../models/Customer";
import { CustomerRepository } from "../repositories/CustomerRepository";

export class CustomerService {
  private readonly customerRepository: CustomerRepository;

  constructor(
    customerRepository = new CustomerRepository(),
  ) {
    this.customerRepository = customerRepository;
  }

  async create(
    input: CreateCustomerInput,
  ): Promise<Customer> {
    const customerData = this.validateCustomerInput(input);

    try {
      return await this.customerRepository.create(
        customerData,
      );
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.findAll();
  }

  async findById(id: number): Promise<Customer> {
    this.validateId(id);

    const customer =
      await this.customerRepository.findById(id);

    if (!customer) {
      throw new Error("Customer not found.");
    }

    return customer;
  }

  async update(
    id: number,
    input: UpdateCustomerInput,
  ): Promise<Customer> {
    this.validateId(id);

    const customerData = this.validateCustomerInput(input);

    try {
      const updatedCustomer =
        await this.customerRepository.update(
          id,
          customerData,
        );

      if (!updatedCustomer) {
        throw new Error("Customer not found.");
      }

      return updatedCustomer;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async delete(id: number): Promise<void> {
    this.validateId(id);

    try {
      const customerWasDeleted =
        await this.customerRepository.delete(id);

      if (!customerWasDeleted) {
        throw new Error("Customer not found.");
      }
    } catch (error) {
      if (
        error instanceof DatabaseError &&
        error.code === "23503"
      ) {
        throw new Error(
          "Cannot delete this customer because there are loans associated with them.",
        );
      }

      throw error;
    }
  }

  private validateCustomerInput(
    input: CreateCustomerInput | UpdateCustomerInput,
  ): CreateCustomerInput {
    return {
      name: this.validateName(input.name),
      email: this.validateEmail(input.email),
      phone: this.normalizePhone(input.phone),
    };
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        "Customer ID must be a positive integer.",
      );
    }
  }

  private validateName(name: string): string {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new Error("Customer name is required.");
    }

    if (normalizedName.length > 100) {
      throw new Error(
        "Customer name must contain at most 100 characters.",
      );
    }

    return normalizedName;
  }

  private validateEmail(email: string): string {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new Error("Customer email is required.");
    }

    if (normalizedEmail.length > 150) {
      throw new Error(
        "Customer email must contain at most 150 characters.",
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      throw new Error("Customer email is invalid.");
    }

    return normalizedEmail;
  }

  private normalizePhone(
    phone?: string | null,
  ): string | null {
    if (phone === undefined || phone === null) {
      return null;
    }

    const normalizedPhone = phone.trim();

    if (!normalizedPhone) {
      return null;
    }

    if (normalizedPhone.length > 20) {
      throw new Error(
        "Customer phone must contain at most 20 characters.",
      );
    }

    return normalizedPhone;
  }

  private handleDatabaseError(error: unknown): never {
    if (
      error instanceof DatabaseError &&
      error.code === "23505"
    ) {
      throw new Error(
        "A customer with this email is already registered.",
      );
    }

    throw error;
  }
}
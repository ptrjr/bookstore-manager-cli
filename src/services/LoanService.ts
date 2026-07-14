/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Loan Service
 * Handles business rules related to loans.
 * ---------------------------------------------------------
 */

import {
  CreateLoanInput,
  Loan,
} from "../models/Loan";
import { BookRepository } from "../repositories/BookRepository";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { LoanRepository } from "../repositories/LoanRepository";

export class LoanService {
  private readonly loanRepository: LoanRepository;
  private readonly bookRepository: BookRepository;
  private readonly customerRepository: CustomerRepository;

  constructor(
    loanRepository = new LoanRepository(),
    bookRepository = new BookRepository(),
    customerRepository = new CustomerRepository(),
  ) {
    this.loanRepository = loanRepository;
    this.bookRepository = bookRepository;
    this.customerRepository = customerRepository;
  }

  async create(input: CreateLoanInput): Promise<Loan> {
    const customerId = this.validateId(
      input.customerId,
      "Customer ID",
    );

    const bookId = this.validateId(
      input.bookId,
      "Book ID",
    );

    const dueDate = this.validateDueDate(input.dueDate);

    const customer =
      await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new Error("Customer not found.");
    }

    const book = await this.bookRepository.findById(bookId);

    if (!book) {
      throw new Error("Book not found.");
    }

    if (book.stockQuantity <= 0) {
      throw new Error(
        "The selected book has no available copies.",
      );
    }

    return this.loanRepository.create({
      customerId,
      bookId,
      dueDate,
    });
  }

  async findAll(): Promise<Loan[]> {
    return this.loanRepository.findAll();
  }

  async findById(id: number): Promise<Loan> {
    this.validateId(id, "Loan ID");

    const loan = await this.loanRepository.findById(id);

    if (!loan) {
      throw new Error("Loan not found.");
    }

    return loan;
  }

  async registerReturn(id: number): Promise<Loan> {
    this.validateId(id, "Loan ID");

    const currentLoan =
      await this.loanRepository.findById(id);

    if (!currentLoan) {
      throw new Error("Loan not found.");
    }

    if (currentLoan.status === "RETURNED") {
      throw new Error(
        "This loan has already been returned.",
      );
    }

    const returnedLoan =
      await this.loanRepository.registerReturn(id);

    if (!returnedLoan) {
      throw new Error(
        "The loan could not be returned because it is no longer active.",
      );
    }

    return returnedLoan;
  }

  private validateId(
    id: number,
    fieldName: string,
  ): number {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(
        `${fieldName} must be a positive integer.`,
      );
    }

    return id;
  }

  private validateDueDate(dueDate: string): string {
    const normalizedDate = dueDate.trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
      throw new Error(
        "Due date must use the format YYYY-MM-DD.",
      );
    }

    const parsedDate = new Date(
      `${normalizedDate}T00:00:00`,
    );

    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error("Due date is invalid.");
    }

    const parts = normalizedDate
      .split("-")
      .map(Number);

    const [year, month, day] = parts;

    if (
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() + 1 !== month ||
      parsedDate.getDate() !== day
    ) {
      throw new Error("Due date is invalid.");
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (parsedDate < today) {
      throw new Error(
        "Due date cannot be earlier than today.",
      );
    }

    return normalizedDate;
  }
}
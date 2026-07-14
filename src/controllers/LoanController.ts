/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Loan Controller
 * Handles terminal interaction related to loans.
 * ---------------------------------------------------------
 */

import { Interface } from "node:readline/promises";
import { Loan } from "../models/Loan";
import { LoanService } from "../services/LoanService";

export class LoanController {
  private readonly terminal: Interface;
  private readonly loanService: LoanService;

  constructor(
    terminal: Interface,
    loanService = new LoanService(),
  ) {
    this.terminal = terminal;
    this.loanService = loanService;
  }

  async create(): Promise<void> {
    await this.executeAction(async () => {
      const customerId = await this.readNumber(
        "Customer ID: ",
      );

      const bookId = await this.readNumber("Book ID: ");

      const dueDate = await this.terminal.question(
        "Due date (YYYY-MM-DD): ",
      );

      const loan = await this.loanService.create({
        customerId,
        bookId,
        dueDate,
      });

      console.log("\nLoan successfully registered.");
      this.displayLoan(loan);
    });
  }

  async listAll(): Promise<void> {
    await this.executeAction(async () => {
      const loans = await this.loanService.findAll();

      if (loans.length === 0) {
        console.log("\nNo loans registered.");
        return;
      }

      console.log("\nRegistered loans:");

      console.table(
        loans.map((loan) => ({
          ID: loan.id,
          Customer: loan.customerName,
          Book: loan.bookTitle,
          "Loan date": this.formatDate(loan.loanDate),
          "Due date": this.formatDate(loan.dueDate),
          "Return date": loan.returnDate
            ? this.formatDate(loan.returnDate)
            : "Not returned",
          Status: loan.status,
        })),
      );
    });
  }

  async findById(): Promise<void> {
    await this.executeAction(async () => {
      const id = await this.readNumber("Loan ID: ");

      const loan = await this.loanService.findById(id);

      console.log("\nLoan found:");
      this.displayLoan(loan);
    });
  }

  async registerReturn(): Promise<void> {
    await this.executeAction(async () => {
      const id = await this.readNumber("Loan ID: ");

      const currentLoan =
        await this.loanService.findById(id);

      console.log("\nLoan selected for return:");
      this.displayLoan(currentLoan);

      const confirmation =
        await this.terminal.question(
          "\nConfirm book return? (y/n): ",
        );

      if (
        confirmation.trim().toLowerCase() !== "y"
      ) {
        console.log("\nReturn cancelled.");
        return;
      }

      const returnedLoan =
        await this.loanService.registerReturn(id);

      console.log("\nBook successfully returned.");
      this.displayLoan(returnedLoan);
    });
  }

  private async readNumber(
    message: string,
  ): Promise<number> {
    const answer =
      await this.terminal.question(message);

    return Number(answer);
  }

  private displayLoan(loan: Loan): void {
    console.table([
      {
        ID: loan.id,
        "Customer ID": loan.customerId,
        Customer: loan.customerName,
        "Book ID": loan.bookId,
        Book: loan.bookTitle,
        "Loan date": this.formatDate(loan.loanDate),
        "Due date": this.formatDate(loan.dueDate),
        "Return date": loan.returnDate
          ? this.formatDate(loan.returnDate)
          : "Not returned",
        Status: loan.status,
      },
    ]);
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
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
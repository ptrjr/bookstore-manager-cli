/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Customer Controller
 * Handles terminal interaction related to customers.
 * ---------------------------------------------------------
 */

import { Interface } from "node:readline/promises";
import { Customer } from "../models/Customer";
import { CustomerService } from "../services/CustomerService";

export class CustomerController {
  private readonly terminal: Interface;
  private readonly customerService: CustomerService;

  constructor(
    terminal: Interface,
    customerService = new CustomerService(),
  ) {
    this.terminal = terminal;
    this.customerService = customerService;
  }

  async create(): Promise<void> {
    await this.executeAction(async () => {
      const name = await this.terminal.question(
        "Customer name: ",
      );

      const email = await this.terminal.question(
        "Customer email: ",
      );

      const phone = await this.terminal.question(
        "Customer phone (optional): ",
      );

      const customer =
        await this.customerService.create({
          name,
          email,
          phone,
        });

      console.log(
        "\nCustomer successfully registered.",
      );

      this.displayCustomer(customer);
    });
  }

  async listAll(): Promise<void> {
    await this.executeAction(async () => {
      const customers =
        await this.customerService.findAll();

      if (customers.length === 0) {
        console.log("\nNo customers registered.");
        return;
      }

      console.log("\nRegistered customers:");

      console.table(
        customers.map((customer) => ({
          ID: customer.id,
          Name: customer.name,
          Email: customer.email,
          Phone: customer.phone ?? "Not provided",
        })),
      );
    });
  }

  async findById(): Promise<void> {
    await this.executeAction(async () => {
      const id = await this.readCustomerId();

      const customer =
        await this.customerService.findById(id);

      console.log("\nCustomer found:");
      this.displayCustomer(customer);
    });
  }

  async update(): Promise<void> {
    await this.executeAction(async () => {
      const id = await this.readCustomerId();

      const currentCustomer =
        await this.customerService.findById(id);

      console.log("\nCurrent customer information:");
      this.displayCustomer(currentCustomer);

      const name = await this.terminal.question(
        `New name [${currentCustomer.name}]: `,
      );

      const email = await this.terminal.question(
        `New email [${currentCustomer.email}]: `,
      );

      const phone = await this.terminal.question(
        `New phone [${
          currentCustomer.phone ?? "not provided"
        }]: `,
      );

      const updatedCustomer =
        await this.customerService.update(id, {
          name: name.trim() || currentCustomer.name,
          email: email.trim() || currentCustomer.email,
          phone: this.resolvePhone(
            phone,
            currentCustomer.phone,
          ),
        });

      console.log(
        "\nCustomer successfully updated.",
      );

      this.displayCustomer(updatedCustomer);
    });
  }

  async delete(): Promise<void> {
    await this.executeAction(async () => {
      const id = await this.readCustomerId();

      const customer =
        await this.customerService.findById(id);

      console.log(
        "\nCustomer selected for deletion:",
      );

      this.displayCustomer(customer);

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

      await this.customerService.delete(id);

      console.log(
        "\nCustomer successfully deleted.",
      );
    });
  }

  private async readCustomerId(): Promise<number> {
    const answer = await this.terminal.question(
      "Customer ID: ",
    );

    return Number(answer);
  }

  private resolvePhone(
    answer: string,
    currentPhone: string | null,
  ): string | null {
    const normalizedAnswer = answer.trim();

    if (!normalizedAnswer) {
      return currentPhone;
    }

    if (normalizedAnswer.toLowerCase() === "null") {
      return null;
    }

    return normalizedAnswer;
  }

  private displayCustomer(customer: Customer): void {
    console.table([
      {
        ID: customer.id,
        Name: customer.name,
        Email: customer.email,
        Phone: customer.phone ?? "Not provided",
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
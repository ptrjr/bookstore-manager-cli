/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Customer Menu
 * ---------------------------------------------------------
 */

import { CustomerController } from "../controllers/CustomerController";
import { pause, terminal } from "../utils/input";

export class CustomerMenu {
  private readonly customerController: CustomerController;

  constructor(
    customerController = new CustomerController(
      terminal,
    ),
  ) {
    this.customerController = customerController;
  }

  async start(): Promise<void> {
    let option = "";

    while (option !== "0") {
      this.displayMenu();

      option = (
        await terminal.question("Choose an option: ")
      ).trim();

      console.log();

      switch (option) {
        case "1":
          await this.customerController.create();
          await pause();
          break;

        case "2":
          await this.customerController.listAll();
          await pause();
          break;

        case "3":
          await this.customerController.findById();
          await pause();
          break;

        case "4":
          await this.customerController.update();
          await pause();
          break;

        case "5":
          await this.customerController.delete();
          await pause();
          break;

        case "0":
          break;

        default:
          console.log("Invalid option.");
          await pause();
      }
    }
  }

  private displayMenu(): void {
    console.clear();

    console.log("======================================");
    console.log("          CUSTOMERS MENU");
    console.log("======================================");
    console.log();
    console.log("1 - Register customer");
    console.log("2 - List customers");
    console.log("3 - Find customer by ID");
    console.log("4 - Update customer");
    console.log("5 - Delete customer");
    console.log();
    console.log("0 - Return to main menu");
    console.log();
  }
}
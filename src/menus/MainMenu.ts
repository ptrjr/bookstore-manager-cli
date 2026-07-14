/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Main Menu
 * ---------------------------------------------------------
 */

import {
  closeTerminal,
  pause,
  terminal,
} from "../utils/input";
import { AuthorMenu } from "./AuthorMenu";
import { BookMenu } from "./BookMenu";
import { CustomerMenu } from "./CustomerMenu";
import { LoanMenu } from "./LoanMenu";

export class MainMenu {
  private readonly authorMenu: AuthorMenu;
  private readonly bookMenu: BookMenu;
  private readonly customerMenu: CustomerMenu;
  private readonly loanMenu: LoanMenu;

  constructor(
    authorMenu = new AuthorMenu(),
    bookMenu = new BookMenu(),
    customerMenu = new CustomerMenu(),
    loanMenu = new LoanMenu(),
  ) {
    this.authorMenu = authorMenu;
    this.bookMenu = bookMenu;
    this.customerMenu = customerMenu;
    this.loanMenu = loanMenu;
  }

  public async start(): Promise<void> {
    let option = "";

    while (option !== "0") {
      this.displayMenu();

      option = (
        await terminal.question("Choose an option: ")
      ).trim();

      console.log();

      switch (option) {
        case "1":
          await this.authorMenu.start();
          break;

        case "2":
          await this.bookMenu.start();
          break;

        case "3":
          await this.customerMenu.start();
          break;

        case "4":
          await this.loanMenu.start();
          break;

        case "5":
          console.log("Reports menu coming soon...");
          await pause();
          break;

        case "0":
          console.log("Closing application...");
          break;

        default:
          console.log("Invalid option.");
          await pause();
      }
    }

    closeTerminal();
  }

  private displayMenu(): void {
    console.clear();

    console.log("======================================");
    console.log("      BOOKSTORE MANAGER CLI");
    console.log("======================================");
    console.log();
    console.log("1 - Authors");
    console.log("2 - Books");
    console.log("3 - Customers");
    console.log("4 - Loans");
    console.log("5 - Reports");
    console.log();
    console.log("0 - Exit");
    console.log();
    console.log(
      "Important: only one book is allowed per loan.",
    );
    console.log();
  }
}
/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Report Menu
 * ---------------------------------------------------------
 */

import { ReportController } from "../controllers/ReportController";
import { pause, terminal } from "../utils/input";

export class ReportMenu {
  private readonly reportController: ReportController;

  constructor(
    reportController = new ReportController(),
  ) {
    this.reportController = reportController;
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
          await this.reportController.showAvailableBooks();
          await pause();
          break;

        case "2":
          await this.reportController.showBorrowedBooks();
          await pause();
          break;

        case "3":
          await this.reportController.showBooksByAuthor();
          await pause();
          break;

        case "4":
          await this.reportController.showLoansByBook();
          await pause();
          break;

        case "5":
          await this.reportController
            .showCustomersWithActiveLoans();
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
    console.log("            REPORTS MENU");
    console.log("======================================");
    console.log();
    console.log("1 - Available books");
    console.log("2 - Borrowed books");
    console.log("3 - Books registered by author");
    console.log("4 - Number of loans by book");
    console.log("5 - Customers with active loans");
    console.log();
    console.log("0 - Return to main menu");
    console.log();
  }
}
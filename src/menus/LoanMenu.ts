/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Loan Menu
 * ---------------------------------------------------------
 */

import { LoanController } from "../controllers/LoanController";
import { pause, terminal } from "../utils/input";

export class LoanMenu {
  private readonly loanController: LoanController;

  constructor(
    loanController = new LoanController(terminal),
  ) {
    this.loanController = loanController;
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
          await this.loanController.create();
          await pause();
          break;

        case "2":
          await this.loanController.registerReturn();
          await pause();
          break;

        case "3":
          await this.loanController.listAll();
          await pause();
          break;

        case "4":
          await this.loanController.findById();
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
    console.log("             LOANS MENU");
    console.log("======================================");
    console.log();
    console.log("1 - Register loan");
    console.log("2 - Register book return");
    console.log("3 - List loans");
    console.log("4 - Find loan by ID");
    console.log();
    console.log("0 - Return to main menu");
    console.log();
    console.log(
      "Important: only one book is allowed per loan.",
    );
    console.log();
  }
}
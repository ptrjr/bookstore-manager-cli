/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Author Menu
 * ---------------------------------------------------------
 */

import { AuthorController } from "../controllers/AuthorController";
import { pause, terminal } from "../utils/input";

export class AuthorMenu {
  private readonly authorController: AuthorController;

  constructor(
    authorController = new AuthorController(terminal),
  ) {
    this.authorController = authorController;
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
          await this.authorController.create();
          await pause();
          break;

        case "2":
          await this.authorController.listAll();
          await pause();
          break;

        case "3":
          await this.authorController.findById();
          await pause();
          break;

        case "4":
          await this.authorController.update();
          await pause();
          break;

        case "5":
          await this.authorController.delete();
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
    console.log("            AUTHORS MENU");
    console.log("======================================");
    console.log();
    console.log("1 - Register author");
    console.log("2 - List authors");
    console.log("3 - Find author by ID");
    console.log("4 - Update author");
    console.log("5 - Delete author");
    console.log();
    console.log("0 - Return to main menu");
    console.log();
  }
}
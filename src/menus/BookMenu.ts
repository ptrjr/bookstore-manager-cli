/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Book Menu
 * ---------------------------------------------------------
 */

import { BookController } from "../controllers/BookController";
import { pause, terminal } from "../utils/input";

export class BookMenu {
  private readonly bookController: BookController;

  constructor(
    bookController = new BookController(terminal),
  ) {
    this.bookController = bookController;
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
          await this.bookController.create();
          await pause();
          break;

        case "2":
          await this.bookController.listAll();
          await pause();
          break;

        case "3":
          await this.bookController.findById();
          await pause();
          break;

        case "4":
          await this.bookController.update();
          await pause();
          break;

        case "5":
          await this.bookController.delete();
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
    console.log("             BOOKS MENU");
    console.log("======================================");
    console.log();
    console.log("1 - Register book");
    console.log("2 - List books");
    console.log("3 - Find book by ID");
    console.log("4 - Update book");
    console.log("5 - Delete book");
    console.log();
    console.log("0 - Return to main menu");
    console.log();
  }
}
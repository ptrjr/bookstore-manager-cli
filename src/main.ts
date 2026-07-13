/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Application Entry Point
 * ---------------------------------------------------------
 */

import { MainMenu } from "./menus/MainMenu";
import { closeTerminal } from "./utils/input";

async function startApplication(): Promise<void> {
  try {
    const menu = new MainMenu();

    await menu.start();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred.";

    console.error(`\nApplication error: ${message}`);

    closeTerminal();
    process.exitCode = 1;
  }
}

void startApplication();
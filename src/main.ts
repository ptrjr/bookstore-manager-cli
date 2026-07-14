/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Application Entry Point
 * ---------------------------------------------------------
 */

import databasePool from "./database/connection";
import { MainMenu } from "./menus/MainMenu";
import { closeTerminal } from "./utils/input";

async function testDatabaseConnection(): Promise<void> {
  await databasePool.query("SELECT NOW()");
}

async function startApplication(): Promise<void> {
  try {
    console.log("Connecting to PostgreSQL...");

    await testDatabaseConnection();

    console.log("Database connection established successfully.");

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
  } finally {
    await databasePool.end();
  }
}

void startApplication();
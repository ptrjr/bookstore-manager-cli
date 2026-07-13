/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Terminal Input
 * Provides a shared readline interface for the application.
 * ---------------------------------------------------------
 */

import * as readline from "node:readline/promises";
import {
  stdin as input,
  stdout as output,
} from "node:process";

export const terminal = readline.createInterface({
  input,
  output,
});

export async function pause(): Promise<void> {
  await terminal.question("\nPress ENTER to continue...");
}

export function closeTerminal(): void {
  terminal.close();
}
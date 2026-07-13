/**
 * ---------------------------------------------------------
 * BookStore Manager CLI
 * Application Entry Point
 * ---------------------------------------------------------
 */

import databasePool from "./database/connection";

async function startApplication(): Promise<void> {
  try {
    const result = await databasePool.query(
      "SELECT NOW() AS current_time"
    );

    console.log("BookStore Manager CLI started successfully!");
    console.log("Database connected successfully.");
    console.log("Database time:", result.rows[0].current_time);
  } catch (error) {
    console.error("Failed to connect to the database.");

    if (error instanceof Error) {
      console.error(error.message);
    }
  } finally {
    await databasePool.end();
  }
}

startApplication();
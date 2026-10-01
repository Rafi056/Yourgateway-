/**
 * Vercel Serverless Function entry point for the API.
 * This imports the built Express app from artifacts/api-server.
 */
import app from "../artifacts/api-server/src/app";

export default app;

import app from "./app";
import { logger } from "./lib/logger";

logger.info("API server initialized (Vercel Serverless Function)");

// Export the Express app directly for Vercel Serverless Functions.
// Vercel will call this app as the request handler — no app.listen() needed.
export default app;

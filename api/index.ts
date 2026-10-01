import type { VercelRequest, VercelResponse } from "@vercel/node";

let appPromise: Promise<any> | null = null;

async function getApp() {
  if (!appPromise) {
    appPromise = import("../artifacts/api-server/dist/index.mjs").then(
      (mod) => mod.default
    );
  }
  return appPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (err) {
    console.error("API handler error:", err);
    res.status(500).json({ error: "API initialization failed" });
  }
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existing = await storage.getInstitutions();
  if (existing.length === 0) {
    // Universities
    const universities = [
      "APU", "Taylor's", "UCSI", "UNITEN", "Lincoln", "City", "MMU", "MSU", "SEGI", "Cyberjaya", "Mahsa", "Geometika", "Others"
    ];
    for (const name of universities) {
      await storage.createInstitution({
        name,
        type: "university",
        description: name === "Others" ? "Select this option if your desired university is not listed." : `Study at ${name}, one of Malaysia's leading universities.`,
        location: "Malaysia",
        imageUrl: null,
      });
    }

    // Language Centers
    const languageCenters = [
      "Britannia Language Centre", "Sheffield Academy", "EMS Language Centre", "Bright Language Center", 
      "Big Ben Academy", "EXCEL Language Center", "Erican Language Center", "Webster Language Center", 
      "Study circle language center", "Others"
    ];
    for (const name of languageCenters) {
      await storage.createInstitution({
        name,
        type: "language_center",
        description: name === "Others" ? "Select this option if your desired language center is not listed." : `Learn English at ${name}, a premier language institution.`,
        location: "Malaysia",
        imageUrl: null,
      });
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the DB
  seedDatabase().catch(console.error);

  app.get(api.institutions.list.path, async (req, res) => {
    try {
      const type = req.query.type as string | undefined;
      const data = await storage.getInstitutions(type);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.institutions.get.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const data = await storage.getInstitution(id);
      if (!data) {
        return res.status(404).json({ message: "Institution not found" });
      }
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.applications.create.path, async (req, res) => {
    try {
      // Coerce numeric institutionId if needed, though zod handles strings depending on schema definition
      // Let's ensure the body parser will handle coercion if needed
      const schema = api.applications.create.input.extend({
        institutionId: z.coerce.number(),
      });
      const input = schema.parse(req.body);
      const application = await storage.createApplication(input);
      res.status(201).json(application);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.applications.list.path, async (req, res) => {
    try {
      const data = await storage.getApplications();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.applications.get.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const data = await storage.getApplication(id);
      if (!data) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}

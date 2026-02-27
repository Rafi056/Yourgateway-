import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existing = await storage.getInstitutions();
  if (existing.length === 0) {
    // Universities
    await storage.createInstitution({
      name: "Universiti Malaya (UM)",
      type: "university",
      description: "Malaysia's oldest university, situated in Kuala Lumpur.",
      location: "Kuala Lumpur, Malaysia",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600",
    });
    await storage.createInstitution({
      name: "Taylor's University",
      type: "university",
      description: "A premier private university located in Subang Jaya.",
      location: "Subang Jaya, Malaysia",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600",
    });

    // Language Centers
    await storage.createInstitution({
      name: "ELS Language Centers",
      type: "language_center",
      description: "Top-tier English language learning center for international students.",
      location: "Kuala Lumpur, Malaysia",
      imageUrl: "https://images.unsplash.com/photo-1571260899304-42507011ec7a?auto=format&fit=crop&q=80&w=600",
    });
    await storage.createInstitution({
      name: "British Council Malaysia",
      type: "language_center",
      description: "Worldwide organization for cultural relations and educational opportunities.",
      location: "Kuala Lumpur, Malaysia",
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600",
    });
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
